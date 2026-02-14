"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = exports.translations = void 0;
exports.translations = {
    en: {
        filterAll: "All",
        filterActive: "Active",
        filterCompleted: "Done",
        itemsLeft: "items left",
        placeholder: "What needs to be done?",
        credits: "Designed by liuxiaozhi.org",
        reminderDue: "Reminder due",
        imgAlt: "Todo Image",
        emptyStateTitle: "All caught up!",
        emptyStateSubtitle: "Enjoy your day.",
        addSubtaskPlaceholder: "Add a subtask...",
        clearCompleted: "Clear completed",
        created: "Created",
        done: "Done",
        took: "Took"
    },
    zh: {
        filterAll: "全部",
        filterActive: "待办",
        filterCompleted: "已完成",
        itemsLeft: "项待办",
        placeholder: "需要做什么？",
        credits: "Designed by liuxiaozhi.org",
        reminderDue: "提醒到期",
        imgAlt: "待办图片",
        emptyStateTitle: "完成了所有任务！",
        emptyStateSubtitle: "享受你的一天。",
        addSubtaskPlaceholder: "添加子任务...",
        clearCompleted: "清除已完成",
        created: "创建于",
        done: "完成于",
        took: "耗时"
    }
};
class I18nService {
    constructor() {
        this.language = 'en';
        this.listeners = [];
        const sysInfo = wx.getSystemInfoSync();
        if (sysInfo.language.includes('zh')) {
            this.language = 'zh';
        }
    }
    get t() {
        return exports.translations[this.language];
    }
    get currentLang() {
        return this.language;
    }
    toggle() {
        this.language = this.language === 'en' ? 'zh' : 'en';
        this.notify();
    }
    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.language);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    notify() {
        this.listeners.forEach(l => l(this.language));
    }
}
exports.i18n = new I18nService();
