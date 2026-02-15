import { formatTime, formatDuration } from '../../services/date';
import { Todo } from '../../services/types';

Component({
    properties: {
        todo: {
            type: Object,
            value: null
        }
    },

    data: {
        isDeleting: false,
        metaString: '' as string
    },

    observers: {
        'todo': function(todo: Todo) {
            if (todo) {
                this.updateMetaString(todo);
            }
        }
    },

    methods: {
        updateMetaString(todo: Todo) {
            let metaString = '';

            if (todo.completed && todo.completedAt && todo.createdAt) {
                // For completed todos: show completion time and duration
                const duration = formatDuration(todo.completedAt - todo.createdAt);
                metaString = `Done: ${formatTime(todo.completedAt)} • Took: ${duration}`;
            } else if (todo.createdAt) {
                // For active todos: show creation time
                metaString = `Created: ${formatTime(todo.createdAt)}`;
            }

            this.setData({ metaString });
        },

        onDelete() {
            this.setData({ isDeleting: true });

            // Wait for animation
            setTimeout(() => {
                this.triggerEvent('delete', { id: this.data.todo.id });
            }, 300);
        },

        onToggle() {
            this.triggerEvent('toggle', { id: this.data.todo.id });
        }
    }
})
