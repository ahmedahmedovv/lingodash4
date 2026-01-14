# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack
- Single HTML file (~130 lines)
- Vanilla JS with ES modules
- FSRS algorithm via CDN (ts-fsrs)
- LocalStorage for persistence
- Inter font (Google Fonts)

## Features
- Type word to answer (case-insensitive)
- Correct = FSRS Good, Wrong/Empty = FSRS Again
- First letter hint shown in definition
- Example sentence with word hidden as `___`
- Word revealed with color after answer (green/red)
- Daily streak tracking
- Session limit: 51 cards per session
- JSON import/export
- Keyboard-only navigation
- Confirm before delete

## UI
- 900px max-width card
- Warm neutral color palette (#fafaf9, #1c1917, #78716c)
- Pill badges for example & definition
- Stats bar with bottom border
- Frosted glass card (backdrop blur)
- Fade animation on card transitions (150ms)
- Larger input field with rounded corners (20px)
- Subtle placeholder text

## Keyboard Shortcuts
- `Enter` - Submit answer / Next card
- `Escape` - Delete current card (with confirm)
- `Tab` - Toggle options panel
- `Ctrl+E` - Export JSON

## Card Flow
1. See example (word as `___`) + definition + first letter hint
2. Type answer → Enter
3. See result with word highlighted in color → Enter for next

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
