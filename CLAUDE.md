# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack
- Single HTML file (~120 lines)
- Vanilla JS with ES modules
- FSRS algorithm via CDN (ts-fsrs)
- LocalStorage for persistence

## Features
- Type word to answer (case-insensitive)
- Correct = FSRS Good, Wrong/Empty = FSRS Again
- Daily streak tracking
- JSON import/export
- Keyboard-only navigation

## Keyboard Shortcuts
- `Enter` - Submit answer / Save card
- `Escape` - Delete current card (with confirm)
- `Tab` - Toggle options panel
- `Ctrl+E` - Export JSON

## Data Structure
```js
{
  word: "string",
  def: "definition",
  ex: "example sentence",
  card: { /* FSRS card state */ }
}
```

## Files
- `index.html` - Complete app
- `CLAUDE.md` - This file
