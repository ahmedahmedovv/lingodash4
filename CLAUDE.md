# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack
- Single HTML file (~170 lines)
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
- JSON import/export with validation
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
- Import - import JSON (with validation)
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
  word: "string",      // required
  def: "definition",   // required
  ex: "example",       // optional
  card: { /* FSRS */ } // required
}
```

## Accessibility
- SVG icons have `role="button"` and `aria-label`
- Screen reader compatible

## Bug Fixes Applied
- Empty word handling (prevents crashes)
- Import validates array format
- Import validates card structure (word, def, card required)
- Delete checks card exists before splice
- Empty textarea check before import

## Files
- `index.html` - Complete app
- `CLAUDE.md` - This file
