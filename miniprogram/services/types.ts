export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    isFavorite?: boolean;
    reminderAt?: number | null;
    subtasks?: Subtask[];
    createdAt: number;
    completedAt?: number | null;
    notes?: string;
}

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}
