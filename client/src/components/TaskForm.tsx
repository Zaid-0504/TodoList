import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { PlusIcon } from "./ui/Icons";

interface TaskFormProps {
  onAdd: (title: string, description?: string) => void; // updated
  autoFocus?: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export default function TaskForm({
  onAdd,
  autoFocus = true,
  placeholder = "Enter a task...",
  buttonLabel = "Add",
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const isEmpty = !title.trim();
  const showError = touched && isEmpty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isEmpty) return;
    onAdd(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
    setTouched(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative flex w-full flex-col gap-3 rounded-xl bg-white/70 p-3 shadow-sm ring-1 ring-gray-200 backdrop-blur transition hover:shadow-md dark:bg-gray-800/70 dark:ring-gray-700"
    >
      <div className="flex-1">
        <label htmlFor="taskTitle" className="sr-only">
          Task title
        </label>
        <input
          id="taskTitle"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError}
          aria-describedby={showError ? "taskTitle-error" : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm leading-tight outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-900
            ${
              showError
                ? "border-red-400 focus:border-red-500 focus:ring-red-400/40"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-400/40 dark:border-gray-600 dark:focus:border-blue-500"
            }`}
          placeholder={placeholder}
          maxLength={160}
        />
        <div className="mt-1 flex h-4 items-center justify-between">
          {showError ? (
            <p id="taskTitle-error" className="text-xs font-medium text-red-500">
              Please enter a task.
            </p>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {title.length > 0 ? `${160 - title.length} left` : "Max 160 chars"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="taskDescription" className="sr-only">
          Description
        </label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-tight outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-500"
          placeholder="Optional description"
          maxLength={400}
        />
        <div className="mt-1 flex h-4 items-center justify-end">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {description.length > 0 ? `${400 - description.length} left` : "Max 400 chars"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isEmpty}
          icon={<PlusIcon />}
          className="self-start"
        >
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
}
