import { useEffect, useRef, useState } from "react";
import type { Task } from "../types/Task";
import Button from "./ui/Button";
import { CheckIcon, EditIcon, TrashIcon, XIcon } from "./ui/Icons";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description?: string) => void; // updated
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (trimmedTitle && (trimmedTitle !== task.title || trimmedDescription !== (task.description || ""))) {
      onUpdate(task.id, trimmedTitle, trimmedDescription || undefined);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <li className="group flex flex-col gap-2 rounded-xl bg-white/70 p-3 shadow-sm ring-1 ring-gray-200 backdrop-blur transition-shadow hover:shadow-md dark:bg-gray-800/70 dark:ring-gray-700">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          id={`task-${task.id}`}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <div className="flex-1 space-y-1">
          {isEditing ? (
            <>
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-1 w-full rounded-md border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                maxLength={160}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-md border border-gray-300 bg-white px-2 py-1 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                maxLength={400}
                placeholder="Description (optional)"
              />
            </>
          ) : (
            <label
              htmlFor={`task-${task.id}`}
              className={`flex-1 cursor-pointer text-sm font-medium ${
                task.completed ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {task.title}
            </label>
          )}
          {!isEditing && task.description && (
            <p className={`text-xs ${task.completed ? "text-gray-400 line-through dark:text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 self-center">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                variant="primary"
                size="sm"
                icon={<CheckIcon />}
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                size="sm"
                icon={<XIcon />}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                icon={<EditIcon />}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Edit task"
              />
              <Button
                onClick={() => onDelete(task.id)}
                variant="ghost"
                size="sm"
                icon={<TrashIcon />}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-500"
                aria-label="Delete task"
              />
            </>
          )}
        </div>
      </div>
    </li>
  );
}
