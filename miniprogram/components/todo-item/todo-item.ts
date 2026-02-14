Component({
    properties: {
        todo: Object
    },

    data: {
        x: 0,
        threshold: -80 // 160rpx is about 80px
    },

    methods: {
        onToggle() {
            this.triggerEvent('toggle', { id: this.data.todo.id });
        },

        onDelete() {
            this.triggerEvent('delete', { id: this.data.todo.id });
            this.setData({ x: 0 }); // Reset position
        },

        onChange(e: any) {
            // Track position if needed
        },

        onTouchEnd(e: any) {
            // Simple logic: if pulled enough, snap open, else close
            // This is tricky with movable-view in native way, usually we just let it slide or use change event
            // For now, let's rely on user sliding it.
            // A better UX is to snap.
            if (this.data.x < -40) {
                this.setData({ x: -80 }); // Snap to open
            } else {
                this.setData({ x: 0 }); // Snap to close
            }
        }
    }
})
