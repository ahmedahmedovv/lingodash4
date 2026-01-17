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
- **Stability**: Memory strength displayed on card (e.g., "7d")
- **Streak**: Daily streak with flame icon, persists in LocalStorage
- **Streak Freeze**: Automatic protection if you miss one day

### Image Search (Manual)
- **Visual Learning**: Manual Bing image search available via gear menu
- **Contextual Images**: Search for relevant images for vocabulary words
- **Fullscreen Option**: Click gear menu → "Images" for dedicated fullscreen image search
- **Cross-Origin Compatible**: No automatic display to avoid browser security warnings

### Text-to-Speech (TTS)
- **Pronunciation Practice**: Automatic speech synthesis for example sentences after answering
- **ElevenLabs Integration**: Uses ElevenLabs API for high-quality speech synthesis with API key authentication
- **Fallback System**: Falls back to browser's Web Speech API if ElevenLabs fails
- **Complete Sentences**: Speaks the full example sentence with the target word revealed
- **Graceful Fallback**: Silently falls back to Web Speech API on unsupported browsers or API failures
- **Timing**: Speaks after answer is revealed and images are loaded

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
- Max-width: 1200px (body), 1000px (card), centered
- Padding: 80px vertical, 40px horizontal
- Full viewport height with flexbox centering
- Card: Compact vertical spacing (16px padding), full width utilization

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
- **Stats row**: 50% opacity by default, 100% on card hover
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
| 🖼 | Open fullscreen image search (hidden if no card) |
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
   - Full backup {fc, streak, session}: Replaces all data
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
   - streak: {count, date, freezes}
   - session: {count, wrong, words, date}
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
  }
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

## Key Functions

| Function | Purpose |
|----------|---------|
| `save()` | Persist cards array to LocalStorage |
| `due()` | Filter cards where due date ≤ now |
| `today()` | Return today's date string |
| `formatDateDDMMYYYY(d)` | Format dates as DD/MM/YYYY |
| `parseDateDDMMYYYY(d)` | Parse DD/MM/YYYY formatted dates |
| `getDeckKey(base)` | Generate deck-specific localStorage keys |
| `initPool()` | Reset session, create shuffled pool of up to 51 cards |
| `next(pickNew)` | Show next card or session complete screen |
| `speakText(text)` | TTS function using Web Speech API |
| `updateStreak()` | Increment streak if new day |
| `saveSession()` | Persist session state to LocalStorage |
| `sessionLimit()` | Calculate total session size (goal + wrong answers) |
| `toggleMenu()` | Toggle gear menu visibility and edit option |
| `closeMenu()` | Close gear menu |
| `openEditModal(edit)` | Open modal in add (false) or edit (true) mode |
| `closeEditModal()` | Close edit modal |
| `openSettingsModal()` | Open settings modal |
| `closeSettingsModal()` | Close settings modal |
| `openStatsModal()` | Open stats modal, render summary and word list |
| `closeStatsModal()` | Close stats modal |
| `openImageSearchModal()` | Open manual image search modal |
| `closeImageSearchModal()` | Close image search modal |
| `renderWordList()` | Sort cards and render to word list |
| `renderDeckMenu()` | Render deck selector dropdown |
| `switchDeck(deckName)` | Switch to different deck |
| `createNewDeck()` | Create new deck |
| `deleteDeck(deckName)` | Delete deck |
| `renameDeck(oldName)` | Rename deck |
| `esc(s)` | HTML escape function for XSS protection |

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

### 2026-01-18

#### Added: ElevenLabs Text-to-Speech Integration
- **What**: Replaced Web Speech API with ElevenLabs TTS for higher quality speech synthesis
- **Why**: Provide better pronunciation practice with professional voice synthesis
- **Files changed**: `index.html` (ElevenLabs direct API integration, speakText function update), `CLAUDE.md` (TTS feature documentation)
- **Affected areas**: Text-to-speech functionality, audio playback during study
- **Technical details**:
  - Direct REST API integration with ElevenLabs (no SDK dependency)
  - Uses provided API key for authentication
  - Voice ID: 'JBFqnCBsd6RMkjVDRZzb' (English voice)
  - Model: 'eleven_multilingual_v2' for high quality
  - Fallback to Web Speech API if ElevenLabs fails
  - Async implementation with proper audio blob handling
- **New behavior**: Example sentences are now spoken using ElevenLabs TTS with Web Speech API as backup

#### Added: Automatic Image Display
- **What**: Restored automatic Bing image display after answering cards
- **Why**: User preferred the visual learning feature despite minor console warnings
- **Files changed**: `index.html` (restored automatic image display code), `CLAUDE.md` (updated image search feature description)
- **Affected areas**: Study interface, visual learning enhancement
- **Technical details**:
  - Automatic iframe loading after answer submission
  - Bing image search results appear below flashcards
  - Manual "Images" menu option still available for dedicated fullscreen search
  - Note: May show browser security warnings in console (harmless)
- **New behavior**: Images automatically appear after each answer for visual context

### 2026-01-17

