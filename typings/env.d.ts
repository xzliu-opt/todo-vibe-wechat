interface IAppOption {
    globalData: {
        theme: string;
        language: string;
        userInfo?: WechatMiniprogram.UserInfo,
    }
    userInfoReadyCallback?: (userInfo: WechatMiniprogram.UserInfo) => void
}

interface CustomEvent {
    detail: any;
}
