export interface Task {
  id: string;
  title: string;
  description?: string; // optional description from backend
  completed: boolean;
}
