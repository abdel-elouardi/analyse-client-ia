from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

kmeans = joblib.load('kmeans_model.pkl')
scaler = joblib.load('scaler.pkl')
rf_model = joblib.load('churn_model.pkl')

class ClientData(BaseModel):
    num_orders: float
    income: float
    avg_order_gap_days: float

@app.post("/predict")
def predict(data: ClientData):
    X = np.array([[data.num_orders, data.income, data.avg_order_gap_days]])
    X_scaled = scaler.transform(X)
    segment = int(kmeans.predict(X_scaled)[0])
    churn = int(rf_model.predict(X)[0])
    churn_proba = round(float(rf_model.predict_proba(X)[0][1]) * 100, 1)

    segments = {
        0: "🟢 Client Fidèle",
        1: "🟡 Client Occasionnel",
        2: "⭐ Client Premium",
        3: "🔴 Client à risque"
    }

    return {
        "segment": segments[segment],
        "churn": churn,
        "churn_probabilite": churn_proba,
        "alerte": "⚠️ Contacter ce client !" if churn == 1 else "✅ Client stable"
    }