# auto_camera_worker.py
"""
Auto worker: poll RTDB for Dropped nodes, capture frames from ESP32-CAM,
predict with Keras model, aggregate counts and update same RTDB node.

Place this file in your project root and configure CONFIG below.
"""

import os
import time
import glob
from collections import Counter
import requests
import numpy as np
import cv2
import tensorflow as tf
from firebase_camera_updater import init_firebase, write_counts_to_rtdb

# ---------- CONFIG: edit these ----------
SERVICE_ACCOUNT_PATH = "serviceAccountKey.json"   # must match file on disk
FIREBASE_DB_URL = "https://laundry-management-syste-f2103-default-rtdb.firebaseio.com"  # your RTDB URL
ESP_URL = "http://10.11.16.39/"   # ESP32-CAM base URL (test in browser: http://10.11.16.39/capture)
MODEL_DIR = "output"              # directory that contains your .h5 model
CAPTURE_COUNT = 6                 # number of frames per transaction
CAPTURE_INTERVAL = 0.12           # seconds between frames
POLL_INTERVAL = 3.0               # seconds between DB polls
IMG_SIZE = 224                    # model input size
# ----------------------------------------

# ---- load TF model (latest .h5 in MODEL_DIR) ----
def find_latest_model(model_dir=MODEL_DIR):
    files = glob.glob(os.path.join(model_dir, "*.h5"))
    if not files:
        return None
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

MODEL_PATH = find_latest_model()
if MODEL_PATH is None:
    raise SystemExit("[ERROR] No .h5 model found in 'output/'. Place your trained model there.")
print("[model] loading:", MODEL_PATH)
MODEL = tf.keras.models.load_model(MODEL_PATH)
print("[model] loaded")

# ---- try to load class names saved at training time (optional) ----
def load_class_names_from_model(model_path=MODEL_PATH):
    path = os.path.join(os.path.dirname(model_path), "class_names.txt")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            line = f.read().strip()
            if line:
                return [c.strip() for c in line.split(",") if c.strip()]
    # fallback default
    return ["Pants", "Shirt", "Shorts", "T-Shirt"]

CLASS_NAMES = load_class_names_from_model()
print("[model] class names:", CLASS_NAMES)

# ---- HTTP session for reuse ----
session = requests.Session()

def fetch_jpeg(url, timeout=1.8):
    """Return JPEG bytes or None."""
    try:
        r = session.get(url, timeout=timeout)
        if r.status_code == 200:
            return r.content
    except Exception:
        return None
    return None

def jpeg_to_bgr(jpeg_bytes):
    arr = np.frombuffer(jpeg_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img

def preprocess_for_model(bgr_img, target_size=IMG_SIZE):
    h, w = bgr_img.shape[:2]
    min_dim = min(h,w)
    top = (h - min_dim)//2
    left = (w - min_dim)//2
    crop = bgr_img[top:top+min_dim, left:left+min_dim]
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    resized = cv2.resize(rgb, (target_size, target_size))
    x = resized.astype("float32") / 255.0
    return np.expand_dims(x, axis=0)

def predict_label(frame_bgr):
    x = preprocess_for_model(frame_bgr)
    preds = MODEL.predict(x, verbose=0)[0]
    idx = int(np.argmax(preds))
    label = CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else f"cls{idx}"
    prob = float(preds[idx])
    return label, prob

def capture_labels_from_esp(esp_base_url, n=CAPTURE_COUNT, interval=CAPTURE_INTERVAL):
    labels = []
    # try these endpoints in order
    candidates = [esp_base_url.rstrip("/"), esp_base_url.rstrip("/") + "/capture"]
    for i in range(n):
        jpeg = None
        for c in candidates:
            jpeg = fetch_jpeg(c)
            if jpeg:
                used = c
                break
        if not jpeg:
            print(f"[capture] attempt {i+1}: no image from {candidates}")
            time.sleep(interval)
            continue
        frame = jpeg_to_bgr(jpeg)
        if frame is None:
            print(f"[capture] attempt {i+1}: decode fail")
            time.sleep(interval)
            continue
        label, prob = predict_label(frame)
        labels.append(label)
        print(f"[capture] #{i+1} -> {label} ({prob:.2f})")
        time.sleep(interval)
    return labels

# Aggregate map (shirts/pants/others)
def aggregate_counts(labels):
    shirts_set = {"Shirt", "T-Shirt", "Tshirt", "T-shirt", "shirt", "t-shirt"}
    pants_set = {"Pants", "Shorts", "pants", "shorts"}
    counts = {"shirts":0, "pants":0, "others":0}
    for L in labels:
        if L in shirts_set:
            counts["shirts"] += 1
        elif L in pants_set:
            counts["pants"] += 1
        else:
            counts["others"] += 1
    counts["total_clothes"] = counts["shirts"] + counts["pants"] + counts["others"]
    return counts

# Poll DB for nodes to process
import firebase_admin
from firebase_admin import credentials, db

def init_firebase_admin():
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {"databaseURL": FIREBASE_DB_URL})
    print("[firebase] admin ready")

def find_nodes_to_process(root="/Users"):
    ref = db.reference(root)
    all_nodes = ref.get() or {}
    todo = []
    for rfid, rdata in all_nodes.items():
        if not isinstance(rdata, dict):
            continue
        for ts_key, tx in rdata.items():
            if not isinstance(tx, dict):
                continue
            status = tx.get("status")
            cam_time = tx.get("camera_last_updated")
            if status == "Dropped" and (not cam_time):
                todo.append((rfid, ts_key))
    return todo

def main():
    print("[worker] starting")
    # init firebase via helper and firebase_admin here
    init_firebase()             # from firebase_camera_updater (initializes admin)
    init_firebase_admin()       # make sure firebase_admin also initialized for reading
    print("[worker] ready, polling every", POLL_INTERVAL, "s")
    try:
        while True:
            todo = find_nodes_to_process("/Users")
            if todo:
                print(f"[worker] found {len(todo)} dropped nodes")
            for (rfid, ts_key) in todo:
                print(f"[worker] process -> rfid:{rfid}  ts:{ts_key}")
                labels = capture_labels_from_esp(ESP_URL, n=CAPTURE_COUNT)
                if labels:
                    counts = aggregate_counts(labels)
                    write_counts_to_rtdb(rfid, ts_key, counts)
                else:
                    print("[worker] no labels captured for", rfid, ts_key)
            time.sleep(POLL_INTERVAL)
    except KeyboardInterrupt:
        print("[worker] stopped by user")

if __name__ == "__main__":
    main()
