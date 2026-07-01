import pickle
import m2cgen as m2c
import os

# Define paths
MODEL_PATH = os.path.join('model', 'random_forest_model.pkl')
OUTPUT_PATH = os.path.join('mobile-app', 'src', 'utils', 'ModelInference.js')

# Ensure output directory exists
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

print(f"Loading model from {MODEL_PATH}...")

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    
    print("Model loaded successfully.")
    
    # Transpile model to JavaScript
    print("Converting model to JavaScript...")
    js_code = m2c.export_to_javascript(model, function_name='predict')
    
    # Add export statement for React Native
    final_js_code = js_code + "\n\nexport { predict };"
    
    # Save to file
    with open(OUTPUT_PATH, 'w') as f:
        f.write(final_js_code)
        
    print(f"Model converted and saved to {OUTPUT_PATH}")

except FileNotFoundError:
    print(f"Error: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"An error occurred: {str(e)}")
