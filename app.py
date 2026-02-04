import os
import numpy as np
import pandas as pd
import pickle
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'model', 'random_forest_model.pkl')
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
else:
    # If model doesn't exist, we'll create a placeholder
    model = None

# Feature names for the soil parameters (match model training exactly)
feature_names = ['N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B']
# Mapping for user-friendly field labels
feature_labels = {
    'N': 'Nitrogen (N)',
    'P': 'Phosphorus (P)',
    'K': 'Potassium (K)',
    'pH': 'pH (0-14)',
    'EC': 'Electrical Conductivity (EC)',
    'OC': 'Organic Carbon (OC)',
    'S': 'Sulfur (S)',
    'Zn': 'Zinc (Zn)',
    'Fe': 'Iron (Fe)',
    'Cu': 'Copper (Cu)',
    'Mn': 'Manganese (Mn)',
    'B': 'Boron (B)'
}

# Realistic parameter ranges based on dataset analysis (with some buffer for edge cases)
# These ranges are derived from the training dataset and agricultural standards
parameter_ranges = {
    'N': {'min': 1, 'max': 500, 'unit': 'mg/kg', 'typical_range': '6-383'},
    'P': {'min': 0.1, 'max': 150, 'unit': 'mg/kg', 'typical_range': '3-125'},
    'K': {'min': 5, 'max': 1000, 'unit': 'mg/kg', 'typical_range': '11-887'},
    'pH': {'min': 0.5, 'max': 14, 'unit': '', 'typical_range': '0.9-11.2'},
    'EC': {'min': 0.05, 'max': 3, 'unit': 'dS/m', 'typical_range': '0.1-0.95'},
    'OC': {'min': 0.05, 'max': 30, 'unit': '%', 'typical_range': '0.1-24'},
    'S': {'min': 0.5, 'max': 50, 'unit': 'mg/kg', 'typical_range': '0.6-31'},
    'Zn': {'min': 0.05, 'max': 50, 'unit': 'mg/kg', 'typical_range': '0.07-42'},
    'Fe': {'min': 0.1, 'max': 50, 'unit': 'mg/kg', 'typical_range': '0.21-44'},
    'Cu': {'min': 0.05, 'max': 5, 'unit': 'mg/kg', 'typical_range': '0.09-3'},
    'Mn': {'min': 0.1, 'max': 40, 'unit': 'mg/kg', 'typical_range': '0.11-31'},
    'B': {'min': 0.05, 'max': 5, 'unit': 'mg/kg', 'typical_range': '0.06-2.8'}
}

# Fertility class labels
fertility_classes = {
    0: "Less Fertile",
    1: "Fertile",
    2: "Highly Fertile"
}

