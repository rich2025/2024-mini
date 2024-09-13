from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/store_user_id', methods=['POST'])
def store_user_id():
    data = request.json
    print("Received data:", data)  # Debugging line
    if data is None:
        return jsonify({"status": "error", "message": "No data received"}), 400
    
    user_id = data.get('userId')  # This line will raise an error if data is None
    display_name = data.get('displayName')
    email = data.get('email')

    # Process or store the data
    print("User ID:", user_id)
    print("Display Name:", display_name)
    print("Email:", email)

    return jsonify({"status": "success", "message": "User data received"}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
