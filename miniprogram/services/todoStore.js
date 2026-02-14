"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoStore = void 0;
const STORAGE_KEY = 'todo-vibe-wechat-todos';
class TodoStore {
    constructor() {
        this.todos = [];
        this.listeners = [];
        this.load();
    }
    load() {
        try {
            const stored = wx.getStorageSync(STORAGE_KEY);
            if (stored) {
                this.todos = stored;
            }
        }
        catch (e) {
            console.error('Failed to load todos', e);
        }
    }
    save() {
        wx.setStorage({
            key: STORAGE_KEY,
            data: this.todos
        });
        this.notify();
    }
    notify() {
        this.listeners.forEach(l => l([...this.todos])); // Send copy
    }
    subscribe(listener) {
        this.listeners.push(listener);
        listener([...this.todos]); // Initial emit
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    // --- Actions ---
    getTodos() {
        return [...this.todos];
    }
    addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed)
            return;
        const newTodo = {
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
    toggleTodo(id) {
        this.todos = this.todos.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : null } : t);
        this.save();
    }
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }
    updateTodo(id, text) {
        const trimmed = text.trim();
        if (!trimmed)
            return;
        this.todos = this.todos.map(t => t.id === id ? { ...t, text: trimmed } : t);
        this.save();
    }
    toggleFavorite(id) {
        this.todos = this.todos.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
        this.save();
    }
    addSubtask(parentId, text) {
        const trimmed = text.trim();
        if (!trimmed)
            return;
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
    toggleSubtask(parentId, subtaskId) {
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
    deleteSubtask(parentId, subtaskId) {
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
exports.todoStore = new TodoStore();
