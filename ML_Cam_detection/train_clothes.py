# train_clothes.py
"""
Train clothes classifier.
Folder structure:
Dataset/
    Pants/
    Shirt/
    Shorts/
    T-Shirt/
"""

import os
import datetime
import numpy as np
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, applications, callbacks, optimizers
from sklearn.metrics import classification_report, confusion_matrix

parser = argparse.ArgumentParser()
parser.add_argument("--data_dir", type=str, default="Dataset")
parser.add_argument("--output_dir", type=str, default="output")
parser.add_argument("--img_size", type=int, default=224)
parser.add_argument("--batch_size", type=int, default=16)
parser.add_argument("--epochs", type=int, default=20)
parser.add_argument("--use_tl", action="store_true", help="Use transfer-learning MobileNetV2")
args = parser.parse_args()

DATA_DIR = args.data_dir
OUT_DIR = args.output_dir
IMG_SIZE = (args.img_size, args.img_size)
BATCH_SIZE = args.batch_size
EPOCHS = args.epochs
USE_TL = args.use_tl

os.makedirs(OUT_DIR, exist_ok=True)

# --- Load dataset (split train/val) ---
seed = 123
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=seed,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=seed,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
num_classes = len(class_names)
print("Detected classes:", class_names)

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

def compute_class_weights(data_dir, class_names):
    counts = []
    for c in class_names:
        p = os.path.join(data_dir, c)
        if not os.path.isdir(p):
            counts.append(0)
        else:
            counts.append(len([f for f in os.listdir(p) if f.lower().endswith(('.jpg','.jpeg','.png'))]))
    total = sum(counts) if sum(counts)>0 else 1
    class_weights = {i: total/(len(counts)*count) if count>0 else 1.0 for i, count in enumerate(counts)}
    return class_weights, counts

class_weights, counts = compute_class_weights(DATA_DIR, class_names)
print("Counts per class:", dict(zip(class_names, counts)))
print("Class weights:", class_weights)

# --- Data augmentation layer (in-model) ---
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.06),
    layers.RandomZoom(0.06),
    layers.RandomContrast(0.06),
], name="data_augmentation")

# --- Model definitions ---
def build_small_cnn(input_shape=(*IMG_SIZE,3), n_classes=num_classes):
    inputs = layers.Input(shape=input_shape)
    x = data_augmentation(inputs)
    x = layers.Rescaling(1./255)(x)
    x = layers.Conv2D(32, 3, activation="relu", padding="same")(x)
    x = layers.MaxPool2D()(x)
    x = layers.Conv2D(64, 3, activation="relu", padding="same")(x)
    x = layers.MaxPool2D()(x)
    x = layers.Conv2D(128, 3, activation="relu", padding="same")(x)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation="relu")(x)
    outputs = layers.Dense(n_classes, activation="softmax")(x)
    return models.Model(inputs, outputs)

def build_tl_mobilenet(input_shape=(*IMG_SIZE,3), n_classes=num_classes):
    base = applications.MobileNetV2(input_shape=input_shape, include_top=False, weights="imagenet")
    base.trainable = False
    inputs = layers.Input(shape=input_shape)
    x = data_augmentation(inputs)
    x = layers.Rescaling(1./255)(x)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation="relu")(x)
    outputs = layers.Dense(n_classes, activation="softmax")(x)
    return models.Model(inputs, outputs)

model = build_tl_mobilenet() if USE_TL else build_small_cnn()
model.summary()

model.compile(optimizer=optimizers.Adam(1e-3),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"])

# Callbacks
ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
ckpt = os.path.join(OUT_DIR, f"best_{ts}.h5")
tb_dir = os.path.join(OUT_DIR, "logs", ts)
cb = [
    callbacks.ModelCheckpoint(ckpt, save_best_only=True, monitor="val_loss"),
    callbacks.EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True),
    callbacks.TensorBoard(log_dir=tb_dir),
    callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3)
]

history = model.fit(train_ds,
                    validation_data=val_ds,
                    epochs=EPOCHS,
                    class_weight=class_weights,
                    callbacks=cb)

final_model_path = os.path.join(OUT_DIR, f"final_model_{ts}.h5")
model.save(final_model_path)
print("Saved model to:", final_model_path)

# --- Quick evaluation on validation set ---
y_true = []
y_pred = []
for images, labels in val_ds.unbatch().batch(1):
    preds = model.predict(images, verbose=0)
    y_true.append(int(labels.numpy()[0]))
    y_pred.append(int(np.argmax(preds[0])))
y_true = np.array(y_true); y_pred = np.array(y_pred)
print("Classification report:")
print(classification_report(y_true, y_pred, target_names=class_names, digits=4))
print("Confusion matrix (counts):")
print(confusion_matrix(y_true, y_pred))
