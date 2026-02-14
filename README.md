# Todo Vibe WeChat Mini Program

A pixel-perfect recreation of the "Flow" Todo App for WeChat Mini Program, featuring an Apple-inspired minimalist design.

## Features

- **Minimalist Design**: Authentic Apple-style aesthetics with blur effects, soft shadows, and smooth transitions.
- **Gesture Controls**: Swipe to delete, tap to toggle.
- **Tasks & Subtasks**: Create and manage todos.
- **Dark Mode**: Adaptive dark mode support via system settings or manual toggle.
- **Internationalization**: English and Chinese (Simplified) support.
- **Offline First**: Auto-saves data to local storage.

## Project Structure

- `miniprogram/`: Source code
  - `components/`: Reusable UI components (Input, Item)
  - `pages/`: Page logic (Index)
  - `services/`: Core business logic (Store, I18n)
  - `styles/`: Global variables and mixins
  - `assets/`: Static resources

## Getting Started

1. Open **WeChat DevTools**.
2. Select **Import Project**.
3. Choose the `todo-vibe-wechat` folder.
4. Set AppID to your AppID or use Test ID.
5. Build and Run.

## Architecture

- **State Management**: Custom `TodoStore` using RxJS-like subscription pattern.
- **Styling**: Native WXSS with CSS Variables for theming.
- **Component Model**: Native WeChat Components.

## License

MIT
