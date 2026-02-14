export const translations = {
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

export type Language = 'en' | 'zh';
export type TranslationKey = keyof typeof translations.en;

class I18nService {
    private language: Language = 'en';
    private listeners: ((lang: Language) => void)[] = [];

    constructor() {
        const sysInfo = wx.getSystemInfoSync();
        if (sysInfo.language.includes('zh')) {
            this.language = 'zh';
        }
    }

    public get t() {
        return translations[this.language];
    }

    public get currentLang() {
        return this.language;
    }

    public toggle() {
        this.language = this.language === 'en' ? 'zh' : 'en';
        this.notify();
    }

    public subscribe(listener: (lang: Language) => void) {
        this.listeners.push(listener);
        listener(this.language);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        }
    }

    private notify() {
        this.listeners.forEach(l => l(this.language));
    }
}

export const i18n = new I18nService();
