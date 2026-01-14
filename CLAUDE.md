# Flashcard App

Minimal FSRS-based flashcard app for language learning.

## Stack

| Component | Technology |
|-----------|------------|
| Structure | Single HTML file (~160 lines) |
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
- Add new cards with word, definition, and optional example
- Edit current card (same form, pre-populated)
- Delete current card with confirmation
- JSON import with validation
- JSON export to downloadable file
- Clear all cards with confirmation

## Pages

The app has only **2 pages**:

### 1. Main Page (Study)
- Displays current flashcard
- Shows stats: session counter, streak, due count
- Progress bar for session
- Text input for typing answer
- Single gear icon (top-right) to access options

### 2. Options Page (Unified)
A single overlay page that handles ALL card management:

**Top Section - Card Form:**
- Word input field
- Definition input field
- Example input field (optional)
- Add/Save button (text changes based on mode)
- Delete button (only visible when editing)

**Bottom Section - Bulk Operations:**
- Textarea for pasting JSON
- Import button
- Export button
- Clear All button

## UI Design

### Layout
- Max-width: 900px, centered
- Padding: 80px vertical, 40px horizontal
- Full viewport height with flexbox centering

### Color Palette
| Element | Color |
|---------|-------|
| Background | #fafaf9 (warm white) |
| Text Primary | #1c1917 (near black) |
| Text Secondary | #44403c (dark gray) |
| Accent | #78716c (warm gray) |
| Muted | #a8a29e (light gray) |
| Border | #e7e5e4 (subtle gray) |
| Success | #22c55e (green) |
| Error | #ef4444 (red) |

### Components
- **Card**: Frosted glass effect with `backdrop-filter: blur(12px)`, 32px border-radius, subtle shadow
- **Inputs**: 20px border-radius, centered text on main page, left-aligned on options
- **Buttons**: Pill-shaped (50px border-radius), icon + text, hover state
- **Badges**: Pill-shaped containers for example and definition text
- **Separator**: 1px horizontal line between form sections

### Animations
- **Fade**: 150ms opacity transition between cards
- **Shake**: 400ms horizontal shake on wrong answer
- **Transitions**: 200-300ms on hover states and focus

## Icons

### Main Page
- **Gear** (top-right): Opens options page

### Options Page
- **X** (close button): Returns to main page
- **Save/Floppy**: Add or save card
- **Trash**: Delete current card
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
   - Wrong answers trigger shake animation
5. Press Enter again to proceed to next card
6. Repeat until session complete (51 cards) or no more due cards
```

### Add Card Flow
```
1. Click gear icon (when no cards exist, form is empty)
2. Fill in Word (required), Definition (required), Example (optional)
3. Click "Add" button
4. Card saved to LocalStorage, returns to main page
```

### Edit Card Flow
```
1. Click gear icon (form pre-populates with current card data)
2. Modify fields as needed
3. Click "Save" button to update, or "Delete" to remove
4. Changes saved to LocalStorage, returns to main page
```

### Import Flow
```
1. Click gear icon
2. Paste JSON array into textarea
3. Click "Import" button
4. Validation runs:
   - Must be valid JSON
   - Must be an array
   - Each card must have: word, def, card (FSRS data)
5. Valid cards added, count shown in alert
```

### Export Flow
```
1. Click gear icon
2. Click "Export" button
3. Browser downloads flashcards.json file
```

## Data Structure

### Card Object
```javascript
{
  word: "string",      // required - the answer word
  def: "string",       // required - the definition/meaning
  ex: "string",        // optional - example sentence containing word
  card: {              // required - FSRS scheduling data
    due: Date,
    stability: Number,
    difficulty: Number,
    elapsed_days: Number,
    scheduled_days: Number,
    reps: Number,
    lapses: Number,
    state: Number,
    last_review: Date
  }
}
```

### LocalStorage Keys
| Key | Description |
|-----|-------------|
| `fc` | JSON array of all flashcard objects |
| `streak` | Object with `count` (number) and `date` (string) |

## State Management

### Global Variables
```javascript
cur          // Current card being studied (object or null)
answered     // Whether current card has been answered (boolean)
sessionCount // Number of cards studied this session (0-51)
editMode     // Whether options page is in edit mode (boolean)
streakData   // Streak tracking object {count, date}
cards        // Array of all flashcard objects
```

### Key Functions
| Function | Purpose |
|----------|---------|
| `save()` | Persist cards array to LocalStorage |
| `due()` | Filter cards due for review (due date <= now) |
| `today()` | Get current date as string |
| `updateStreak()` | Increment streak if new day |
| `next()` | Load next card for study |
| `toggle(edit)` | Open/close options page, set mode |

## Validation & Safety

### Import Validation
1. Check JSON parses successfully
2. Check parsed value is an array
3. Filter cards: must have `word`, `def`, and `card` properties
4. Only add valid cards, report count

### Defensive Coding
- Null checks on `cur` before operations
- Index validation before array splice
- Empty string checks on required fields
- Regex escaping for special characters in word matching
- Confirmation dialogs for destructive actions (delete, clear)

## Accessibility

- SVG icons have `role="button"` and `aria-label` attributes
- Focus management: auto-focus on input fields when appropriate
- Keyboard navigation: Enter key for answer submission and card progression
- Color contrast meets WCAG standards
- No reliance on color alone (animations provide additional feedback)

## Browser APIs Used

| API | Purpose |
|-----|---------|
| LocalStorage | Persist cards and streak data |
| Blob | Create downloadable JSON file |
| URL.createObjectURL | Generate download link |
| Date | Scheduling and streak tracking |

## Files

| File | Description |
|------|-------------|
| `index.html` | Complete application (HTML + CSS + JS) |
| `CLAUDE.md` | This documentation file |

## External Dependencies

| Dependency | URL | Purpose |
|------------|-----|---------|
| ts-fsrs | unpkg.com/ts-fsrs/dist/index.mjs | Spaced repetition algorithm |
| Inter font | fonts.googleapis.com | Typography |
