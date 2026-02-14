"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoStore_1 = require("../../services/todoStore");
const i18n_1 = require("../../services/i18n");
// Get app instance
const app = getApp();
Page({
    data: {
        todos: [],
        filteredTodos: [],
        filter: 'all',
        activeCount: 0,
        completedCount: 0,
        filters: [],
        translations: i18n_1.i18n.t,
        currentLang: i18n_1.i18n.currentLang,
        theme: app.globalData.theme, // 'light' or 'dark'
        loading: true
    },
    unsubscribeStore: null,
    unsubscribeI18n: null,
    onLoad() {
        // Subscribe to store
        this.unsubscribeStore = todoStore_1.todoStore.subscribe((todos) => {
            this.updateTodos(todos);
        });
        // Subscribe to i18n
        this.unsubscribeI18n = i18n_1.i18n.subscribe((lang) => {
            this.setData({
                translations: i18n_1.i18n.t,
                currentLang: lang,
                filters: [
                    { key: 'all', label: i18n_1.i18n.t.filterAll },
                    { key: 'active', label: i18n_1.i18n.t.filterActive },
                    { key: 'completed', label: i18n_1.i18n.t.filterCompleted }
                ]
            });
        });
        this.setData({ loading: false });
    },
    onUnload() {
        if (this.unsubscribeStore)
            this.unsubscribeStore();
        if (this.unsubscribeI18n)
            this.unsubscribeI18n();
    },
    onShow() {
        // Refresh theme if changed globally
        if (this.data.theme !== app.globalData.theme) {
            this.setData({ theme: app.globalData.theme });
        }
    },
    updateTodos(todos) {
        const activeCount = todos.filter(t => !t.completed).length;
        const completedCount = todos.filter(t => t.completed).length;
        let filteredTodos = todos;
        if (this.data.filter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        }
        else if (this.data.filter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }
        // Sort: Active first, then by favorites (if implemented), then date? 
        // Original app: Active items before completed. Within active, favorites first.
        filteredTodos.sort((a, b) => {
            if (a.completed !== b.completed)
                return Number(a.completed) - Number(b.completed);
            if (!a.completed && (a.isFavorite !== b.isFavorite))
                return Number(b.isFavorite || 0) - Number(a.isFavorite || 0);
            return 0; // Keep insertion order (ish) or sort by createdAt
        });
        this.setData({
            todos,
            filteredTodos,
            activeCount,
            completedCount
        });
    },
    setFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        this.setData({ filter }, () => {
            this.updateTodos(this.data.todos);
        });
    },
    onAddTodo(e) {
        todoStore_1.todoStore.addTodo(e.detail.value);
    },
    onToggleTodo(e) {
        todoStore_1.todoStore.toggleTodo(e.detail.id);
    },
    onDeleteTodo(e) {
        todoStore_1.todoStore.deleteTodo(e.detail.id);
    },
    clearCompleted() {
        // Logic to clear completed. TodoStore doesn't have batch delete yet, let's add it or loop logic here.
        // Better to add to store. For now, filter and delete one by one or implementing simple batch logic.
        const completed = this.data.todos.filter(t => t.completed);
        completed.forEach(t => todoStore_1.todoStore.deleteTodo(t.id));
    },
    toggleLanguage() {
        i18n_1.i18n.toggle();
    },
    toggleTheme() {
        const newTheme = this.data.theme === 'light' ? 'dark' : 'light';
        app.globalData.theme = newTheme;
        this.setData({ theme: newTheme });
    },
    onCopyLink() {
        wx.setClipboardData({
            data: 'https://github.com/xzliu-opt/todo-vibe-wechat',
            success: () => {
                wx.showToast({
                    title: this.data.currentLang === 'en' ? 'Link Copied' : '链接已复制',
                    icon: 'success'
                });
            }
        });
    }
});
