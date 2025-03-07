from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib

# Initialize FastAPI app
app = FastAPI()

# Enable CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # Adjust this if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
try:
    model = tf.keras.models.load_model("idkmodel.keras")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    raise RuntimeError(f"Error loading model or scaler: {e}")

# Define input schema
class InputData(BaseModel):
    average_time_per_problem: float
    success_rate: float
    problems_solved: int
    rating: float
    max_rating: float

# Function to generate suggestions
def get_suggestions(predicted_progress: float) -> str:
    if predicted_progress > 0.8:
        return "You're doing great! Keep pushing higher challenges."
    elif predicted_progress > 0.5:
        return "Good progress! Focus on consistency and increasing problem difficulty."
    else:
        return "You might need to improve accuracy and efficiency. Try focusing on weaker areas."

# Prediction endpoint
@app.post("/predict")
async def predict(data: InputData):
    try:
        features = np.array([[
            data.average_time_per_problem,
            data.success_rate,
            data.problems_solved,
            data.rating,
            data.max_rating
        ]])

        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)
        score = float(prediction[0][0])
        suggestion = get_suggestions(score)

        return {"progress_score": score, "suggestion": suggestion}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