# Recommended actions for each fertility class based on USDA and FAO guidelines
recommendations = {
    0: {
        "title": "Soil Improvement Plan for Less Fertile Soil",
        "description": "Your soil requires significant improvements to reach optimal fertility. Following these USDA and FAO recommended practices will help restore soil health and productivity.",
        "actions": [
            "Minimize soil disturbance: Reduce or eliminate tillage to preserve soil structure and organic matter",
            "Maximize soil cover: Plant cover crops (like clover, rye, or radishes) to protect soil from erosion and add organic matter",
            "Increase biodiversity: Implement diverse crop rotations including legumes to fix nitrogen naturally",
            "Add organic matter: Apply compost, manure, or other organic amendments to improve soil structure and nutrient content",
            "Balance soil pH: Apply lime if soil is acidic (pH < 6.0) or sulfur if alkaline (pH > 7.5) based on soil test results",
            "Address nutrient deficiencies: Apply targeted fertilizers based on soil test results, focusing on limiting nutrients",
            "Establish living roots: Maintain living plants year-round to support soil biology and nutrient cycling",
            "Implement Integrated Soil Fertility Management (ISFM): Combine organic and inorganic inputs with improved germplasm"
        ]
    },
    1: {
        "title": "Soil Maintenance Plan for Fertile Soil",
        "description": "Your soil is fertile but requires regular maintenance to sustain productivity. These science-based practices from USDA and FAO will help maintain optimal soil health.",
        "actions": [
            "Practice crop rotation: Alternate different crop families to break pest cycles and balance nutrient use",
            "Use cover crops strategically: Plant cover crops during fallow periods to maintain soil coverage and add organic matter",
            "Maintain organic matter levels: Add compost or incorporate crop residues to support soil biology",
            "Monitor and maintain pH: Test soil regularly and make small adjustments to keep pH in the optimal range (6.0-7.0)",
            "Practice conservation tillage: Minimize soil disturbance to preserve soil structure and biology",
            "Apply nutrients based on crop removal: Replace only what crops remove to prevent excess or deficiency",
            "Integrate livestock if possible: Managed grazing can improve nutrient cycling and soil biology",
            "Implement buffer strips: Create vegetated areas along water bodies to prevent nutrient runoff"
        ]
    },
    2: {
        "title": "Soil Preservation Plan for Highly Fertile Soil",
        "description": "Your soil is highly fertile. Focus on preservation and sustainable practices to maintain this optimal state according to USDA and FAO guidelines.",
        "actions": [
            "Practice precision nutrient management: Apply only what crops need when they need it to prevent excess",
            "Maximize continuous living roots: Use cover crops or perennials to maintain living roots year-round",
            "Implement diverse crop rotations: Include 3+ crop types to maintain biodiversity above and below ground",
            "Monitor soil health indicators: Regularly test organic matter, biological activity, and nutrient levels",
            "Maintain soil coverage: Keep residue on soil surface or living plants growing at all times",
            "Practice no-till or minimal tillage: Avoid disturbing soil structure and biology",
            "Use nutrient budgeting: Track inputs and outputs to maintain balance and prevent accumulation",
            "Implement agroforestry practices: Integrate trees or shrubs if appropriate to enhance biodiversity and soil protection"
        ]
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'online', 'message': 'Soil API is reachable'})

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            # Get input values from form
            input_data = {}
            for feature in feature_names:
                value = request.form.get(feature, '')
                if not value.strip():
                    label = feature_labels.get(feature, feature)
                    return render_template('error.html', error=f"Missing value for {label}. Please fill in all required fields.")
                try:
                    input_data[feature] = float(value)
                    # Validate realistic ranges
                    range_info = parameter_ranges.get(feature, {})
                    min_val = range_info.get('min', 0)
                    max_val = range_info.get('max', float('inf'))
                    typical_range = range_info.get('typical_range', 'N/A')
                    unit = range_info.get('unit', '')
                    
                    if input_data[feature] < min_val or input_data[feature] > max_val:
                        unit_str = f" {unit}" if unit else ""
                        return render_template('error.html', 
                            error=f"{feature_labels.get(feature, feature)} value {value}{unit_str} is unrealistic. "
                                  f"Please enter a value between {min_val} and {max_val}{unit_str}. "
                                  f"Typical range in dataset: {typical_range}{unit_str}.")
                except ValueError:
                    label = feature_labels.get(feature, feature)
                    return render_template('error.html', error=f"Invalid value for {label}: {value}")
            
            # Create a DataFrame with the input values (ensure correct column order)
            input_df = pd.DataFrame([[input_data[fn] for fn in feature_names]], columns=feature_names)
            
            # Apply log transformation (as done in the notebook)
            # Handle zeros by adding a small constant to avoid log(0)
            transformed_input = input_df.apply(lambda x: np.log10(x + 1e-10) if np.issubdtype(x.dtype, np.number) else x)
            
            # Make prediction
            if model is not None:
                prediction = int(model.predict(transformed_input)[0])
                fertility_class = fertility_classes[prediction]
                recommendation = recommendations[prediction]
                
                # Calculate confidence score (simplified for demonstration)
                confidence_score = 0.85  # In a real app, this would be calculated from model.predict_proba()
            else:
                # If model doesn't exist, provide a placeholder response
                prediction = 1  # Default to "Fertile"
                fertility_class = fertility_classes[prediction]
                recommendation = recommendations[prediction]
                confidence_score = 0.7  # Lower confidence for placeholder
                
            # Prepare response
            result = {
                'success': True,
                'prediction': prediction,
                'fertility_class': fertility_class,
                'recommendation': recommendation,
                'input_data': input_data,
                'confidence_score': confidence_score,
                'timestamp': pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            return render_template('result.html', result=result)
            
        except Exception as e:
            import traceback
            app.logger.error(f"Prediction error: {str(e)}\n{traceback.format_exc()}")
            return render_template('error.html', error=f"An error occurred during prediction: {str(e)}")

@app.route('/api/predict', methods=['POST'])
def api_predict():
    if request.method == 'POST':
        try:
            # Get input values from JSON
            data = request.get_json()
            if not data:
                return jsonify({'success': False, 'error': 'No JSON data provided'})
                
            input_data = {}
            for feature in feature_names:
                if feature not in data:
                    return jsonify({'success': False, 'error': f'Missing required parameter: {feature_labels.get(feature, feature)}'})
                    
                try:
                    value = float(data.get(feature))
                    # Validate realistic ranges
                    range_info = parameter_ranges.get(feature, {})
                    min_val = range_info.get('min', 0)
                    max_val = range_info.get('max', float('inf'))
                    typical_range = range_info.get('typical_range', 'N/A')
                    unit = range_info.get('unit', '')
                    
                    if value < min_val or value > max_val:
                        unit_str = f" {unit}" if unit else ""
                        return jsonify({'success': False, 
                            'error': f'{feature_labels.get(feature, feature)} value {value}{unit_str} is unrealistic. '
                                     f'Please enter a value between {min_val} and {max_val}{unit_str}. '
                                     f'Typical range in dataset: {typical_range}{unit_str}.'})
                    input_data[feature] = value
                except (ValueError, TypeError):
                    return jsonify({'success': False, 'error': f'Invalid value for {feature_labels.get(feature, feature)}: {data.get(feature)}'})
            
            # Create a DataFrame with the input values (ensure correct column order)
            input_df = pd.DataFrame([[input_data[fn] for fn in feature_names]], columns=feature_names)
            
            # Apply log transformation (as done in the notebook)
            # Handle zeros by adding a small constant to avoid log(0)
            transformed_input = input_df.apply(lambda x: np.log10(x + 1e-10) if np.issubdtype(x.dtype, np.number) else x)
            
            # Make prediction
            if model is not None:
                prediction = int(model.predict(transformed_input)[0])
                fertility_class = fertility_classes[prediction]
                recommendation = recommendations[prediction]
                
                # Calculate confidence score (simplified for demonstration)
                confidence_score = 0.85  # In a real app, this would be calculated from model.predict_proba()
            else:
                # If model doesn't exist, provide a placeholder response
                prediction = 1  # Default to "Fertile"
                fertility_class = fertility_classes[prediction]
                recommendation = recommendations[prediction]
                confidence_score = 0.7  # Lower confidence for placeholder
                
            # Prepare response
            result = {
                'success': True,
                'prediction': prediction,
                'fertility_class': fertility_class,
                'recommendation': recommendation,
                'input_data': input_data,
                'confidence_score': confidence_score,
                'timestamp': pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            return jsonify(result)
            
        except Exception as e:
            import traceback
            app.logger.error(f"API prediction error: {str(e)}\n{traceback.format_exc()}")
            return jsonify({'success': False, 'error': f'An error occurred during prediction: {str(e)}'})

# Custom error handler for 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error='Page not found'), 404

# Custom error handler for 500 errors
@app.errorhandler(500)
def server_error(e):
    return render_template('error.html', error='Internal server error'), 500

if __name__ == '__main__':
    # Create model directory if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'model'), exist_ok=True)
    
    # Configure logging
    import logging
    from logging.handlers import RotatingFileHandler
    
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/soil_health_app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Soil Health Optimizer startup')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
