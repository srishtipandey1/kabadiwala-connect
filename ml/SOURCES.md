# ML Dataset Sources

## Used for the trained classifier

- **E Waste Image Dataset**: https://www.kaggle.com/datasets/akshat103/e-waste-image-dataset
- License shown by Kaggle: Apache 2.0
- Downloaded file: `ml/downloads/kaggle-e-waste.zip`
- Extracted data: `ml/dataset/kaggle/modified-dataset`
- Dataset-provided split: 2,400 train, 300 validation, 300 test images
- Classes: Battery, Keyboard, Microwave, Mobile, Mouse, PCB, Player, Printer, Television, Washing Machine
- The dataset card states that images were collected from diverse sources; image-level provenance and field representativeness are not independently verified by this project.

## Reviewed but not downloaded

- **Balanced E-Waste Dataset**: https://universe.roboflow.com/electronic-waste-detection/balanced-e-waste-dataset/dataset/1
- License shown by Roboflow: CC BY 4.0
- Listed size: 19,612 images with train/validation/test splits
- The public export endpoint returned HTTP 403 in this environment, so it was not used.

- **Alamy copper windings search**: https://www.alamy.com/stock-photo/copper-windings-transformer.html?sortBy=relevant
- This is a commercial stock-photo search page, not a clearly licensed machine-learning dataset. It was excluded to avoid copyright and training-use ambiguity.