"use strict";
Component({
    properties: {
        placeholder: {
            type: String,
            value: 'What needs to be done?'
        }
    },
    data: {
        value: ''
    },
    methods: {
        onInput(e) {
            this.setData({
                value: e.detail.value
            });
        },
        onConfirm() {
            const value = this.data.value.trim();
            console.log('[TodoInput] onConfirm called. Value:', value);
            if (!value)
                return;
            console.log('[TodoInput] Triggering add event');
            this.triggerEvent('add', { value });
            this.setData({ value: '' });
        }
    }
});
