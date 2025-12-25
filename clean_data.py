import pandas as pd
import uuid
import os

RAW_DIR = "data/raw"
OUT_FILE = "data/processed/properties_master.csv"

FINAL_COLUMNS = [
    "id", "city", "location", "price", "area_sqft",
    "bedrooms", "bathrooms", "parking",
    "furnishing", "property_type", "listing_type", "image_url"
]

COLUMN_MAP = {
    "area": "area_sqft",
    "Area": "area_sqft",
    "sqft": "area_sqft",
    "price": "price",
    "Price": "price",
    "location": "location",
    "Location": "location",
    "bedrooms": "bedrooms",
    "Bedrooms": "bedrooms",
    "bathrooms": "bathrooms",
    "Bathrooms": "bathrooms",
    "parking": "parking",
    "Parking": "parking",
    "furnishingstatus": "furnishing",
    "furnishing": "furnishing",
}

all_data = []

for file in os.listdir(RAW_DIR):
    if not file.endswith(".csv"):
        continue

    city = file.replace(".csv", "")
    print(f"Processing {city}...")

    df = pd.read_csv(os.path.join(RAW_DIR, file))
    df.rename(columns=COLUMN_MAP, inplace=True)

    # Add missing columns
    for col in FINAL_COLUMNS:
        if col not in df.columns:
            df[col] = None

    df["id"] = [str(uuid.uuid4()) for _ in range(len(df))]
    df["city"] = city
    df["property_type"] = df["property_type"].fillna("Apartment")
    df["listing_type"] = df["listing_type"].fillna("sale")
    df["image_url"] = df["image_url"].fillna(
        "https://placehold.co/600x400?text=Property"
    )

    df = df[FINAL_COLUMNS]
    all_data.append(df)

final_df = pd.concat(all_data, ignore_index=True)

# Optimize numeric columns
final_df["price"] = pd.to_numeric(final_df["price"], errors="coerce")
final_df["area_sqft"] = pd.to_numeric(final_df["area_sqft"], errors="coerce")

final_df.to_csv(OUT_FILE, index=False)

print("✅ properties_master.csv created successfully")
print("Total properties:", len(final_df))
