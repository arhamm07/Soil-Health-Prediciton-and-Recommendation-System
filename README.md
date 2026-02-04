# Soil Health Optimizer

An advanced web application for soil fertility prediction and optimization using machine learning.

## Features

- Predict soil fertility based on 12 key soil parameters
- Get personalized recommendations for soil health improvement
- Beautiful, responsive UI with interactive visualizations
- REST API for integration with other systems

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, Chart.js
- **Backend**: Python, Flask
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn (Random Forest Classifier)

## Installation

1. Clone the repository or download the source code

2. Create a virtual environment (recommended)
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```

3. Install the required dependencies
   ```
   pip install -r requirements.txt
   ```

4. Run the application
   ```
   python app.py
   ```

5. Open your browser and navigate to http://127.0.0.1:5000

## Model Training

The application uses a Random Forest Classifier model trained on soil fertility data. The model is trained in the `soil-fertility-prediction.ipynb` notebook and saved as `random_forest_model.pkl`.

### Input Parameters

The model requires the following 12 soil parameters:
- Nitrogen (N)
- Phosphorous (P)
- Potassium (K)
- Soil pH (ph)
- Electrical conductivity (ec)
- Organic carbon (oc)
- Sulfur (S)
- Zinc (Zn)
- Iron (Fe)
- Copper (Cu)
- Manganese (Mn)
- Boron (B)

### Output Classes

The model predicts soil fertility in three categories:
- 0: Less Fertile
- 1: Fertile
- 2: Highly Fertile

## API Usage

The application provides a REST API endpoint for soil fertility prediction:

```
POST /api/predict
Content-Type: application/json

{
  "N": 100,
  "P": 15,
  "K": 200,
  "ph": 6.5,
  "ec": 0.5,
  "oc": 1.0,
  "S": 15,
  "Zn": 1.0,
  "Fe": 7.0,
  "Cu": 0.5,
  "Mn": 3.0,
  "B": 1.0
}
```

Response:
```json
{
  "success": true,
  "prediction": 2,
  "fertility_class": "Highly Fertile",
  "recommendation": {
    "title": "Soil Preservation Plan for Highly Fertile Soil",
    "description": "Your soil is highly fertile. Focus on preservation and sustainable practices.",
    "actions": [
      "Apply minimal fertilizer based on crop removal rates",
      "Continue adding organic matter to maintain soil health",
      "Implement precision agriculture techniques to avoid over-fertilization",
      "Use cover crops to prevent nutrient leaching",
      "Monitor soil health regularly to maintain optimal conditions"
    ]
  },
  "input_data": {
    "N": 100,
    "P": 15,
    "K": 200,
    "ph": 6.5,
    "ec": 0.5,
    "oc": 1.0,
    "S": 15,
    "Zn": 1.0,
    "Fe": 7.0,
    "Cu": 0.5,
    "Mn": 3.0,
    "B": 1.0
  }
}
```

## License

MIT

## Author

Created by Ali
