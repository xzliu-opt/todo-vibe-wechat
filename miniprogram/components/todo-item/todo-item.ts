Component({
    properties: {
        todo: Object
    },

    data: {
        isDeleting: false
    },

    methods: {
        onDelete() {
            // Haptic feedback
            wx.vibrateShort({ type: 'light' });

            // Trigger exit animation and delete
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
