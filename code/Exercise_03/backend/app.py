from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# initialize user data, global
user_data = {
    "userId": None,
    "displayName": None,
    "email": None
}

@app.route('/')
def home(): # data is initially rendered in html format, have to format to JSON
    if user_data["userId"]:
        return f"Flask server is running!<br>User ID: {user_data['userId']}<br>Display Name: {user_data['displayName']}<br>Email: {user_data['email']}"
    else:
        return "Flask server is running!<br>No user data."

# referenced https://stackoverflow.com/questions/22947905/flask-example-with-post

@app.route('/store_user_id', methods=['POST']) # fetch and store user data from post in frontend
def store_user_id():
    data = request.json
    print("Received data:", data)

    if data is None:
        return jsonify({"status": "Error", "message": "No data received"}), 400

    # store user data in global variable
    user_data["userId"] = data.get('userId')
    user_data["displayName"] = data.get('displayName')
    user_data["email"] = data.get('email')

    print("User ID:", user_data["userId"])
    print("Display Name:", user_data["displayName"])
    print("Email:", user_data["email"])

    return jsonify({"status": "success", "message": "User data received"}), 200 

@app.route('/get_user_data', methods=['GET']) # route to get user data in JSON format
def get_user_data():
    if user_data["userId"]:
        return jsonify(user_data)
    else:
        return jsonify({"status": "Error", "message": "No user data"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    # host on server that will accept connections from any ip, port 5000