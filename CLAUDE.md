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
| 7 | **Log changes** | Add detailed change entry to Changelog section with date, description, and affected areas. |
| 8 | **Test before commit** | Manually verify changes work before any git commit. |
| 9 | **No feature creep** | Only add features explicitly requested by user. |
| 10 | **Preserve behavior** | Changes must not break existing functionality. |

## Stack

| Component | Technology |
|-----------|------------|
| Structure | Single HTML file (~425 lines) |
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
- Shake animation on wrong answer

### Session System (Pool-Based)

The app uses a **pool-based session system** that guarantees wrong cards repeat:

```
Session Start
    ↓
Create pool: shuffle due cards, take up to 51
    ↓
Pick random card from pool
    ↓
User answers:
  ├─ Correct → Remove card from pool
  └─ Wrong → Card stays in pool (will repeat)
    ↓
Pool empty? → Session complete!
```

**Key behaviors:**
- Session size: up to 51 cards (or fewer if less due)
- Wrong cards **guaranteed** to appear again until answered correctly
- Progress shows: `completed / total` (e.g., "15 / 51")
- Progress bar fills as cards leave the pool
- Page refresh starts a fresh session

### Progress Tracking
- **Counter**: Shows `completed / total` cards in session
- **Progress bar**: Visual indicator of session completion
- **Stability**: Memory strength displayed on card (e.g., "7d" = 7 days)
- **Streak**: Daily streak with flame icon, persists in LocalStorage
- **Streak Freeze**: Automatic protection if you miss one day

### Streak Freeze System
Automatic streak protection that saves your streak if you miss a day:

```
Studied yesterday    → Streak continues (+1)
Missed 1 day + freeze → Freeze used, streak continues (+1)
Missed 1 day, no freeze → Streak resets to 1
Missed 2+ days       → Streak resets to 1
```

**Earning freezes:**
- New users start with 1 free freeze
- +1 freeze every 7-day streak milestone (7, 14, 21...)
- Maximum 3 freezes stored
- Displayed as snowflake icon with count

### Session Goal
Customize how many cards per session with preset buttons:

| Preset | Cards | Time (~) |
|--------|-------|----------|
| 10 | 10 + wrong | ~2 min |
| 25 | 25 + wrong | ~5 min |
| 51 | 51 + wrong | ~10 min |
| 100 | 100 + wrong | ~20 min |

- Set in Settings modal
- Persists in localStorage
- Wrong answers still extend the session

### Deck Management
Multiple decks for different languages or topics:

```
┌─────────────────────────────────────┐
│ [Spanish ▼]              [⚙ gear]   │
│  ├─ Spanish     (current)           │
│  ├─ French                          │
│  ├─ Japanese                        │
│  ├─────────────                     │
│  └─ + New Deck                      │
└─────────────────────────────────────┘
```

**Features:**
- Deck selector dropdown (top-left)
- Each deck has separate cards, streak, session, freezes
- Create new deck from dropdown or prompt
- Rename/Delete deck in Settings modal
- Export includes deck name
- Import can create new deck or merge to current

**Storage per deck:**
- `fc_<deckname>` - cards
- `streak_<deckname>` - streak data
- `session_<deckname>` - session data

### Card Management
- Add new cards via gear menu → Add
- Edit current card via gear menu → Edit
- Delete current card with confirmation dialog
- JSON import (full backup or card array)
- JSON export (downloads all data)
- Clear all cards with type-to-confirm safety

### Stats Page
- **Summary bar**: Total cards, due count, cards by state (New/Learning/Review)
- **8 sort criteria** with descriptions:
  | Criteria | Description |
  |----------|-------------|
  | Due date | Next scheduled review date for each word |
  | Difficulty | How hard the algorithm thinks this word is (0-10) |
  | Stability | Days until you'd forget this word without review |
  | Lapses | Times you got this word wrong after learning it |
  | Reviews | Total number of times you've reviewed this word |
  | Last reviewed | When you last practiced this word |
  | State | Learning stage: New → Learning → Review → Relearning |
  | Alphabetical | Simple A-Z sorting by word |
- **Sort direction**: Ascending or Descending
- **Word list**: Scrollable list with state badges and metadata

## Pages

The app has **1 page + 3 modals**:

### Main Page (Study)
```
┌─────────────────────────────────────────┐
│                              [⚙ gear]   │
│  15 / 51          🔷 7d          🔥 5   │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  The cat ___ on the mat.        │   │
│  └─────────────────────────────────┘   │
│                                         │
│        to rest in a seated position (s) │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [type answer here]             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

Stats row (visible on hover):
- Left: Session progress (e.g., "15 / 51")
- Center-left: Stability (e.g., "🔷 7d")
- Center-right: Freezes (e.g., "❄️ 2")
- Right: Streak (e.g., "🔥 5")
```

