from flask import Flask, jsonify, request, abort
from flask_pymongo import PyMongo
from bson import ObjectId
from asgiref.wsgi import WsgiToAsgi
import os

# Initialize Flask
app = Flask(__name__)

# Use MongoDB Atlas connection from environment variable
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
mongo = PyMongo(app)

# Pick database explicitly
db = mongo.cx["TodoListCluster"]

# Ensure collection exists
if "tasks" not in db.list_collection_names():
    db.create_collection("tasks")

tasks_collection = db.tasks


# Helper function
def task_to_json(task):
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description", ""),
        "completed": task.get("completed", False),
    }


# Routes
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the To-Do List API with Flask & MongoDB on Vercel!"})


@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = tasks_collection.find()
    return jsonify([task_to_json(task) for task in tasks])


@app.route("/tasks/<task_id>", methods=["GET"])
def get_task(task_id):
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        abort(404, description="Task not found")
    return jsonify(task_to_json(task))


@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    if not data or "title" not in data:
        abort(400, description="Title is required")

    task = {
        "title": data["title"],
        "description": data.get("description", ""),
        "completed": False
    }
    result = tasks_collection.insert_one(task)
    task["_id"] = result.inserted_id
    return jsonify(task_to_json(task)), 201


@app.route("/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    if not data or "title" not in data:
        abort(400, description="Title is required")

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"title": data["title"], "description": data.get("description", "")}}
    )
    if result.matched_count == 0:
        abort(404, description="Task not found")

    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    return jsonify(task_to_json(task))


@app.route("/tasks/<task_id>/complete", methods=["PATCH"])
def complete_task(task_id):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"completed": True}}
    )
    if result.matched_count == 0:
        abort(404, description="Task not found")

    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    return jsonify(task_to_json(task))


@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        abort(404, description="Task not found")
    return jsonify({"message": f"Task {task_id} deleted successfully"})


# ✅ Wrap Flask app for Vercel
asgi_app = WsgiToAsgi(app)
