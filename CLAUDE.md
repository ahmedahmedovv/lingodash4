# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack
- Single HTML file (~120 lines)
- Vanilla JS with ES modules
- FSRS algorithm via CDN (ts-fsrs)
- LocalStorage for persistence
- Inter font (Google Fonts)

## Features
- Type word to answer (case-insensitive)
- Correct = FSRS Good, Wrong/Empty = FSRS Again
- First letter hint shown in definition
- Example sentence with word hidden as `___`
- Daily streak tracking
- Session limit: 51 cards per session
- JSON import/export
- Keyboard-only navigation
- Confirm before delete

## UI
- 900px max-width card
- Example sentence above definition
- Definition: smaller, italic
- Stats bar: card counter, streak, due count
- Success (green) / error (red) feedback colors

## Keyboard Shortcuts
- `Enter` - Submit answer / Next card
- `Escape` - Delete current card (with confirm)
- `Tab` - Toggle options panel
- `Ctrl+E` - Export JSON

## Card Flow
1. See example (word hidden) + definition + first letter hint
2. Type answer → Enter
3. See result (correct/wrong) → Enter for next card

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