### Edit Modal
- Opens via gear menu → Add (add mode) or Edit (edit mode)
- **Fields**:
  - Word (required)
  - Definition (required)
  - Example (optional)
- **Buttons**:
  - Save/Add (primary blue)
  - Delete (danger red, edit mode only)

### Stats Modal
- Opens via gear menu → Stats
- **Summary**: Total | Due | New | Learning | Review
- **Sort controls**: Dropdown for criteria + direction
- **Hint text**: Explains current sort criteria
- **Word list**: Each item shows word, state badge, and relevant metric

### Settings Modal
- Opens via gear menu → Settings
- **Current Deck**: Shows deck name with Rename/Delete buttons
- **Session Goal**: Preset buttons (10/25/51/100)
- **Import section**: Textarea + Import button
- **Export section**: Description + Export button
- **Danger zone**: Type "DELETE" + Clear All button

## UI Design

### Layout
- Max-width: 900px, centered
- Padding: 80px vertical, 40px horizontal
- Full viewport height with flexbox centering

### Color Palette (Dark Theme)
| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark navy | #0f172a |
| Card Background | Slate | #1e293b |
| Text Primary | White | #f8fafc |
| Text Secondary | Light gray | #94a3b8 |
| Text Muted | Gray | #64748b |
| Border | Dark gray | #334155 |
| Accent/Focus | Blue | #60a5fa |
| Primary Button | Blue | #3b82f6 |
| Success | Green | #22c55e |
| Error/Danger | Red | #dc2626 |
| Streak Icon | Orange | #f97316 |
| Stability Icon | Blue | #60a5fa |

### Button Hierarchy
| Type | Style | Use |
|------|-------|-----|
| Primary | Blue filled, white text | Main actions (Save, Add, New Session) |
| Secondary | Outline, gray border | Secondary actions (Done, Export) |
| Danger | Red border/text | Destructive actions (Delete, Clear) |

