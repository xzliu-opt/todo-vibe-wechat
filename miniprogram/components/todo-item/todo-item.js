"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

Component({
    properties: {
        todo: {
            type: Object,
            value: null
        }
    },

    data: {
        isDeleting: false,
        metaString: ''
    },

    lifetimes: {
        attached() {
            console.log('[TodoItem] Component attached. Todo:', this.data.todo);
            // When component is attached, update metaString if todo exists
            if (this.data.todo) {
                this.updateMetaString(this.data.todo);
            }
        },
        ready() {
            console.log('[TodoItem] Component ready');
        }
    },

    observers: {
        'todo': function(newVal) {
            console.log('[TodoItem] Todo property changed:', newVal);
            // When todo property changes, update metaString
            if (newVal) {
                this.updateMetaString(newVal);
            }
        }
    },

    methods: {
        updateMetaString(todo) {
            try {
                console.log('[TodoItem] updateMetaString called for todo:', todo);
                let metaString = '';

                if (!todo) {
                    this.setData({ metaString: '' });
                    return;
                }

                // Format date with year, month, day, and time
                if (todo.createdAt) {
                    const createdDate = new Date(todo.createdAt);
                    const now = new Date();
                    const createdDateStr = this.formatDateTime(createdDate, now);

                    if (todo.completed && todo.completedAt) {
                        const completedDate = new Date(todo.completedAt);
                        const completedDateStr = this.formatDateTime(completedDate, now);
                        const durationMs = todo.completedAt - todo.createdAt;
                        const durationStr = this.formatDuration(durationMs);
                        metaString = `Done: ${completedDateStr} • Took: ${durationStr}`;
                    } else {
                        metaString = `Created: ${createdDateStr}`;
                    }
                }

                console.log('[TodoItem] Setting metaString:', metaString);
                this.setData({ metaString });
            } catch (error) {
                console.error('[TodoItem] Error in updateMetaString:', error);
                this.setData({ metaString: '' });
            }
        },

        formatDateTime(date, now) {
            const isSameDay = (d1, d2) => {
                return d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate();
            };

            const timeStr = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // If today
            if (isSameDay(date, now)) {
                return `Today ${timeStr}`;
            }

            // If yesterday
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (isSameDay(date, yesterday)) {
                return `Yesterday ${timeStr}`;
            }

            // If this year, show month and day
            if (date.getFullYear() === now.getFullYear()) {
                const monthDay = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
                return `${monthDay} ${timeStr}`;
            }

            // If older, show full date
            const fullDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            return `${fullDate} ${timeStr}`;
        },

        formatDuration(ms) {
            const minutes = Math.floor(ms / 60000);
            const hours = Math.floor(minutes / 60);

            if (minutes < 1) return '< 1m';
            if (hours < 1) return `${minutes}m`;

            const remainingMinutes = minutes % 60;
            if (remainingMinutes === 0) return `${hours}h`;
            return `${hours}h ${remainingMinutes}m`;
        },

        onDelete() {
            console.log('[TodoItem] Delete clicked');
            this.setData({ isDeleting: true });

            // Wait for animation
            setTimeout(() => {
                this.triggerEvent('delete', { id: this.data.todo.id });
            }, 300);
        },

        onToggle() {
            console.log('[TodoItem] Toggle clicked');
            this.triggerEvent('toggle', { id: this.data.todo.id });
        }
    }
});
