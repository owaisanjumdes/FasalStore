from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# ----------------------------
# Nagpur area coordinates (lat, lng)
# ----------------------------
AREA_COORDINATES = {
    "Sitabuldi":     {"lat": 21.1458, "lng": 79.0882},
    "Wardha Road":   {"lat": 21.1199, "lng": 79.0573},
    "Kamptee":       {"lat": 21.2237, "lng": 79.1968},
    "Hingna":        {"lat": 21.0961, "lng": 78.9818},
    "Katol Road":    {"lat": 21.2098, "lng": 79.0264},
    "Butibori":      {"lat": 20.9335, "lng": 79.1374},
    "Manewada":      {"lat": 21.1112, "lng": 79.1085},
    "Kalamna":       {"lat": 21.1812, "lng": 79.1583},
    "Wadi":          {"lat": 21.1566, "lng": 79.0067},
    "MIHAN":         {"lat": 21.0941, "lng": 79.0476},
    "Sadar":         {"lat": 21.1593, "lng": 79.0903},
    "Jaripatka":     {"lat": 21.1788, "lng": 79.1017},
    "Nandanvan":     {"lat": 21.1340, "lng": 79.1142},
    "Koradi Road":   {"lat": 21.2421, "lng": 79.0935},
    "Trimurti Nagar":{"lat": 21.1100, "lng": 79.0494},
}

# ----------------------------
# Load dataset safely
# ----------------------------
try:
    with open("data/storage_data.json", "r") as f:
        storages = json.load(f)
    print("Dataset loaded successfully ✅")
except Exception as e:
    storages = []
    print("Error loading dataset:", e)

# ----------------------------
# Helper: enrich storage with lat/lng based on its area
# ----------------------------
def enrich_with_coordinates(storage):
    coords = AREA_COORDINATES.get(storage["area"], {"lat": 21.1458, "lng": 79.0882})
    return {**storage, "lat": coords["lat"], "lng": coords["lng"]}

# ----------------------------
# Home Route
# ----------------------------
@app.route('/')
def home():
    return "FasalStore Backend Running 🚀"

# ----------------------------
# Get all storages + metadata (for map, filters, etc.)
# ----------------------------
@app.route("/storages", methods=["GET"])
def get_storages():
    try:
        unique_crops = sorted(list(set(s["crop"] for s in storages)))
        unique_areas = sorted(list(set(s["area"] for s in storages)))

        return jsonify({
            "success": True,
            "total": len(storages),
            "crops": unique_crops,
            "areas": unique_areas,
            "data": [enrich_with_coordinates(s) for s in storages]
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })
# ----------------------------
# Recommendation API (basic test)
# ----------------------------
@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        crop = data.get("crop", "").lower()

        results = []

        for item in storages:
            if crop == item.get("crop", "").lower():
                results.append(enrich_with_coordinates(item))

        # sort by capacity (high to low)
        results.sort(key=lambda x: x.get("capacity", 0), reverse=True)

        # fruit priority
        fruit_priority = ["orange", "apple", "banana", "mango", "grapes", "papaya"]

        if crop in fruit_priority:
            results.sort(
                key=lambda x: 0 if x.get("storage_type") == "cold storage" else 1
            )

        return jsonify({
            "success": True,
            "count": len(results),
            "data": results
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })

# ----------------------------
# Run Server
# ----------------------------
if __name__ == "__main__":
    print("FasalStore Backend Running 🚀")
    app.run(debug=True)
   