### Components
- **Card**: Dark background (#1e293b), subtle border, 12px radius, shadow
- **Inputs**: 8px radius, dark background, green/red border on correct/wrong
- **Stats row**: 30% opacity by default, 100% on card hover
- **Example box**: 24px font, dark background, subtle border
- **Modals**: Full-screen overlay, centered content (max 480px)
- **Menu**: Dropdown from gear icon, 140px min-width, hover highlight
- **Word list**: 60vh max-height, scrollable, items with bottom border

### Animations
| Animation | Duration | Use |
|-----------|----------|-----|
| Fade | 150ms | Transition between cards |
| Shake | 400ms | Wrong answer feedback |
| Reveal | 150ms | Show answer in example |
| Hover | 200ms | Button and link states |

## Icons

### Gear Menu (top-right)
| Icon | Action |
|------|--------|
| + | Add new card |
| ✎ | Edit current card (hidden if no card) |
| 📊 | Open stats modal |
| ⚙ | Open settings modal |

### Card Stats Row
| Icon | Meaning |
|------|---------|
| 🔷 (layers) | Memory stability in days |
| ❄️ (snowflake) | Streak freezes available (max 3) |
| 🔥 (flame) | Daily streak count |

### Modal Icons
| Icon | Action |
|------|--------|
| ✕ | Close modal |
| 💾 (floppy) | Save/Add card |
| 🗑 (trash) | Delete card / Clear all |
| ↑ (upload) | Import JSON |
| ↓ (download) | Export JSON |

## User Flows

### Study Flow
```
1. Session starts → Pool created (up to 51 due cards)
2. Random card shown: example (word as ___) + definition (hint)
3. Type answer in input field
4. Press Enter to submit
5. Result shown:
   - Correct: Green border, word highlighted green in example
   - Wrong: Red border, shake animation, word highlighted red
6. Press Enter to continue
7. Correct → Card removed from pool
   Wrong → Card stays in pool
8. Repeat until pool empty
9. "Session complete!" with New Session / Done buttons
```

### Add Card Flow
```
1. Click gear icon → "Add"
2. Modal opens in add mode
3. Enter Word (required)
4. Enter Definition (required)
5. Enter Example (optional)
6. Click "Add" button
7. Card created with empty FSRS state
8. Modal closes, new session starts
```

### Edit Card Flow
```
1. Click gear icon → "Edit"
2. Modal opens with current card data
3. Modify fields as needed
4. Click "Save" to update, or "Delete" to remove
5. If delete: Confirmation dialog appears
6. Modal closes, returns to study
```

### Stats Flow
```
1. Click gear icon → "Stats"
2. View summary (Total, Due, New, Learning, Review)
3. Select sort criteria from dropdown
4. Select sort direction (Ascending/Descending)
5. Read hint explaining the criteria
6. Scroll word list to review all cards
7. Click X to close
```

### Import Flow
```
1. Click gear icon → "Settings"
2. Paste JSON into textarea
3. Click "Import" button
4. Validation:
   - Full backup {fc, streak, session, curWord}: Replaces all data
   - Card array [{word, def, card}...]: Appends to existing
5. Alert shows number of imported cards
6. Modal closes, session refreshes
```

### Export Flow
```
1. Click gear icon → "Settings"
2. Click "Export" button
3. Browser downloads flashcards.json containing:
   - fc: All cards with FSRS state
   - streak: {count, date}
   - session: {count, wrong, words, date}
   - curWord: Current card word
```

### Clear All Flow
```
1. Click gear icon → "Settings"
2. Scroll to Danger Zone
3. Type "DELETE" in confirmation field
4. Button becomes enabled
5. Click "Clear All Cards"
6. All cards deleted, modal closes
```

## Data Structures

### Card Object
```javascript
{
  word: "string",      // The word to learn (required)
  def: "string",       // Definition/meaning (required)
  ex: "string",        // Example sentence (optional)
  card: {              // FSRS card state (required)
    due: Date,         // Next review date
    stability: Number, // Memory stability in days
    difficulty: Number,// Card difficulty (0-10)
    elapsed_days: Number,
    scheduled_days: Number,
    reps: Number,      // Total reviews
    lapses: Number,    // Times forgotten
    state: Number,     // 0=New, 1=Learning, 2=Review, 3=Relearning
    last_review: Date
  }
}
```

### Export Format (Full Backup)
```javascript
{
  fc: [...],           // Array of all card objects
  streak: {
    count: Number,     // Current streak days
    date: "string",    // Last activity date
    freezes: Number    // Available streak freezes (0-3)
  },
  session: {
    count: Number,     // Cards reviewed this session
    wrong: Number,     // Wrong answers this session
    words: [...],      // Words answered wrong
    date: "string"     // Session date
  },
  curWord: "string"    // Current card's word (or null)
}
```

### LocalStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `decks` | Array | List of deck names `["Default", "Spanish", ...]` |
| `currentDeck` | String | Active deck name |
| `fc_<deck>` | Array | Flashcard objects for specific deck |
| `streak_<deck>` | Object | `{count, date, freezes}` per deck |
| `session_<deck>` | Object | `{count, wrong, words[], date}` per deck |
| `sessionGoal` | Number | Cards per session (10/25/51/100) |
| `curWord` | String | Current card's word for restore |

## Key Functions

| Function | Purpose |
|----------|---------|
| `save()` | Persist cards array to LocalStorage |
| `due()` | Filter cards where due date ≤ now |
| `initPool()` | Reset session, create shuffled pool of up to 51 cards |
| `next(pickNew)` | Show next card or session complete screen |
| `updateStreak()` | Increment streak if new day |
| `saveSession()` | Persist session state to LocalStorage |
| `openEditModal(edit)` | Open modal in add (false) or edit (true) mode |
| `openStatsModal()` | Open stats modal, render summary and word list |
| `renderWordList()` | Sort cards and render to word list |
| `openSettingsModal()` | Open settings modal |

## FSRS Integration

### Rating System
| Answer | FSRS Rating | Effect |
|--------|-------------|--------|
| Correct | Good (3) | Normal progression, stability increases |
| Wrong/Empty | Again (1) | Reset to relearning, short interval |

### Card States
| State | Value | Meaning |
|-------|-------|---------|
| New | 0 | Never reviewed |
| Learning | 1 | Initial learning phase |
| Review | 2 | Graduated to review |
| Relearning | 3 | Forgotten, relearning |

### Stability Explained
- Represents memory strength in days
- Higher = stronger memory, longer until next review
- Displayed on card during study (e.g., "7d")
- New cards start with ~0.5-1 day
- Grows with each successful review
- Resets on lapse (wrong answer)

## Validation

### Form Validation
- Word: Required, alert if empty
- Definition: Required, alert if empty
- Example: Optional

### Import Validation
- Must be valid JSON
- Full backup: Must have `fc` array with valid cards
- Card array: Each card needs `word`, `def`, `card` properties
- Invalid cards silently skipped

### Security
- XSS protection: Word text escaped in stats list
- No external data execution
- All data stored locally

### Destructive Action Safety
| Action | Protection |
|--------|------------|
| Delete card | Confirmation dialog |
| Clear all | Type "DELETE" to enable |

## Files

| File | Lines | Description |
|------|-------|-------------|
| `index.html` | ~425 | Complete application (HTML + CSS + JS) |
| `CLAUDE.md` | ~350 | Documentation (this file) |

## External Dependencies

| Dependency | URL | Purpose |
|------------|-----|---------|
| ts-fsrs | `unpkg.com/ts-fsrs/dist/index.mjs` | FSRS spaced repetition algorithm |
| Inter font | `fonts.googleapis.com` | Typography |

## Browser Support

- Modern browsers with ES modules support
- LocalStorage required
- No IE support

## Changelog

### 2026-01-17

#### Fixed: Session Pool Prioritizes Overdue Cards
- **What**: Modified `initPool()` to sort due cards first, then new cards
- **Why**: Users expect to see overdue cards before new cards when opening the app
- **Files changed**: `index.html` (initPool function)
- **Affected areas**: Session initialization, card ordering
- **New behavior**: Due cards (past due date) appear first in session, followed by new cards

### 2026-01-16

#### Added: Full Data Export/Import
- **What**: Export now includes all localStorage data (cards, streak, session, curWord)
- **Why**: Allow full backup and restore across devices
- **Files changed**: `index.html` (btnExport, btnImport handlers)
- **Affected areas**: Settings modal, data persistence

#### Added: Stats Page
- **What**: New modal showing all cards with 8 sort criteria
- **Why**: Users need to review and analyze their vocabulary
- **Files changed**: `index.html` (HTML modal, CSS styles, JS functions)
- **Affected areas**: Gear menu, new statsModal, renderWordList function
- **Sort criteria**: Due date, Difficulty, Stability, Lapses, Reviews, Last reviewed, State, Alphabetical

#### Added: Stability Display on Card
- **What**: Show memory stability (days) on study card with layers icon
- **Why**: Help users understand memory strength while studying
- **Files changed**: `index.html` (stats row HTML, next() function)
- **Affected areas**: Card stats row display

#### Changed: Pool-Based Session System
- **What**: Replaced random card selection with pool-based system
- **Why**: Guarantee wrong cards repeat until answered correctly
- **Files changed**: `index.html` (initPool, next, answer handler)
- **Affected areas**: Session flow, progress tracking
- **New behavior**:
  - Pool created at session start (up to sessionGoal cards)
  - Correct answers remove card from pool
  - Wrong answers keep card in pool
  - Session ends when pool empty

#### Fixed: Session Counter
- **What**: Show correct progress (completed/total) and 100% on completion
- **Why**: Counter showed wrong values, didn't reach 5/5
- **Files changed**: `index.html` (next function, progress display)
- **Affected areas**: Stats row, progress bar

#### Added: Streak Freeze System
- **What**: Automatic streak protection when missing one day
- **Why**: Prevent frustration from losing long streaks
- **Files changed**: `index.html` (streakData, updateStreak function, freeze display)
- **Affected areas**: Stats row, streak logic
- **Details**:
  - New users start with 1 free freeze
  - Earn +1 freeze every 7-day milestone
  - Maximum 3 freezes stored
  - Auto-used when missing 1 day

#### Added: Session Goal Presets
- **What**: Customizable session size (10/25/51/100 cards)
- **Why**: Different users need different session lengths
- **Files changed**: `index.html` (Settings modal HTML, sessionGoal variable, goal buttons)
- **Affected areas**: Settings modal, sessionLimit function
- **Storage**: `sessionGoal` in localStorage

#### Improved: Import Placeholder
- **What**: Added helpful placeholder text to import textarea
- **Why**: Guide users on expected JSON format
- **Files changed**: `index.html` (textarea placeholder)
- **Affected areas**: Settings modal import section

#### Added: Multi-Deck Support
- **What**: Multiple decks for different languages/topics
- **Why**: Users want to study different languages separately
- **Files changed**: `index.html` (deck selector HTML/CSS/JS, Settings modal deck section)
- **Affected areas**: All data storage, import/export, UI header
- **Features**:
  - Deck selector dropdown (top-left)
  - Each deck has separate cards, streak, session, freezes
  - Create/Rename/Delete decks
  - Export includes deck name
  - Import can create new deck or merge
- **Storage**:
  - `decks` - array of deck names
  - `currentDeck` - active deck name
  - `fc_<deckname>` - cards per deck
  - `streak_<deckname>` - streak per deck
  - `session_<deckname>` - session per deck
