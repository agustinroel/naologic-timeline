# Naologic Work Order Timeline

Manufacturing ERP Timeline component built with Angular 17+ (Zoneless).

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server**:
   ```bash
   ng serve
   ```
3. **Open browser**: Navigate to `http://localhost:4200/`

## 🧪 Testing

We use **Vitest** for unit testing. It provides a modern, blazingly fast testing experience that is 100% compatible with Jest's API but better aligned with Angular's zoneless future.

Run tests:

```bash
npm run test
```

## 🛠 Tech Stack & Approach

- **Angular 17+**: Optimized with `provideExperimentalZonelessChangeDetection` for maximum performance on grid rendering.
- **Signals**: Native Angular reactivity for efficient, fine-grained state updates.
- **SCSS**: Modular styling based on the provided Sketch design system.
- **Pixel-Perfect**: Strict adherence to design tokens and measurements.

## ✨ Bonus Features Implemented

- **localStorage persistence**: Data survives page refreshes.
- **"Today" button**: Instant navigation to the current date.
- **Keyboard navigation**: Escape to close panels, full tab support.
- **Tooltips**: Contextual info on bar hover.
- **Accessibility**: Full ARIA audit for screen reader support.
- **Performance**: Row lookup optimization (O(1)) via hash maps.

## 📄 Documentation

- [Technical Trade-offs](agents/trade_offs.md): Why we made certain decisions.
- [AI Prompts](agents/prompt_log.md): Record of the AI-augmented development process.
