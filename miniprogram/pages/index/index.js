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
        loading: true,
        dragIndex: -1,
        isDragging: false,
        dragTranslateY: 0
    },
    dragState: {
        startY: 0,
        currentIndex: -1,
        itemHeight: 0,
        lastSwapIndex: -1,
        rafId: null,
        lastUpdateTime: 0
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
        console.log('[Index] updateTodos called. Todos:', todos.map(t => `${t.text} (${t.completed ? 'done' : 'active'})`));

        const activeCount = todos.filter(t => !t.completed).length;
        const completedCount = todos.filter(t => t.completed).length;

        let filteredTodos = todos;
        if (this.data.filter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        }
        else if (this.data.filter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        // Grouping: Active first, then Completed. Within each group, preserve manual order from todos array.
        const active = filteredTodos.filter(t => !t.completed);
        const completed = filteredTodos.filter(t => t.completed);

        // Optional: you can still sort by favorite within active if you want,
        // but it might conflict with manual reordering within the active group.
        // For now, let's keep it manual-first but keep favorites at top if desired.
        // If we want FULL manual control, we should NOT sort by isFavorite.
        // Let's stick to status grouping only for maximum manual flexibility.
        const sortedFilteredTodos = [...active, ...completed];

        console.log('[Index] Filtered todos:', sortedFilteredTodos.map(t => `${t.text} (${t.completed ? 'done' : 'active'})`));

        this.setData({
            todos,
            filteredTodos: sortedFilteredTodos,
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
        console.log('[Index] onAddTodo called with value:', e.detail.value);
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
    openCalendar() {
        wx.navigateTo({
            url: '/pages/calendar/index'
        });
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
    },
    // WXS 回调：长按开始
    wxsLongPress(detail) {
        const index = detail.index;
        console.log('[Index] ===== DRAG START =====');
        console.log('[Index] WXS long press callback. Index:', index);
        console.log('[Index] Current filteredTodos:', this.data.filteredTodos.map((t, i) => `${i}: ${t.text}`));
        this.dragState.currentIndex = index;
        this.dragState.lastSwapIndex = index;
        // Get item height and pass to WXS
        const query = wx.createSelectorQuery();
        query.select('.todo-item-wrapper').boundingClientRect();
        query.exec((res) => {
            if (res[0]) {
                this.dragState.itemHeight = res[0].height;
                // TODO: Update WXS state if needed
                console.log('[Index] Item height:', this.dragState.itemHeight);
            }
        });
        this.setData({
            dragIndex: index,
            isDragging: true
        });
        wx.vibrateShort({ type: 'light' });
    },
    // WXS 回调：交换位置 (Obsolete but keeping for reference or removing)
    wxsSwapItems(e) {
        // No longer used for frequent updates to avoid re-renders
    },
    // WXS 回调：最终重排序
    wxsFinalReorder(detail) {
        const { fromIndex, toIndex } = detail;
        console.log('[Index] ===== FINAL REORDER =====');
        console.log('[Index] WXS final reorder: fromIndex =', fromIndex, ', toIndex =', toIndex);

        if (fromIndex === toIndex) {
            console.log('[Index] fromIndex === toIndex, no reorder needed');
            this.wxsTouchEnd();
            return;
        }

        // Find actual indices in full todos array
        console.log('[Index] filteredTodos:', this.data.filteredTodos.map((t, i) => `${i}: ${t.text} (id: ${t.id})`));
        console.log('[Index] full todos:', this.data.todos.map((t, i) => `${i}: ${t.text} (id: ${t.id})`));

        const draggedItem = this.data.filteredTodos[fromIndex];
        const targetItem = this.data.filteredTodos[toIndex];

        console.log('[Index] Dragged item:', draggedItem ? `${draggedItem.text} (id: ${draggedItem.id})` : 'undefined');
        console.log('[Index] Target item:', targetItem ? `${targetItem.text} (id: ${targetItem.id})` : 'undefined');

        if (!draggedItem || !targetItem) {
            console.error('[Index] ERROR: draggedItem or targetItem is undefined!');
            this.wxsTouchEnd();
            return;
        }

        const dragId = draggedItem.id;
        const targetId = targetItem.id;

        const actualFromIndex = this.data.todos.findIndex(t => t.id === dragId);
        const actualToIndex = this.data.todos.findIndex(t => t.id === targetId);

        console.log('[Index] Mapped to full array: actualFromIndex =', actualFromIndex, ', actualToIndex =', actualToIndex);

        if (actualFromIndex !== -1 && actualToIndex !== -1) {
            console.log('[Index] Calling todoStore.reorderTodos(', actualFromIndex, ',', actualToIndex, ', false)');
            // Perform swap and SAVE
            todoStore_1.todoStore.reorderTodos(actualFromIndex, actualToIndex, false);
            wx.vibrateShort({ type: 'medium' });
        } else {
            console.error('[Index] ERROR: Could not find items in full todos array!');
        }
        this.wxsTouchEnd();
    },
    // WXS 回调：拖动结束
    wxsTouchEnd() {
        console.log('[Index] ===== DRAG END =====');
        console.log('[Index] Resetting drag state');
        this.setData({
            dragIndex: -1,
            isDragging: false
        });
        this.dragState.currentIndex = -1;
        this.dragState.lastSwapIndex = -1;
        this.dragState.startY = 0;
    }
});
