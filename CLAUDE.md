# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack
- Single HTML file (~150 lines)
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
- No keyboard shortcuts - all via buttons/icons

## Pages
1. **Main** - Study cards
2. **Options** - Add cards, Import/Export, Clear all
3. **Edit** - Edit current card

## UI
- 900px max-width
- Warm neutral palette (#fafaf9, #1c1917, #78716c)
- Pill badges for example & definition
- Progress bar with session counter
- Frosted glass cards (backdrop blur)
- Fade animation on transitions
- Shake animation on wrong answer
- SVG icon buttons (top right)

## Icons (Top Right)
- **Trash** - Delete current card
- **Pencil** - Edit current card
- **Gear** - Options page

## Buttons
### Options Page
- Add - add new card
- Import - import JSON
- Export - download JSON
- Clear - delete all cards

### Edit Page
- Save - save changes
- Cancel - discard changes

## Card Flow
1. See example (word as `___`) + definition + first letter hint
2. Type answer → Enter
3. See result with word highlighted → Enter for next

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
