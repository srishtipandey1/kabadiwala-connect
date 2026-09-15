"""Train a leakage-aware e-waste image classifier.

Expected layout: ml/dataset/<material-key>/*.jpg. The script deliberately
refuses the prototype's one-image illustrative samples.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras import callbacks, layers
from tensorflow.keras.applications import MobileNetV2

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def validate_dataset(data_dir: Path, minimum_images: int) -> tuple[list[str], int]:
    if not data_dir.exists():
        raise SystemExit(f"Dataset not found: {data_dir}. Add ml/dataset/<class>/*.jpg images.")
    class_root = data_dir / "train" if (data_dir / "train").exists() else data_dir
    class_names = sorted(path.name for path in class_root.iterdir() if path.is_dir())
    if len(class_names) < 2:
        raise SystemExit("At least two material class folders are required.")
    counts = {name: sum(path.suffix.lower() in IMAGE_EXTENSIONS for path in (class_root / name).iterdir()) for name in class_names}
    insufficient = {name: count for name, count in counts.items() if count < minimum_images}
    if insufficient:
        raise SystemExit(f"Insufficient independent images per class: {insufficient}; need {minimum_images}.")
    return class_names, sum(counts.values())


def make_datasets(data_dir: Path, image_size: int, batch_size: int, seed: int):
    augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal"), layers.RandomRotation(0.08),
        layers.RandomZoom(0.15), layers.RandomContrast(0.15),
    ], name="training_augmentation")
    train_dir = data_dir / "train" if (data_dir / "train").exists() else data_dir
    validation_dir = data_dir / "val" if (data_dir / "val").exists() else data_dir
    test_dir = data_dir / "test" if (data_dir / "test").exists() else validation_dir
    train_ds = tf.keras.utils.image_dataset_from_directory(
        train_dir, image_size=(image_size, image_size), batch_size=batch_size, seed=seed,
    )
    validation_ds = tf.keras.utils.image_dataset_from_directory(
        validation_dir, image_size=(image_size, image_size), batch_size=batch_size, shuffle=False,
    )
    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir, image_size=(image_size, image_size), batch_size=batch_size, shuffle=False,
    )
    class_names = train_ds.class_names

    def prepare(images, labels, training=False):
        images = tf.cast(images, tf.float32)
        if training:
            images = augmentation(images, training=True)
        return tf.keras.applications.mobilenet_v2.preprocess_input(images), labels

    return (train_ds.map(lambda x, y: prepare(x, y, True)).prefetch(tf.data.AUTOTUNE),
            validation_ds.map(prepare).prefetch(tf.data.AUTOTUNE),
            test_ds.map(prepare).prefetch(tf.data.AUTOTUNE), class_names)


def build_model(class_count: int, image_size: int) -> tf.keras.Model:
    base = MobileNetV2(include_top=False, weights="imagenet", input_shape=(image_size, image_size, 3))
    base.trainable = False
    model = tf.keras.Sequential([
        layers.Input(shape=(image_size, image_size, 3)), base,
        layers.GlobalAveragePooling2D(), layers.Dropout(0.30),
        layers.Dense(class_count, activation="softmax"),
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
                  loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def train(data_dir: Path, output_dir: Path, epochs: int, fine_tune_epochs: int, minimum_images: int) -> dict:
    _, image_count = validate_dataset(data_dir, minimum_images)
    train_ds, validation_ds, test_ds, class_names = make_datasets(data_dir, 224, 16, 42)
    model = build_model(len(class_names), 224)
    output_dir.mkdir(parents=True, exist_ok=True)
    checkpoint = output_dir / "best_material_classifier.keras"
    monitor = [callbacks.EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True),
               callbacks.ModelCheckpoint(str(checkpoint), monitor="val_accuracy", save_best_only=True)]
    model.fit(train_ds, validation_data=validation_ds, epochs=epochs, callbacks=monitor, verbose=2)

    base = model.layers[0]
    base.trainable = True
    for layer in base.layers[:-30]:
        layer.trainable = False
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
                  loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(train_ds, validation_data=validation_ds, epochs=fine_tune_epochs, callbacks=monitor, verbose=2)

    actual, predicted = [], []
    for images, labels in test_ds:
        actual.extend(labels.numpy().tolist())
        predicted.extend(np.argmax(model.predict(images, verbose=0), axis=1).tolist())
    scores = classification_report(actual, predicted, target_names=class_names, output_dict=True, zero_division=0)
    report = {
        "model": "MobileNetV2 transfer learning with final-layer fine-tuning",
        "classes": class_names, "imageCount": image_count,
        "minimumImagesPerClass": minimum_images,
        "split": "Dataset-provided train/validation/test folders",
        "testAccuracy": round(float(scores["accuracy"]), 4),
        "macroPrecision": round(float(scores["macro avg"]["precision"]), 4),
        "macroRecall": round(float(scores["macro avg"]["recall"]), 4),
        "macroF1": round(float(scores["macro avg"]["f1-score"]), 4),
        "classificationReport": scores,
        "confusionMatrix": confusion_matrix(actual, predicted).tolist(),
        "limitations": ["Use only independently labeled, representative images.",
                        "Do not use predictions alone for payment, safety, or compliance decisions."],
    }
    model.save(output_dir / "material_classifier.keras")
    (output_dir / "training_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=Path("ml/dataset/kaggle/modified-dataset"))
    parser.add_argument("--output", type=Path, default=Path("ml/artifacts"))
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--fine-tune-epochs", type=int, default=8)
    parser.add_argument("--minimum-images", type=int, default=30)
    args = parser.parse_args()
    train(args.data, args.output, args.epochs, args.fine_tune_epochs, args.minimum_images)
