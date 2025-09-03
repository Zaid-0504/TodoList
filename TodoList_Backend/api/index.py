from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from bson import ObjectId
from pymongo import MongoClient
import os

# MongoDB Connection
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["TodoListCluster"]

if "tasks" not in db.list_collection_names():
    db.create_collection("tasks")

tasks_collection = db.tasks

# FastAPI app
app = FastAPI()

# Enable CORS (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or ["https://your-frontend.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class TaskIn(BaseModel):
    title: str
    description: Optional[str] = ""

class TaskOut(TaskIn):
    id: str
    completed: bool = False


# Helper to convert MongoDB -> JSON
def task_to_json(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description", ""),
        "completed": task.get("completed", False),
    }


# Routes
@app.get("/")
async def home():
    return {"message": "Welcome to the To-Do List API with FastAPI & MongoDB on Vercel!"}


@app.get("/tasks", response_model=list[TaskOut])
async def get_tasks():
    tasks = tasks_collection.find()
    return [task_to_json(task) for task in tasks]


@app.get("/tasks/{task_id}", response_model=TaskOut)
async def get_task(task_id: str):
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_to_json(task)


@app.post("/tasks", response_model=TaskOut, status_code=201)
async def create_task(task: TaskIn):
    new_task = {
        "title": task.title,
        "description": task.description,
        "completed": False,
    }
    result = tasks_collection.insert_one(new_task)
    new_task["_id"] = result.inserted_id
    return task_to_json(new_task)


@app.put("/tasks/{task_id}", response_model=TaskOut)
async def update_task(task_id: str, task: TaskIn):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"title": task.title, "description": task.description}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    return task_to_json(updated_task)


@app.patch("/tasks/{task_id}/complete", response_model=TaskOut)
async def complete_task(task_id: str):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"completed": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    return task_to_json(task)


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": f"Task {task_id} deleted successfully"}
