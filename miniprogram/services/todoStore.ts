import { Todo, Subtask } from './types';

const STORAGE_KEY = 'todo-vibe-wechat-todos';

type Listener = (todos: Todo[]) => void;

class TodoStore {
    private todos: Todo[] = [];
    private listeners: Listener[] = [];

    constructor() {
        this.load();
    }

    private load() {
        try {
            const stored = wx.getStorageSync(STORAGE_KEY);
            if (stored) {
                this.todos = stored;
            }
        } catch (e) {
            console.error('Failed to load todos', e);
        }
    }

    private save() {
        wx.setStorage({
            key: STORAGE_KEY,
            data: this.todos
        });
        this.notify();
    }

    private notify() {
        this.listeners.forEach(l => l([...this.todos])); // Send copy
    }

    public subscribe(listener: Listener) {
        this.listeners.push(listener);
        listener([...this.todos]); // Initial emit
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // --- Actions ---

    public getTodos(): Todo[] {
        return [...this.todos];
    }

    public addTodo(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const newTodo: Todo = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            text: trimmed,
            completed: false,
            isFavorite: false,
            createdAt: Date.now(),
            subtasks: []
        };
        this.todos = [newTodo, ...this.todos];
        this.save();
    }

    public toggleTodo(id: string) {
        this.todos = this.todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null } : t
        );
        this.save();
    }

    public deleteTodo(id: string) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }

    public updateTodo(id: string, text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        this.todos = this.todos.map(t => t.id === id ? { ...t, text: trimmed } : t);
        this.save();
    }

    public toggleFavorite(id: string) {
        this.todos = this.todos.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
        this.save();
    }

    public addSubtask(parentId: string, text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        this.todos = this.todos.map(t => {
            if (t.id === parentId) {
                const subtasks = t.subtasks || [];
                return {
                    ...t,
                    subtasks: [...subtasks, {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                        text: trimmed,
                        completed: false
                    }]
                };
            }
            return t;
        });
        this.save();
    }

    public toggleSubtask(parentId: string, subtaskId: string) {
        this.todos = this.todos.map(t => {
            if (t.id === parentId && t.subtasks) {
                return {
                    ...t,
                    subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
                };
            }
            return t;
        });
        this.save();
    }

    public deleteSubtask(parentId: string, subtaskId: string) {
        this.todos = this.todos.map(t => {
            if (t.id === parentId && t.subtasks) {
                return {
                    ...t,
                    subtasks: t.subtasks.filter(s => s.id !== subtaskId)
                };
            }
            return t;
        });
        this.save();
    }
}

export const todoStore = new TodoStore();
