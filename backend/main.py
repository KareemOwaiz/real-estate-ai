from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import os
import joblib
import random

# -------------------- APP --------------------
app = FastAPI(title="RealEstateAI API")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for demo/portfolio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- BASE PATHS --------------------
# -------------------- BASE PATHS --------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_PATH = os.path.join(BASE_DIR, "data", "processed", "properties_master.csv")
IMAGES_DIR = os.path.join(BASE_DIR, "backend", "images")
MODEL_PATH = os.path.join(BASE_DIR, "backend", "ml", "model.pkl")

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

if not os.path.exists(CSV_PATH):
    print(f"⚠️ CSV file not found at {CSV_PATH}")

# -------------------- VALIDATION -------------------

if not os.path.exists(IMAGES_DIR):
    raise RuntimeError(f"Images directory not found: {IMAGES_DIR}")

# -------------------- LOAD ML MODEL --------------------
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ ML model loaded successfully")
else:
    print("⚠️ model.pkl not found – prediction disabled")

# -------------------- STATIC IMAGES --------------------
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"status": "RealEstateAI API running"}

# -------------------- PROPERTIES API --------------------
@app.get("/properties")
def get_properties(page: int = 1, limit: int = 12):
    df = pd.read_csv(CSV_PATH, encoding="latin1", low_memory=False)
    df = df.fillna("")

    start = (page - 1) * limit
    end = start + limit
    df_page = df.iloc[start:end]

    cities = ["Bangalore", "Hyderabad", "Mumbai", "Pune", "Chennai"]

    properties = []
    for idx, row in df_page.iterrows():
        prop = row.to_dict()

        # 🔥 Demo realism
        prop["city"] = cities[idx % len(cities)]
        prop["bedrooms"] = int(prop.get("bedrooms") or random.randint(1, 4))
        prop["bathrooms"] = int(prop.get("bathrooms") or random.randint(1, 3))
        prop["parking"] = int(prop.get("parking") or random.randint(0, 2))

        image_number = (idx % 500) + 1
        prop["image_url"] = f"{BASE_URL}/images/{image_number}.jpg"

        properties.append(prop)

    return {
        "page": page,
        "limit": limit,
        "total": len(df),
        "data": properties
    }

# -------------------- ML INPUT --------------------
class PredictionInput(BaseModel):
    area_sqft: float
    bedrooms: int
    bathrooms: int
    parking: int
    city: str | None = "Bangalore"

# -------------------- PRICE PREDICTION --------------------
@app.post("/predict-price")
def predict_price(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="ML model not available")

    try:
        # ✅ MODEL SAFE INPUT (5 FEATURES)
        area = float(data.area_sqft)
        bedrooms = int(data.bedrooms)
        bathrooms = int(data.bathrooms)
        stories = 1  # fixed (model trained with this)
        parking = int(data.parking)

        X = [[area, bedrooms, bathrooms, stories, parking]]

        # Safety check
        if hasattr(model, "n_features_in_"):
            if model.n_features_in_ != len(X[0]):
                raise ValueError(
                    f"Model expects {model.n_features_in_} features, received {len(X[0])}"
                )

        base_price = model.predict(X)[0]

        # 🔥 Realism boost
        adjustment = (
            bedrooms * 300_000 +
            bathrooms * 200_000 +
            parking * 150_000
        )

        city_multiplier = {
            "Bangalore": 1.25,
            "Mumbai": 1.40,
            "Hyderabad": 1.10,
            "Pune": 1.15,
            "Chennai": 1.05
        }.get(data.city, 1.0)

        final_price = (base_price + adjustment) * city_multiplier

        return {
            "predicted_price": round(final_price, 2),
            "city": data.city
        }

    except Exception as e:
        print("🔥 Prediction Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
