import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

# Load the dataset
print("Loading dataset...")
try:
    rawData = pd.read_csv('../dataset1.csv')
    print("Dataset loaded successfully!")
except FileNotFoundError:
    print("Dataset not found. Please make sure 'dataset1.csv' is in the parent directory.")
    exit(1)

# Rename 'Output' column to 'fertility' if it exists
if 'Output' in rawData.columns:
    rawData = rawData.rename(columns={'Output': 'fertility'})

# Prepare features and labels
print("Preparing features and labels...")
features = rawData.drop('fertility', axis=1)
labels = rawData['fertility']

# Apply log transformation to features
transformedFeatures = features.apply(lambda x: np.log10(x) if np.issubdtype(x.dtype, np.number) else x)

# Split the data
print("Splitting data into training and validation sets...")
trainInput, validationInput, trainTarget, validationTarget = train_test_split(
    transformedFeatures, labels, test_size=0.2, shuffle=True, random_state=42
)

# Train Random Forest model
print("Training Random Forest model...")
forestClf = RandomForestClassifier(n_estimators=100, random_state=42)
forestClf.fit(trainInput, trainTarget)

# Save the model
print("Saving model to 'model/random_forest_model.pkl'...")
with open('model/random_forest_model.pkl', 'wb') as f:
    pickle.dump(forestClf, f)

print("Model extraction complete!")
