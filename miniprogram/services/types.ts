export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    isFavorite?: boolean;
    reminderAt?: number | null;
    subtasks?: Subtask[];
    createdAt: number;
    completedAt?: number | null;
    duration?: string; // e.g. "2h 30m"
    notes?: string;
}

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}
