"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoStore_1 = require("../../services/todoStore");
const date_1 = require("../../services/date");
const i18n_1 = require("../../services/i18n");

// Get app instance
const app = getApp();

Page({
    data: {
        weekdays: [],
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        monthLabel: '',
        days: [],
        selectedDate: new Date().getTime(),
        todos: [],
        filteredTodos: [],
        translations: i18n_1.i18n.t,
        currentLang: i18n_1.i18n.currentLang,
        theme: app.globalData.theme // 'light' or 'dark'
    },

    unsubscribe: null,
    unsubscribeI18n: null,

    onLoad() {
        console.log('[Calendar] Page loaded');
        this.updateMonth();
        this.updateWeekdays();

        // Subscribe to store
        this.unsubscribe = todoStore_1.todoStore.subscribe(todos => {
            console.log('[Calendar] Todos updated:', todos.length);
            this.setData({ todos });
            this.updateDays(); // Update dots
            this.filterTodos();
        });

        // Subscribe to i18n
        this.unsubscribeI18n = i18n_1.i18n.subscribe(lang => {
            console.log('[Calendar] Language changed to:', lang);
            this.setData({
                translations: i18n_1.i18n.t,
                currentLang: lang
            });
            this.updateWeekdays();
            this.updateMonth(); // Update month label with new locale
        });
    },

    onShow() {
        // Refresh theme if changed globally
        if (this.data.theme !== app.globalData.theme) {
            console.log('[Calendar] Theme changed to:', app.globalData.theme);
            this.setData({ theme: app.globalData.theme });
        }
    },

    onUnload() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        if (this.unsubscribeI18n) {
            this.unsubscribeI18n();
        }
    },

    updateWeekdays() {
        const t = i18n_1.i18n.t;
        const weekdays = [
            t.weekdaySun,
            t.weekdayMon,
            t.weekdayTue,
            t.weekdayWed,
            t.weekdayThu,
            t.weekdayFri,
            t.weekdaySat
        ];
        this.setData({ weekdays });
    },

    updateMonth() {
        const { currentYear, currentMonth, currentLang } = this.data;
        const date = new Date(currentYear, currentMonth, 1);
        const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
        const monthLabel = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
        console.log('[Calendar] Updating month:', monthLabel);
        this.setData({ monthLabel });
        this.updateDays();
    },

    updateDays() {
        const { currentYear, currentMonth, todos, selectedDate } = this.data;
        const daysInMonth = (0, date_1.getDaysInMonth)(currentYear, currentMonth);
        const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0-6

        const days = [];
        const today = new Date();
        const selected = new Date(selectedDate);

        // Pad empty days
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', empty: true });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const ts = date.getTime();

            // Format check
            const isToday = (0, date_1.isSameDay)(date, today);
            const isSelected = (0, date_1.isSameDay)(date, selected);

            // Check for data
            const hasData = todos.some(t => {
                const created = new Date(t.createdAt);
                if ((0, date_1.isSameDay)(created, date)) return true;
                if (t.completedAt) {
                    const completed = new Date(t.completedAt);
                    if ((0, date_1.isSameDay)(completed, date)) return true;
                }
                return false;
            });

            days.push({
                day: i,
                ts: ts,
                isToday,
                isSelected,
                hasData
            });
        }

        console.log('[Calendar] Days generated:', days.length);
        this.setData({ days });
    },

    onPrevMonth() {
        let { currentMonth, currentYear } = this.data;
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        this.setData({ currentMonth, currentYear });
        this.updateMonth();
    },

    onNextMonth() {
        let { currentMonth, currentYear } = this.data;
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        this.setData({ currentMonth, currentYear });
        this.updateMonth();
    },

    onSelectDay(e) {
        const ts = e.currentTarget.dataset.ts;
        if (!ts) return;

        console.log('[Calendar] Day selected:', new Date(ts));
        this.setData({ selectedDate: ts });
        this.updateDays(); // Update selection UI
        this.filterTodos();
    },

    filterTodos() {
        const { todos, selectedDate } = this.data;
        const target = new Date(selectedDate);

        const filtered = todos.filter(t => {
            // Created today?
            if ((0, date_1.isSameDay)(new Date(t.createdAt), target)) return true;
            // Completed today?
            if (t.completedAt && (0, date_1.isSameDay)(new Date(t.completedAt), target)) return true;
            return false;
        });

        // Sort: Completed at bottom
        filtered.sort((a, b) => (Number(a.completed) - Number(b.completed)));

        console.log('[Calendar] Filtered todos for selected date:', filtered.length);
        this.setData({ filteredTodos: filtered });
    },

    onToggleTodo(e) {
        console.log('[Calendar] Toggle todo:', e.detail.id);
        todoStore_1.todoStore.toggleTodo(e.detail.id);
        // Store will notify subscribers, which updates this page automatically
    },

    onDeleteTodo(e) {
        console.log('[Calendar] Delete todo:', e.detail.id);
        todoStore_1.todoStore.deleteTodo(e.detail.id);
        // Store will notify subscribers, which updates this page automatically
    }
});
