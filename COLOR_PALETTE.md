# Tinder YDS Color Palette

A warm, sepia-toned color scheme designed for vocabulary learning applications. Inspired by physical flashcards and academic materials.

---

## 🎨 Overview

| Property | Value |
|----------|-------|
| **Name** | Tinder YDS |
| **Mood** | Warm, Academic, Friendly, Focused |
| **Primary Base** | Warm Cream (#f4ecd8) |
| **Primary Text** | Dark Brown (#5c4a32) |
| **Accent** | Sage Green (#5a7c5a) & Muted Red (#a65c5c) |

---

## 📋 Color Swatches

### Background Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| ![#f4ecd8](https://via.placeholder.com/20/f4ecd8/f4ecd8?text=+) | `#f4ecd8` | `244, 236, 216` | Main app background |
| ![#fdf6e3](https://via.placeholder.com/20/fdf6e3/fdf6e3?text=+) | `#fdf6e3` | `253, 246, 227` | Card backgrounds |
| ![#f5efe3](https://via.placeholder.com/20/f5efe3/f5efe3?text=+) | `#f5efe3` | `245, 239, 227` | Secondary surfaces |
| ![#f0e6d3](https://via.placeholder.com/20/f0e6d3/f0e6d3?text=+) | `#f0e6d3` | `240, 230, 211` | Hover states |
| ![#ebe1d3](https://via.placeholder.com/20/ebe1d3/ebe1d3?text=+) | `#ebe1d3` | `235, 225, 211` | Highlights |

### Text Colors (Brown Scale)

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| ![#5c4a32](https://via.placeholder.com/20/5c4a32/5c4a32?text=+) | `#5c4a32` | `92, 74, 50` | Primary text |
| ![#6b5a48](https://via.placeholder.com/20/6b5a48/6b5a48?text=+) | `#6b5a48` | `107, 90, 72` | Secondary text |
| ![#8b7355](https://via.placeholder.com/20/8b7355/8b7355?text=+) | `#8b7355` | `139, 115, 85` | Muted text, icons |
| ![#a09078](https://via.placeholder.com/20/a09078/a09078?text=+) | `#a09078` | `160, 144, 120` | Placeholder text |
| ![#3d3229](https://via.placeholder.com/20/3d3229/3d3229?text=+) | `#3d3229` | `61, 50, 41` | Headings |

### Border Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| ![#c4b49a](https://via.placeholder.com/20/c4b49a/c4b49a?text=+) | `#c4b49a` | `196, 180, 154` | Primary borders |
| ![#e8dcc8](https://via.placeholder.com/20/e8dcc8/e8dcc8?text=+) | `#e8dcc8` | `232, 220, 200` | Light borders |
| ![#e8d4a8](https://via.placeholder.com/20/e8d4a8/e8d4a8?text=+) | `#e8d4a8` | `232, 212, 168` | Subtle borders |

### Semantic Colors

#### Success (Know/Correct)
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| ![#5a7c5a](https://via.placeholder.com/20/5a7c5a/5a7c5a?text=+) | `#5a7c5a` | `90, 124, 90` | Success actions |
| ![#a8c4a8](https://via.placeholder.com/20/a8c4a8/a8c4a8?text=+) | `#a8c4a8` | `168, 196, 168` | Success borders |
| ![#e8f5e9](https://via.placeholder.com/20/e8f5e9/e8f5e9?text=+) | `#e8f5e9` | `232, 245, 233` | Success backgrounds |
| ![#2e7d32](https://via.placeholder.com/20/2e7d32/2e7d32?text=+) | `#2e7d32` | `46, 125, 50` | Success text |
| ![#c8e6c9](https://via.placeholder.com/20/c8e6c9/c8e6c9?text=+) | `#c8e6c9` | `200, 230, 201` | Pale green bg |

#### Error (Don't Know/Incorrect)
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| ![#a65c5c](https://via.placeholder.com/20/a65c5c/a65c5c?text=+) | `#a65c5c` | `166, 92, 92` | Error actions |
| ![#c4a8a8](https://via.placeholder.com/20/c4a8a8/c4a8a8?text=+) | `#c4a8a8` | `196, 168, 168` | Error borders |
| ![rgba(166,92,92,0.15)](https://via.placeholder.com/20/f5e8e8/f5e8e8?text=+) | `rgba(166,92,92,0.15)` | - | Error backgrounds |
| ![#c0392b](https://via.placeholder.com/20/c0392b/c0392b?text=+) | `#c0392b` | `192, 57, 43` | Error text |

### Progress Bar Colors

| State | Start | End |
|-------|-------|-----|
| In Progress | ![#e67e22](https://via.placeholder.com/20/e67e22/e67e22?text=+) `#e67e22` | ![#f39c12](https://via.placeholder.com/20/f39c12/f39c12?text=+) `#f39c12` |
| Complete | ![#27ae60](https://via.placeholder.com/20/27ae60/27ae60?text=+) `#27ae60` | ![#2ecc71](https://via.placeholder.com/20/2ecc71/2ecc71?text=+) `#2ecc71` |

---

## 📁 Files Included

| File | Format | Usage |
|------|--------|-------|
| `color-palette.css` | CSS Variables | Standard CSS projects |
| `color-palette.scss` | SCSS | Sass/SCSS projects |
| `color-palette.json` | JSON | Design tools, JavaScript apps |
| `COLOR_PALETTE.md` | Markdown | Documentation |

---

## 🚀 Quick Start

### CSS Variables
```css
@import url('color-palette.css');

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
}
```

### SCSS
```scss
@import 'color-palette';

body {
  background-color: $bg-primary;
  color: $text-primary;
}

.card {
  @extend %card-base;
}
```

### Tailwind CSS
Add to your `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      cream: {
        50: '#fdf6e3',
        100: '#f5efe3',
        200: '#f0e6d3',
        DEFAULT: '#f4ecd8',
      },
      brown: {
        100: '#8b7355',
        200: '#6b5a48',
        DEFAULT: '#5c4a32',
      },
    }
  }
}
```

---

## 🎯 Design Principles

1. **Low Contrast, High Comfort**: The warm, muted tones reduce eye strain during extended study sessions
2. **Semantic Clarity**: Green for success/know, Red for error/don't know
3. **Academic Feel**: Sepia tones evoke traditional flashcards and paper
4. **Progressive Disclosure**: Lighter shades for backgrounds, darker for text

---

## 📱 Platform Support

| Platform | Status |
|----------|--------|
| Web (CSS) | ✅ Full support |
| iOS Safari | ✅ Optimized with safe-area-inset |
| Android Chrome | ✅ Full support |
| React Native | ✅ Use hex values |
| Flutter | ✅ Use hex values |

---

*Generated from Tinder YDS vocabulary learning app*
