
import argparse
import glob
import os
import sys
import time
from collections import deque, Counter

import cv2
import numpy as np
import requests
import tensorflow as tf


def find_latest_model(model_dir="output"):
    files = glob.glob(os.path.join(model_dir, "*.h5"))
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]


def load_class_file_for_model(model_path):
    class_file = os.path.join(os.path.dirname(model_path), "class_names.txt")
    if os.path.exists(class_file):
        try:
            with open(class_file, "r", encoding="utf-8") as f:
                line = f.read().strip()
                if line:
                    return [c.strip() for c in line.split(",") if c.strip()]
        except Exception:
            pass
    return None


def fetch_jpeg(url, timeout=2.0):
    try:
        r = requests.get(url, timeout=timeout)
        if r.status_code == 200:
            return r.content
    except Exception:
        return None
    return None


def jpeg_to_bgr(jpeg_bytes):
    arr = np.frombuffer(jpeg_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)  # BGR
    return img


def preprocess_for_model(bgr_img, target_size):
    # center-crop to square
    h, w = bgr_img.shape[:2]
    min_dim = min(h, w)
    top = (h - min_dim) // 2
    left = (w - min_dim) // 2
    crop = bgr_img[top: top + min_dim, left: left + min_dim]

    # convert BGR -> RGB, resize, normalize
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(rgb, (target_size, target_size))
    x = resized.astype("float32") / 255.0
    x = np.expand_dims(x, axis=0)  # batch dimension
    return x, crop  # return cropped original for display


def collapse_to_binary(label: str) -> str:
    pant_set = {"Pants", "Shorts", "pants", "shorts"}
    shirt_set = {"Shirt", "T-Shirt", "Tshirt", "T-shirt", "shirt", "t-shirt"}
    if label in pant_set:
        return "pant"
    if label in shirt_set:
        return "shirt"
    return label


def main():
    p = argparse.ArgumentParser(description="Fetch image from IP and run Keras model prediction.")
    p.add_argument("--url", required=True, help="ESP32 IP or capture URL, e.g. http://10.11.16.39/ or http://10.11.16.39/capture")
    p.add_argument("--model", default=None, help="Path to .h5 model (default: latest in output/)")
    p.add_argument("--model_dir", default="output", help="Directory to search for latest model if --model omitted")
    p.add_argument("--img_size", type=int, default=224, help="Model input image size (square)")
    p.add_argument("--classes", default=None, help="Comma-separated class names in training order (overrides saved file)")
    p.add_argument("--binary", action="store_true", help="Collapse classes into 'shirt' vs 'pant'")
    p.add_argument("--smooth", type=int, default=7, help="Temporal smoothing window (frames). Set 0 to disable.")
    p.add_argument("--confidence", type=float, default=0.45, help="Confidence threshold for green label color")
    p.add_argument("--interval", type=float, default=0.12, help="Delay between fetches (seconds)")
    args = p.parse_args()

    url_base = args.url.rstrip("/")
    candidate_urls = [url_base, url_base + "/capture", url_base + "/jpg"]  # try these until one returns an image

    # choose model
    model_path = args.model or find_latest_model(args.model_dir)
    if model_path is None or not os.path.isfile(model_path):
        print(f"[ERROR] No model found in '{args.model_dir}'. Place a .h5 model there or pass --model")
        sys.exit(1)
    print("[INFO] Using model:", model_path)

    # determine class order
    class_names = None
    if args.classes:
        class_names = [c.strip() for c in args.classes.split(",") if c.strip()]
        print("[INFO] Using classes from --classes:", class_names)
    else:
        loaded = load_class_file_for_model(model_path)
        if loaded:
            class_names = loaded
            print(f"[INFO] Loaded class order from file near the model: {class_names}")

    if class_names is None:
        class_names = ["Pants", "Shirt", "Shorts", "T-Shirt"]
        print("[WARN] No class_names found. Using default:", class_names)
        print('If predictions are wrong, re-run with: --classes "Pants,Shirt,Shorts,T-Shirt"')

    # load model
    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        print("[ERROR] Failed to load model:", e)
        sys.exit(1)

    IMG_SIZE = args.img_size
    window_name = "ESP32 -> Model (press q to quit)"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    pred_queue = deque(maxlen=args.smooth if args.smooth > 0 else 1)
    print("[INFO] Fetching from:", candidate_urls)
    try:
        while True:
            jpeg = None
            used_url = None
            for cu in candidate_urls:
                jpeg = fetch_jpeg(cu)
                if jpeg:
                    used_url = cu
                    break
            if jpeg is None:
                # nothing fetched, wait and retry
                time.sleep(max(0.2, args.interval))
                continue

            frame = jpeg_to_bgr(jpeg)
            if frame is None:
                time.sleep(0.1)
                continue

            x, cropped_display = preprocess_for_model(frame, IMG_SIZE)
            preds = model.predict(x, verbose=0)[0]
            idx = int(np.argmax(preds))
            prob = float(preds[idx])

            label = class_names[idx] if idx < len(class_names) else f"cls{idx}"

            # temporal smoothing
            pred_queue.append(label)
            if args.smooth > 0:
                display_label = Counter(pred_queue).most_common(1)[0][0]
            else:
                display_label = label

            broad = collapse_to_binary(display_label) if args.binary else display_label
            text = f"{display_label} ({broad}) {prob:.2f}"
            color = (0, 255, 0) if prob >= args.confidence else (0, 180, 255)

            # overlay predictions
            disp = cropped_display.copy()
            cv2.putText(disp, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2, cv2.LINE_AA)

            # top-3
            topk = np.argsort(preds)[-3:][::-1]
            y0 = 60
            for i, tidx in enumerate(topk):
                tlabel = class_names[tidx] if tidx < len(class_names) else f"cls{tidx}"
                tprob = preds[tidx]
                cv2.putText(disp, f"{tlabel}: {tprob:.2f}", (10, y0 + 25 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (230, 230, 230), 1, cv2.LINE_AA)

            # show source
            src_text = f"src: {used_url}"
            cv2.putText(disp, src_text, (10, disp.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1, cv2.LINE_AA)

            cv2.imshow(window_name, disp)
            print(f"[PRED] {display_label} ({broad}) prob={prob:.3f}  src={used_url}")

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q"):
                break

            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Exiting.")
    finally:
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
