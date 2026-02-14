# Todo Vibe WeChat 🌊

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-WeChat_Mini_Program-green.svg)

> A pixel-perfect, Apple-inspired minimalist Todo application for WeChat Mini Program. Crafted with obsession for detail and interaction.

---

## 📖 Introduction

**Todo Vibe WeChat** is a faithful recreation of the high-end minimalist styling found in modern iOS applications. It adheres strictly to the **Apple Human Interface Guidelines (HIG)**, focusing on negative space, subtle typography, and fluid interactions.

Imagine a todo list that feels less like a tool and more like a fluid extension of your thought process. That is Todo Vibe.

## ✨ Key Features

- **Apple Aesthetic**: Uses system fonts (San Francisco/PingFang), blur effects (`backdrop-filter`), and carefully calibrated shadows.
- **Minimalist Interaction**:
  - **Static Delete**: A clean, non-intrusive gray trash icon for deletion, replacing complex swipe gestures for better usability.
  - **Haptic Feedback**: Subtle vibration patterns on completion and deletion.
- **Dark Mode Support**: Fully adaptive UI that switches seamlessly between Light and Dark themes based on system settings.
- **Internationalization (i18n)**: Native support for **English** and **Simplified Chinese** with instant toggling.
- **Offline First**: All data is persisted locally using `wx.setStorage`, ensuring your tasks are always safe.
- **Privacy Focused**: No external servers, no tracking. Your data stays on your device.

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| *(Place screenshot here)* | *(Place screenshot here)* |

## 🛠 Tech Stack

- **Core**: WXML, WXSS, TypeScript
- **Styling**: CSS Variables (custom theming engine), Flexbox
- **State Management**: Custom Reactive Store (Observer Pattern)
- **Architecture**: Component-based Architecture

## 🚀 Getting Started

### Prerequisites

- [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) (Latest Stable Version)
- A WeChat AppID (or use Test ID)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/todo-vibe-wechat.git
    cd todo-vibe-wechat
    ```

2.  **Open in Developer Tools**
    - Launch WeChat Developer Tools.
    - Select **Import Project**.
    - Choose the `todo-vibe-wechat` root directory.
    - Set the **AppID** (or use Test ID).

3.  **Build and Run**
    - The project uses standard miniprogram structure.
    - Click **Compile** to run the app in the simulator.

## 📂 Project Structure

```bash
miniprogram/
├── assets/             # Static assets (SVGs, images)
├── components/         # Reusable UI components
│   ├── todo-item/      # The core task item component
│   └── ...
├── pages/              # Application pages
│   └── index/          # Main todo list view
├── services/           # Business logic & State
│   ├── i18n.ts         # Localization service
│   └── todoStore.ts    # Reactive state management
├── styles/             # Global styles
│   └── variables.wxss  # CSS Variables & Theming
└── app.ts              # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💖 Credits

- Designed & Developed by **Mia & Serge**.
- Inspired by the simplicity of Apple's Reminders and Things 3.

---

*Made with ❤️ for the WeChat ecosystem.*