#### Fixed: Security Fixes and Final Polish
- **What**: Fixed XSS vulnerabilities, added missing features, improved mobile support
- **Why**: Security hardening and feature completeness
- **Files changed**: `index.html` (security, UI, error handling)
- **Affected areas**: Security, deck menu, example display, mobile viewport, error handling
- **Changes**:
  - **XSS fix in deck menu**: Escape deck names before inserting into HTML
  - **XSS fix in example reveal**: Escape example text before innerHTML insertion
  - **Dead code removed**: Removed leftover `curWord` reference in switchDeck()
  - **Images menu added**: New "Images" menu item for fullscreen image search (was missing)
  - **Mobile viewport**: Added viewport meta tag for responsive design
  - **Date format consistency**: Stats modal dates now use DD/MM/YYYY format consistently
  - **CDN error handling**: Added timeout and error message if FSRS module fails to load
  - **Global escape function**: Moved `esc()` to global scope for consistent XSS prevention

### 2026-01-17

#### Fixed: Multiple Bug Fixes and UX Improvements
- **What**: Fixed 7 issues including session state, export dates, UI polish, and keyboard navigation
- **Why**: Improve app reliability and user experience
- **Files changed**: `index.html` (session logic, export, UI, event handlers)
- **Affected areas**: Session management, export/import, modal navigation, stats display
- **Changes**:
  - **Session state simplified**: Removed broken `curWord` restoration logic - page reload now always starts fresh session (matches documented behavior)
  - **Export date fixed**: Session date in export now uses actual session date instead of current date
  - **RTL direction removed**: Removed unnecessary RTL styling from image display area
  - **Escape key support**: Added keyboard shortcut (Escape) to close all modals and menus
  - **Empty word guard**: Improved regex handling for edge case of empty/whitespace-only words
  - **Stats visibility**: Increased stats row default opacity from 30% to 50% for better readability
  - **No cards due message**: Added friendly "No cards due. Come back later!" when no cards are due or new
  - **Code cleanup**: Removed all `curWord` localStorage operations (6 occurrences)

### 2026-01-17

#### Updated: Documentation Corrections
- **What**: Added missing utility functions to CLAUDE.md documentation
- **Why**: Ensure documentation accurately reflects all implemented functions
- **Files changed**: `CLAUDE.md` (Key Functions section)
- **Affected areas**: Documentation completeness and accuracy
- **Changes**:
  - Added missing functions to Key Functions table: `getDeckKey()`, `sessionLimit()`, `toggleMenu()`, `closeMenu()`, `esc()`
  - Verified all functions from index.html are now properly documented in the Key Functions table

### 2026-01-17

#### Updated: Documentation Corrections
- **What**: Added missing features and functions to CLAUDE.md documentation
- **Why**: Ensure documentation accurately reflects all implemented features
- **Files changed**: `CLAUDE.md` (Features section, Key Functions section)
- **Affected areas**: Documentation completeness and accuracy
- **Changes**:
  - Added "Automatic Image Display" feature section (was only in changelog)
  - Added "Text-to-Speech (TTS)" feature section (was only in changelog)
  - Added missing functions to Key Functions table: `speakText()`, `openImageSearchModal()`, `closeImageSearchModal()`, `formatDateDDMMYYYY()`, `parseDateDDMMYYYY()`, `renderDeckMenu()`, `switchDeck()`, `createNewDeck()`, `deleteDeck()`, `renameDeck()`, and close modal functions
  - Verified all functions and features from index.html are properly documented

### 2026-01-17

#### Added: Automatic Bing Image Display
- **What**: Bing image search results automatically appear under flashcards after answering
- **Why**: Visual learning aid for vocabulary with relevant images shown immediately during study
- **Files changed**: `index.html` (added automatic image display area, modified answer submission flow, updated layout)
- **Affected areas**: Study interface, answer submission logic, UI layout
- **Technical details**:
  - Embedded Bing image search in iframe that appears below the card
  - No API keys or external dependencies needed
  - Images load automatically after answer is revealed (along with TTS)
  - 500px height, 1100px max-width iframe for better viewing
  - Images hide when moving to next card
- **New behavior**: After typing answer and pressing Enter, Bing image search results for the word appear automatically under the card

#### Changed: UI Layout Optimization
- **What**: Optimized card and image display areas for better user experience
- **Why**: Improve visual balance and provide more space for image browsing
- **Files changed**: `index.html` (modified CSS for card padding and image area dimensions)
- **Affected areas**: Card display, image search section sizing
- **Changes**:
  - Card section: Reduced vertical padding from 48px to 32px (more compact)
  - Image area: Increased height from 300px to 500px (67% taller)
  - Image area: Increased max-width from 900px to 1100px (22% wider)

#### Added: Text-to-Speech (TTS) Functionality
- **What**: Automatic speech synthesis for example sentences after answering flashcards
- **Why**: Enhance language learning with pronunciation practice
- **Files changed**: `index.html` (added speakText function, integrated into answer submission flow)
- **Affected areas**: Answer submission logic, user study experience
- **Technical details**:
  - Uses browser's built-in Web Speech API
  - Speaks complete example sentence after answer is revealed
  - No external dependencies required
  - Graceful fallback for unsupported browsers
- **New behavior**: After typing answer and pressing Enter, the full example sentence is automatically spoken

### 2026-01-17

#### Changed: Date Format Standardization
- **What**: Standardized all date formats throughout the app to use DD/MM/YYYY format
- **Why**: Ensure consistent date formatting for display and export/import
- **Files changed**: `index.html` (added formatDateDDMMYYYY and parseDateDDMMYYYY functions, updated export/import)
- **Affected areas**: Export functionality, import functionality, date formatting
- **New behavior**: All exported dates use DD/MM/YYYY format, import can parse DD/MM/YYYY formatted dates

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
