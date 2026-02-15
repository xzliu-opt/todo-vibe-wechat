import { Todo, Subtask } from './types';
import { formatDuration } from './date';

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
                // Migration: Ensure all todos have createdAt
                this.todos = stored.map((t: Todo) => ({
                    ...t,
                    createdAt: t.createdAt || Date.now()
                }));
            }
        } catch (e) {
            console.error('Failed to load todos', e);
        }
    }

    private save() {
        console.log('[TodoStore] Saving todos. Count:', this.todos.length);
        try {
            wx.setStorageSync(STORAGE_KEY, this.todos);
            console.log('[TodoStore] Save completed successfully');
        } catch (e) {
            console.error('[TodoStore] Failed to save todos:', e);
        }
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

    public reorderTodos(fromIndex: number, toIndex: number, skipSave = false) {
        console.log('[TodoStore] Reordering:', fromIndex, '->', toIndex, skipSave ? '(skipSave)' : '');
        console.log('[TodoStore] Before reorder:', this.todos.map(t => `${t.text} (${t.completed ? 'done' : 'active'})`));

        const todos = [...this.todos];
        const [movedItem] = todos.splice(fromIndex, 1);

        // After removing the item, just insert at toIndex directly
        // toIndex represents the final position the item should occupy
        todos.splice(toIndex, 0, movedItem);

        this.todos = todos;

        console.log('[TodoStore] After reorder:', this.todos.map(t => `${t.text} (${t.completed ? 'done' : 'active'})`));

        if (!skipSave) {
            this.save();
        } else {
            // Only notify without saving during drag
            this.notify();
        }
    }

    public saveWithoutNotify() {
        console.log('[TodoStore] saveWithoutNotify called');
        try {
            wx.setStorageSync(STORAGE_KEY, this.todos);
        } catch (e) {
            console.error('[TodoStore] Failed to save (no notify):', e);
        }
    }
}

export const todoStore = new TodoStore();
