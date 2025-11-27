from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os


# Get URI from .env file
load_dotenv()
uri = os.getenv("MONGO_URI")


# Connect to mongoDB database
client = MongoClient(uri)

db = client["farkle"]
highscore_col = db["highscores"]


# Initialize Flask
app = Flask(__name__)
CORS(app)

# API-routes
@app.route("/add_user", methods=["POST"])
def add_highscore():
    data = request.get_json()
    print("✅ Received data:", data)  # DEBUG LOG

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        result = highscore_col.insert_one(data)
        print("✅ Insert result:", result.inserted_id)  # DEBUG LOG
        return jsonify({"message": "User added", "id": str(result.inserted_id)})
    
    except Exception as e:
        print("❌ Error inserting:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/get_highscores", methods=["GET"])
def get_highscores():
    try:
        highscores = highscore_col.find().sort("score", -1).limit(10)
        
        # Convert to dicts
        highscore_list = []
        for h in highscores:
            h["_id"] = str(h["_id"])
            highscore_list.append(h)
        
        return jsonify(highscore_list), 200
    
    except Exception as e:
        print("❌ Error inserting:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
