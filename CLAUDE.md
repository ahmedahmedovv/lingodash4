# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## STRICT POLICIES

These rules are **MANDATORY** for all changes:

### Code Rules
| # | Policy | Description |
|---|--------|-------------|
| 1 | **Keep it short** | Code must be concise. No complex logic. Simple solutions only. |
| 2 | **Minimal style** | No fancy UI elements. Clean, minimal design. No unnecessary decorations. |
| 3 | **Single file only** | Everything in one HTML file. No separate CSS/JS files. |
| 4 | **No build tools** | No npm, webpack, or compilation. Just open in browser. |
| 5 | **Minimal dependencies** | Only essential CDN imports. Avoid adding new libraries. |

### Development Rules
| # | Policy | Description |
|---|--------|-------------|
| 6 | **Update docs** | CLAUDE.md must be updated after every change to reflect current state. |
| 7 | **Test before commit** | Manually verify changes work before any git commit. |
| 8 | **No feature creep** | Only add features explicitly requested by user. |
| 9 | **Preserve behavior** | Changes must not break existing functionality. |

## Stack

| Component | Technology |
|-----------|------------|
| Structure | Single HTML file |
| JavaScript | Vanilla JS with ES modules |
| Algorithm | FSRS via CDN (ts-fsrs) |
| Storage | LocalStorage |
| Typography | Inter font (Google Fonts) |

## Features

### Core Study
- Type word to answer (case-insensitive matching)
- Correct answer = FSRS Good rating
- Wrong/Empty answer = FSRS Again rating
- First letter hint shown in parentheses after definition
- Example sentence with target word hidden as `___`
- Word revealed with color after answer (green = correct, red = wrong)

### Progress Tracking
- Daily streak tracking (persisted in LocalStorage)
- Session limit: 51 cards per session
- Visual progress bar showing session completion

### Card Management
- Add new cards via + icon on card
- Edit current card via pencil icon on card
- Delete current card with confirmation
- JSON import with validation
- JSON export to downloadable file
- Clear all cards with type-to-confirm safety

## Pages

The app has **1 page + 2 modals**:

### Main Page (Study)
- Displays current flashcard
- Shows stats: session counter, streak, due count
- Progress bar for session
- Text input for typing answer
- Card icons (top-right): + (add) and pencil (edit)
- Gear icon (top-right corner): Opens settings

### Edit Modal
- Opens via pencil icon (edit mode) or + icon (add mode)
- Word input with validation
- Definition input with validation
- Example input (optional)
- Primary "Save/Add" button
- Danger "Delete" button (edit mode only)

### Settings Modal
- Opens via gear icon
- Import section: JSON textarea + Import button
- Export section: Export button
- Danger Zone: Type "DELETE" to enable Clear All

## UI Design

### Layout
- Max-width: 900px, centered
- Padding: 80px vertical, 40px horizontal
- Full viewport height with flexbox centering

### Color Palette (Dark Theme)
| Element | Color |
|---------|-------|
| Background | #0f172a |
| Card Background | #1e293b |
| Text Primary | #f8fafc |
| Text Secondary | #94a3b8 |
| Text Muted | #64748b |
| Border | #334155 |
| Accent/Focus | #60a5fa |
| Primary Button | #3b82f6 |
| Success | #22c55e |
| Error/Danger | #dc2626 |

### Button Hierarchy
| Type | Style |
|------|-------|
| Primary | Blue filled (#3b82f6), white text |
| Secondary | Outline, gray border |
| Danger | Red border/text (#dc2626), always visible |

### Components
- **Card**: Dark background, subtle border, 12px radius
- **Inputs**: 8px radius, dark background, blue focus border
- **Modals**: Full-screen overlay with centered content (max 480px)
- **Card Icons**: 18px, 30% opacity, 100% on hover

### Animations
- **Fade**: 150ms opacity transition between cards
- **Shake**: 400ms horizontal shake on wrong answer
- **Transitions**: 200ms on hover states and focus

## Icons

### Card (top-right)
- **Plus (+)**: Add new card
- **Pencil**: Edit current card

### Page (top-right corner)
- **Gear**: Opens settings modal

### Edit Modal
- **X**: Close modal
- **Floppy**: Save/Add card
- **Trash**: Delete card

### Settings Modal
- **X**: Close modal
- **Upload arrow**: Import JSON
- **Download arrow**: Export JSON
- **Trash**: Clear all cards

## User Flow

### Study Flow
```
1. View card: example (word as ___) + definition (first letter hint)
2. Type answer in input field
3. Press Enter to submit
4. View result: word highlighted in green (correct) or red (wrong)
5. Press Enter again to proceed to next card
6. Repeat until session complete (51 cards) or no more due cards
```

### Add Card Flow
```
1. Click + icon on card
2. Fill in Word (required), Definition (required), Example (optional)
3. Click "Add" button
4. Card saved, modal closes, returns to study
```

### Edit Card Flow
```
1. Click pencil icon on card
2. Modify fields as needed
3. Click "Save" to update, or "Delete" to remove
4. Changes saved, modal closes, returns to study
```

### Import Flow
```
1. Click gear icon
2. Paste JSON array into textarea
3. Click "Import" button
4. Validation runs, valid cards added
```

### Export Flow
```
1. Click gear icon
2. Click "Export" button
3. Browser downloads flashcards.json file
```

### Clear All Flow
```
1. Click gear icon
2. Type "DELETE" in confirmation field
3. Click "Clear All Cards" button (now enabled)
4. All cards deleted
```

## Data Structure

### Card Object
```javascript
{
  word: "string",      // required
  def: "string",       // required
  ex: "string",        // optional
  card: { /* FSRS */ } // required
}
```

### LocalStorage Keys
| Key | Description |
|-----|-------------|
| `fc` | JSON array of all flashcard objects |
| `streak` | Object with `count` and `date` |

## Key Functions

| Function | Purpose |
|----------|---------|
| `save()` | Persist cards to LocalStorage |
| `due()` | Filter cards due for review |
| `next()` | Load next card for study |
| `validateForm()` | Check required fields, show errors |
| `openEditModal(edit)` | Open modal in add/edit mode |
| `openSettingsModal()` | Open settings modal |

## Validation

### Form Validation
- Required fields show red border + error message on empty submit
- Errors clear on input

### Import Validation
- Must be valid JSON array
- Each card needs: word, def, card properties

### Destructive Action Safety
- Delete card: confirm dialog
- Clear all: type "DELETE" to enable button

## Files

| File | Description |
|------|-------------|
| `index.html` | Complete application |
| `CLAUDE.md` | Documentation (this file) |

## External Dependencies

| Dependency | URL | Purpose |
|------------|-----|---------|
| ts-fsrs | unpkg.com/ts-fsrs/dist/index.mjs | Spaced repetition |
| Inter font | fonts.googleapis.com | Typography |
