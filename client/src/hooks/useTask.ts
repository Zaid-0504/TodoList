import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/Task";

const API_BASE = "https://todo-list-one-tawny-73.vercel.app";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
      const data = await res.json();
      setTasks(data);
    } catch (e: any) {
      setError(e.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description?: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error(`Failed to create task (${res.status})`);
      const created: Task = await res.json();
      setTasks(prev => [...prev, created]);
    } catch (e: any) {
      setError(e.message || "Failed to add task");
    }
  };

  const updateTask = async (id: string, title: string, description?: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error(`Failed to update task (${res.status})`);
      const updated: Task = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (e: any) {
      setError(e.message || "Failed to update task");
    }
  };

  const toggleTask = async (id: string) => {
    setError(null);
    try {

      const res = await fetch(`${API_BASE}/tasks/${id}/complete`, { method: "PATCH" });
      if (!res.ok) throw new Error(`Failed to toggle task (${res.status})`);
      const updated: Task = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (e: any) {
      setError(e.message || "Failed to toggle task");
    }
  };

  const deleteTask = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete task (${res.status})`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete task");
    }
  };

  return { tasks, loading, error, fetchTasks, addTask, updateTask, toggleTask, deleteTask };
};
