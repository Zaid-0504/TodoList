from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hello from Flask on Vercel!"})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"ping": "pong"})
