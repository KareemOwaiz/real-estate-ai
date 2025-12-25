import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "processed", "properties_master.csv")
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")

# Load data
df = pd.read_csv(CSV_PATH, encoding="latin1")
df = df.fillna(0)

# Feature selection (simple + stable)
features = [
    "area_sqft",
    "bedrooms",
    "bathrooms",
    "stories",
    "parking"
]

# Some datasets may miss columns → create safely
for col in features:
    if col not in df.columns:
        df[col] = 1

X = df[features]
y = df["price"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("R2 Score:", r2_score(y_test, preds))

# Save model
joblib.dump(model, MODEL_PATH)
print("✅ model.pkl saved at:", MODEL_PATH)
