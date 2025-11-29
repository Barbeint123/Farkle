from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load Mongo credentials
load_dotenv()
uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(uri)
db = client["farkle"]
highscore_col = db["highscores"]

# Initialize Flask
app = Flask(__name__)

# Enable CORS for ALL routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Force CORS headers on every response
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# === ROUTES ===

@app.route("/add_user", methods=["POST", "OPTIONS"])
def add_highscore():
    # Preflight request handling
    if request.method == "OPTIONS":
        return ("", 204)

    data = request.get_json()
    print("Received data:", data)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        result = highscore_col.insert_one(data)
        return jsonify({"message": "User added", "id": str(result.inserted_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_highscores", methods=["GET"])
def get_highscores():
    try:
        highscores = highscore_col.find().sort("score", -1).limit(10)
        highscore_list = [{**h, "_id": str(h["_id"])} for h in highscores]
        return jsonify(highscore_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/healthz")
def health_check():
    return "ok", 200



# Run server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
