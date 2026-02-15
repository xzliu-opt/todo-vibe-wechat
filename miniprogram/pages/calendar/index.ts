import { todoStore } from '../../services/todoStore';
import { Todo } from '../../services/types';
import { getDaysInMonth, isSameDay } from '../../services/date';
import { i18n } from '../../services/i18n';

// Get app instance
const app = getApp<IAppOption>();

Page({
    data: {
        weekdays: [] as string[],
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        monthLabel: '',
        days: [] as any[],
        selectedDate: new Date().getTime(),
        todos: [] as Todo[],
        filteredTodos: [] as Todo[],
        translations: i18n.t,
        currentLang: i18n.currentLang,
        theme: app.globalData.theme // 'light' or 'dark'
    },

    onLoad() {
        this.updateMonth();
        this.updateWeekdays();

        // Subscribe to store
        this.unsubscribe = todoStore.subscribe(todos => {
            this.setData({ todos });
            this.updateDays(); // Update dots
            this.filterTodos();
        });

        // Subscribe to i18n
        this.unsubscribeI18n = i18n.subscribe(lang => {
            this.setData({
                translations: i18n.t,
                currentLang: lang
            });
            this.updateWeekdays();
            this.updateMonth(); // Update month label with new locale
        });
    },

    onShow() {
        // Refresh theme if changed globally
        if (this.data.theme !== app.globalData.theme) {
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

    unsubscribe: null as any,
    unsubscribeI18n: null as any,

    updateWeekdays() {
        const t = i18n.t;
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
        this.setData({ monthLabel });
        this.updateDays();
    },

    updateDays() {
        const { currentYear, currentMonth, todos, selectedDate } = this.data;
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
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
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selected);

            // Check for data
            const hasData = todos.some(t => {
                const created = new Date(t.createdAt);
                if (isSameDay(created, date)) return true;
                if (t.completedAt) {
                    const completed = new Date(t.completedAt);
                    if (isSameDay(completed, date)) return true;
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

    onSelectDay(e: any) {
        const ts = e.currentTarget.dataset.ts;
        if (!ts) return;

        this.setData({ selectedDate: ts });
        this.updateDays(); // Update selection UI
        this.filterTodos();
    },

    filterTodos() {
        const { todos, selectedDate } = this.data;
        const target = new Date(selectedDate);

        const filtered = todos.filter(t => {
            // Created today?
            if (isSameDay(new Date(t.createdAt), target)) return true;
            // Completed today?
            if (t.completedAt && isSameDay(new Date(t.completedAt), target)) return true;
            return false;
        });

        // Sort: Completed at bottom
        filtered.sort((a, b) => (Number(a.completed) - Number(b.completed)));

        this.setData({ filteredTodos: filtered });
    },

    onToggleTodo(e: CustomEvent) {
        todoStore.toggleTodo(e.detail.id);
    },

    onDeleteTodo(e: CustomEvent) {
        todoStore.deleteTodo(e.detail.id);
    }
});
