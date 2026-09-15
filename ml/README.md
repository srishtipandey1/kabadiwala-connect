# Material Classifier Proof of Concept

The classifier has now been trained on the downloaded Kaggle dataset. Dataset
provenance and the Roboflow/Alamy decisions are recorded in [SOURCES.md](SOURCES.md).

Run from the repository root:

```bash
python ml/train_material_model.py
```

The default data path is `ml/dataset/kaggle/modified-dataset`.

The training script requires independently labeled images. It applies
augmentation only to training data, fine-tunes the final MobileNetV2 layers,
evaluates a held-out test split, and writes:

- `ml/artifacts/material_classifier.keras`
- `ml/artifacts/training_report.json`

The default command refuses to run if a class has fewer than 30 images. The
report includes test accuracy, macro precision, macro recall, macro F1, and a
confusion matrix. Use consented or appropriately sourced images with class,
condition, source type, approximate weight, and location metadata. Keep a
collector or photo-session split in the final test set to prevent duplicate
image leakage. Do not use predictions alone for payment, safety, or compliance.

## App integration

When `ml/artifacts/material_classifier.keras` exists, Snap Estimate calls
`POST /api/ml/predict-material` first. The Express route invokes
`ml/predict_material.py`; if the local model is unavailable, the existing Gemini
vision route remains the fallback. The local classifier supplies category and
confidence, while the application continues to use its benchmark price table
for valuation and requires manual verification of condition and purity.