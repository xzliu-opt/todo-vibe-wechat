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
        onInput(e: WechatMiniprogram.Input) {
            this.setData({
                value: e.detail.value
            });
        },

        onConfirm() {
            const value = this.data.value.trim();
            if (!value) return;

            this.triggerEvent('add', { value });
            this.setData({ value: '' });
        }
    }
})
