// app.ts
App<IAppOption>({
  globalData: {
    theme: 'light', // 'light' | 'dark'
    language: 'en', // 'en' | 'zh'
  },
  onLaunch() {
    // Check system theme
    const systemInfo = wx.getSystemInfoSync();
    if (systemInfo.theme) {
        this.globalData.theme = systemInfo.theme;
    }
  },
})
