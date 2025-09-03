import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description?: string) => void; // updated
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/70 p-8 text-center shadow-sm ring-1 ring-gray-200 backdrop-blur dark:bg-gray-800/70 dark:ring-gray-700">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No tasks yet!</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Add a task to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
