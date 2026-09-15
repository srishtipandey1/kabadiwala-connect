"""Predict one image with the trained material classifier and print JSON."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf

LABEL_TO_PROJECT_KEY = {
    "Battery": "lithium-ion-battery",
    "Keyboard": "smps-power-supply",
    "Microwave": "smps-power-supply",
    "Mobile": "mobile-phone-mixed",
    "Mouse": "smps-power-supply",
    "PCB": "motherboard-mid",
    "Player": "smps-power-supply",
    "Printer": "smps-power-supply",
    "Television": "crt-monitor",
    "Washing Machine": "electric-copper-motor",
}


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: predict_material.py MODEL IMAGE")
    model_path, image_path = map(Path, sys.argv[1:])
    model = tf.keras.models.load_model(model_path)
    image = tf.keras.utils.load_img(image_path, target_size=(224, 224))
    array = tf.keras.utils.img_to_array(image)[None, ...]
    array = tf.keras.applications.mobilenet_v2.preprocess_input(array)
    probabilities = model.predict(array, verbose=0)[0]
    index = int(np.argmax(probabilities))
    labels = list(LABEL_TO_PROJECT_KEY)
    source_label = labels[index]
    print(json.dumps({
        "sourceLabel": source_label,
        "detectedKey": LABEL_TO_PROJECT_KEY[source_label],
        "confidenceScore": round(float(probabilities[index]), 4),
        "model": "MobileNetV2 Kaggle e-waste classifier",
    }))


if __name__ == "__main__":
    main()
