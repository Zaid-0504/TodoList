from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hello from Flask on Vercel!"})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"ping": "pong"})
