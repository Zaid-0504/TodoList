import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTasks } from "../hooks/useTask";

export default function Home() {
  const { tasks, loading, error, addTask, updateTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 transition-colors dark:bg-gray-900 dark:text-gray-200">
      <main className="mx-auto max-w-xl px-4 pt-8 sm:pt-12 md:pt-16">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              Todo List
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl">
            Get things done, one task at a time.
          </p>
        </header>

        <div className="mt-8 sm:mt-12">
          <TaskForm onAdd={addTask} />
        </div>

        <div className="mt-8 space-y-4">
          {loading && (
            <div className="rounded-lg bg-white/70 p-4 text-center text-sm text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800/70 dark:text-gray-400 dark:ring-gray-700">
              Loading tasks...
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800">
              {error}
            </div>
          )}
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
        </div>
      </main>
    </div>
  );
}
