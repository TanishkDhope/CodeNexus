import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Dropout
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import asyncio
import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


# Initialize FastAPI app
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
# Load dataset
data_file = "codeforces_user_data.csv"  # Update with actual file path
try:
    data = pd.read_csv(data_file)
except FileNotFoundError:
    raise ValueError(f"Dataset file '{data_file}' not found!")

# Preprocess dataset
data = data.drop(columns=["Number of Contests"], errors='ignore')

data.rename(columns={"Average Time Spent": "Average Time Per Problem"}, inplace=True)

features = [
    "Average Time Per Problem", 
    "Success Rate", 
    "Problems Solved", 
    "Rating",
    "Max Rating"
]

for feature in features:
    if feature not in data.columns:
        raise ValueError(f"Column '{feature}' not found in dataset!")

# Remove non-numeric values
data = data.dropna(subset=features)
data[features] = data[features].apply(pd.to_numeric, errors='coerce')
data.dropna(inplace=True)

# Create progress score
data["Progress Score"] = (
    0.4 * data["Success Rate"] +
    0.3 * data["Max Rating"] / data["Max Rating"].max() +
    0.2 * data["Problems Solved"] / data["Problems Solved"].max() -
    0.1 * data["Average Time Per Problem"] / data["Average Time Per Problem"].max()
)

data.dropna(inplace=True)

X = data[features]
y = data["Progress Score"]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Build Model
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(1, activation='linear')
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=50, batch_size=16)

# Save model & scaler
model.save("idkmodel.keras")
joblib.dump(scaler, "scaler.pkl")

# Load model & scaler at startup
model = load_model("idkmodel.keras")
scaler = joblib.load("scaler.pkl")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # or use ["
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Request Model
class UserData(BaseModel):
    average_time_per_problem: float
    success_rate: float
    problems_solved: int
    rating: float
    max_rating: float*"] for all origins in development
    allow_credentials=True,

@app.post("/predict")
def predict_progress(user: UserData):
    try:
        input_data = np.array([[
            user.average_time_per_problem,
            user.success_rate,
            user.problems_solved,
            user.rating,
            user.max_rating
        ]])
        input_scaled = scaler.transform(input_data)
        predicted_score = model.predict(input_scaled)[0][0]
        return {"predicted_progress_score": predicted_score}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/visualize/{handle}")
def visualize_user(handle: str):
    if "User Handle" not in data.columns:
        raise HTTPException(status_code=404, detail="User Handle column not found")
    
    user_data = data[data["User Handle"] == handle]
    if user_data.empty:
        raise HTTPException(status_code=404, detail=f"No data found for user '{handle}'")
    
    X_user = user_data[features]
    X_user_scaled = scaler.transform(X_user)
    predicted_user_score = model.predict(X_user_scaled)[0][0]
    
    plt.figure(figsize=(8, 5))
    sns.histplot(data["Progress Score"], bins=20, kde=True, color="royalblue")
    plt.axvline(predicted_user_score, color='red', linestyle='--', linewidth=2, label=f'{handle} Predicted Score')
    plt.title("Distribution of Progress Scores")
    plt.xlabel("Progress Score")
    plt.ylabel("Number of Users")
    plt.legend()
  image_path = "static/progress_hist.png"
plt.savefig(image_path)
plt.close()  # Close the plot to prevent memory issues

if __name__ == "__main__":
    if "RUN_FROM_SCRIPT" in os.environ:
        uvicorn.run("reportmodel:app", host="0.0.0.0", port=8000, reload=True)
    else:
        asyncio.run(uvicorn.serve(uvicorn.Config(app, host="0.0.0.0", port=8000)))