# Flashcard App

Minimal FSRS-based flashcard app for language learning.

---

## Project Overview

A lightweight, browser-based flashcard application designed for vocabulary learning. Uses the FSRS (Free Spaced Repetition Scheduler) algorithm to optimize review timing. Built as a single HTML file with no build process - just open in a browser and start learning.

**Core value proposition**: Simple, fast, effective vocabulary learning without account creation, cloud sync, or complex setup.

## Goals & Non-Goals

### Goals
| Goal | Description |
|------|-------------|
| **Simplicity** | Anyone can use it immediately without tutorials |
| **Offline-first** | Works without internet (except TTS/images) |
| **Zero setup** | No accounts, no installation, no configuration |
| **Effective learning** | FSRS algorithm for optimal retention |
| **Portable** | Single file, runs anywhere with a browser |

### Non-Goals
| Non-Goal | Why |
|----------|-----|
| **Cloud sync** | Adds complexity, requires accounts |
| **Social features** | Out of scope, adds bloat |
| **Gamification** | Beyond streaks, keeps it simple |
| **Multiple question types** | Type-answer only, keeps UI simple |
| **Spaced repetition customization** | FSRS defaults work well |
| **Mobile app** | Browser works on mobile already |

## Target Users

| User Type | Use Case |
|-----------|----------|
| **Language learners** | Building vocabulary in a new language |
| **Students** | Memorizing terms for exams |
| **Self-learners** | Anyone wanting to memorize word-definition pairs |
| **Privacy-conscious** | Users who prefer local-only data |

**Skill level**: Beginner to intermediate. No technical knowledge required.

**Assumptions**:
- User has a modern web browser
- User can create their own flashcards (no pre-made decks)
- User understands basic flashcard concept

## Design Philosophy

```
┌─────────────────────────────────────────────────────────┐
│                    DESIGN PRINCIPLES                     │
├─────────────────────────────────────────────────────────┤
│  1. SIMPLICITY OVER FEATURES                            │
│     If it can be removed, remove it.                    │
│     Every feature must justify its existence.           │
│                                                         │
│  2. SINGLE FILE ARCHITECTURE                            │
│     Everything in one HTML file.                        │
│     No build tools, no dependencies beyond CDN.         │
│                                                         │
│  3. OFFLINE-FIRST                                       │
│     Core functionality works without internet.          │
│     External features (TTS, images) are enhancements.   │
│                                                         │
│  4. RESPECT USER DATA                                   │
│     All data stays local in browser.                    │
│     No tracking, no analytics, no cloud.                │
│                                                         │
│  5. DARK MODE ONLY                                      │
│     One theme, done well. No theme switching bloat.     │
└─────────────────────────────────────────────────────────┘
```

---

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
| Structure | Single HTML file (~600 lines) |
| JavaScript | Vanilla JS with ES modules |
| Algorithm | FSRS via CDN (ts-fsrs) |
| Storage | LocalStorage + IndexedDB |
| Typography | Inter font (Google Fonts) |

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   <style>   │  │   <body>    │  │       <script>          │  │
│  │             │  │             │  │                         │  │
│  │  - Colors   │  │  - Card     │  │  - FSRS integration     │  │
│  │  - Layout   │  │  - Modals   │  │  - State management     │  │
│  │  - Buttons  │  │  - Menus    │  │  - Event handlers       │  │
│  │  - Inputs   │  │  - Stats    │  │  - Storage (LS + IDB)   │  │
│  │  - Modals   │  │  - Images   │  │  - TTS (ElevenLabs)     │  │
│  │             │  │             │  │  - Deck management      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ LocalStorage│     │  IndexedDB  │     │  External   │
   │             │     │             │     │   APIs      │
   │ - Cards     │     │ - Audio     │     │             │
   │ - Streaks   │     │   cache     │     │ - ts-fsrs   │
   │ - Sessions  │     │             │     │ - ElevenLabs│
   │ - Settings  │     │             │     │ - Bing imgs │
   └─────────────┘     └─────────────┘     └─────────────┘
```

### Data Flow

```
User Action → Event Handler → State Update → LocalStorage → UI Render
                    │
                    └──→ FSRS Algorithm (for card scheduling)
```

## State Management

### Global Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `cards` | Array | All flashcards for current deck |
| `cur` | Object | Currently displayed card |
| `pool` | Array | Cards remaining in current session |
| `poolSize` | Number | Initial session size |
| `answered` | Boolean | Whether current card has been answered |
| `editMode` | Boolean | Edit modal in add vs edit mode |
| `sessionCount` | Number | Cards completed this session |
| `wrongCount` | Number | Wrong answers this session |
| `wrongWords` | Array | Words answered wrong (for pool) |
| `streakData` | Object | {count, date, freezes} |
| `sessionData` | Object | {count, wrong, words, date} |
| `currentDeck` | String | Active deck name |
| `decks` | Array | List of all deck names |
| `sessionGoal` | Number | Target cards per session |
| `audioCacheDB` | IDBDatabase | IndexedDB connection for audio |

### State Transitions

```
App Load
    │
    ├─→ Load decks from localStorage
    ├─→ Load cards for current deck
    ├─→ Load streak data
    ├─→ Initialize audio cache (IndexedDB)
    └─→ Call next() to show first card

Answer Submitted (Enter key)
    │
    ├─→ If not answered:
    │   ├─→ Check answer correctness
    │   ├─→ Update FSRS card state
    │   ├─→ Update pool (remove if correct)
    │   ├─→ Update streak (if new day)
    │   ├─→ Save to localStorage
    │   ├─→ Show TTS + images
    │   └─→ Set answered = true
    │
    └─→ If already answered:
        ├─→ Hide images
        └─→ Call next() for new card
```

## Event Flow

### Key User Interactions

| Event | Trigger | Handler | Result |
|-------|---------|---------|--------|
| Answer submit | Enter key | `ans.onkeydown` | Check answer, update FSRS, show result |
| Next card | Enter key (after answer) | `ans.onkeydown` | Load next card from pool |
| Open menu | Click gear icon | `icon.onclick` | Toggle menu visibility |
| Add card | Click "Add" menu | `menuAdd.onclick` | Open edit modal (add mode) |
| Edit card | Click "Edit" menu | `menuEdit.onclick` | Open edit modal (edit mode) |
| Save card | Click "Save" button | `btnSave.onclick` | Validate, save, close modal |
| Delete card | Click "Delete" button | `btnDel.onclick` | Confirm, delete, refresh |
| Switch deck | Click deck in dropdown | `deck-menu-item.onclick` | Load new deck data |
| Import | Select file + click Import | `btnImport.onclick` | Parse JSON, merge cards |
| Export | Click Export | `btnExport.onclick` | Download JSON file |
| Close modal | Escape key or X button | Various | Hide modal, refocus input |

## Z-Index Map

| Element | Z-Index | Purpose |
|---------|---------|---------|
| Deck selector | 10 | Above card, below menus |
| Gear icon | 10 | Above card, below menus |
| Deck menu | 20 | Above selector |
| Gear menu | 20 | Above icon |
| Modals | 100 | Above everything |

## LocalStorage Schema

### Complete Key Reference

```javascript
// Global keys (not per-deck)
localStorage.getItem('decks')        // '["Default","Spanish"]'
localStorage.getItem('currentDeck')  // 'Spanish'
localStorage.getItem('sessionGoal')  // '51'

// Per-deck keys (where <deck> is deck name)
localStorage.getItem('fc_<deck>')      // '[{word,def,ex,card}...]'
localStorage.getItem('streak_<deck>')  // '{"count":5,"date":"Sat Jan 18 2026","freezes":2}'
localStorage.getItem('session_<deck>') // '{"count":10,"wrong":2,"words":["hello"],"date":"Sat Jan 18 2026"}'
```

### Example Data

```javascript
// Cards array
[
  {
    "word": "hello",
    "def": "a greeting",
    "ex": "Hello, how are you?",
    "card": {
      "due": "2026-01-19T10:00:00.000Z",
      "stability": 4.5,
      "difficulty": 5.2,
      "elapsed_days": 1,
      "scheduled_days": 2,
      "reps": 3,
      "lapses": 0,
      "state": 2,
      "last_review": "2026-01-18T10:00:00.000Z"
    }
  }
]

// Streak data
{
  "count": 7,
  "date": "Sat Jan 18 2026",
  "freezes": 2
}

// Session data
{
  "count": 15,
  "wrong": 3,
  "words": ["difficult", "complex", "hard"],
  "date": "Sat Jan 18 2026"
}
```

---

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
- Page refresh continues session (within same day)
- New day or "New Session" button starts fresh

### Progress Tracking
- **Counter**: Shows `completed / total` cards in session
- **Progress bar**: Visual indicator of session completion
- **Stability**: Memory strength displayed on card (e.g., "7d")
- **Streak**: Daily streak with flame icon, persists in LocalStorage
- **Streak Freeze**: Automatic protection if you miss one day

### Image Search (Automatic + Manual)
- **Visual Learning**: Automatic Bing image search appears after each answer
- **Contextual Images**: Relevant images shown immediately for vocabulary words
- **Manual Option**: Fullscreen dedicated image search via gear menu → Images
- **Browser Warnings**: May show harmless cross-origin security messages in console

### Text-to-Speech (TTS)
- **Pronunciation Practice**: Automatic speech synthesis for example sentences after answering
- **ElevenLabs Integration**: Uses ElevenLabs API for high-quality speech synthesis with API key authentication
- **IndexedDB Audio Caching**: Locally caches generated audio to avoid repeated API calls
- **Cost Optimization**: Only calls ElevenLabs API once per unique sentence
- **Offline Support**: Works without internet for cached sentences
- **Fallback System**: Falls back to browser's Web Speech API if ElevenLabs fails
- **Complete Sentences**: Speaks the full example sentence with the target word revealed
- **Graceful Fallback**: Silently falls back to Web Speech API on unsupported browsers or API failures
- **Timing**: Speaks after answer is revealed and images are loaded
- **Cache Management**: Automatic cleanup and storage of audio blobs in IndexedDB

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
- Import cards from JSON files via file selector
- Export cards to JSON files for backup/sharing
- Automatic localStorage persistence (no manual import/export needed)
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
- **Import Cards**: File selector for JSON import with validation
- **Export Cards**: Download all cards as JSON file
- **Session Goal**: Preset buttons (10/25/51/100)
- **Danger zone**: Type "DELETE" + Clear All button
- **Data persistence**: Automatic localStorage saving with optional JSON backup

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
1. Session starts → Pool created (up to sessionGoal cards: due first, then new)
2. First card from pool shown: example (word as ___) + definition (hint)
   (Pool is pre-shuffled within groups: due cards shuffled, new cards shuffled)
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

### Storage Systems

#### LocalStorage Keys
| Key | Type | Description |
|-----|------|-------------|
| `decks` | Array | List of deck names `["Default", "Spanish", ...]` |
| `currentDeck` | String | Active deck name |
| `fc_<deck>` | Array | Flashcard objects for specific deck |
| `streak_<deck>` | Object | `{count, date, freezes}` per deck |
| `session_<deck>` | Object | `{count, wrong, words[], date}` per deck |
| `sessionGoal` | Number | Cards per session (10/25/51/100) |

#### IndexedDB Database
| Database | Store | Description |
|----------|-------|-------------|
| `LingodashAudioCache` | `audio` | Cached ElevenLabs audio blobs with cache keys and timestamps |

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
| `speakText(text)` | TTS function using ElevenLabs API with IndexedDB caching |
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
| `initAudioCache()` | Initialize IndexedDB for audio caching |
| `getCachedAudio(key)` | Retrieve cached audio from IndexedDB |
| `cacheAudio(key, blob)` | Store audio blob in IndexedDB |
| `generateCacheKey(text, voice, model)` | Create hash key for audio caching |
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

### FSRS Deep Dive

The FSRS (Free Spaced Repetition Scheduler) algorithm is a modern alternative to SM-2 (used by Anki). It uses a mathematical model of memory to predict optimal review times.

#### How It Works

```
User answers card
       │
       ▼
┌─────────────────┐
│ FSRS calculates │
│ new card state  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 Correct    Wrong
    │         │
    ▼         ▼
 Rating:   Rating:
 Good(3)   Again(1)
    │         │
    ▼         ▼
Stability  Stability
increases  resets
    │         │
    ▼         ▼
Next due   Next due
in X days  soon (mins/hours)
```

#### Key FSRS Concepts

| Concept | Description |
|---------|-------------|
| **Stability** | How long you'd remember this without review (days) |
| **Difficulty** | Inherent difficulty of this card (0-10) |
| **Retrievability** | Probability you can recall right now (0-1) |
| **State** | Learning phase (New→Learning→Review→Relearning) |

#### Why Only Good/Again?

This app simplifies FSRS by only using two ratings:
- **Good (3)**: You knew it → schedule next review
- **Again (1)**: You didn't know it → review soon

Full FSRS supports: Again(1), Hard(2), Good(3), Easy(4). Simplifying to two options reduces decision fatigue and speeds up reviews.

---

## Deck Data Isolation

Each deck maintains completely separate data to prevent cross-contamination.

### Storage Separation

```
localStorage
├── decks                    → ["Default", "Spanish", "Japanese"]
├── currentDeck              → "Spanish"
├── sessionGoal              → 51 (global)
│
├── fc_Default               → [{cards...}]
├── streak_Default           → {count, date, freezes}
├── session_Default          → {count, wrong, words, date}
│
├── fc_Spanish               → [{cards...}]
├── streak_Spanish           → {count, date, freezes}
├── session_Spanish          → {count, wrong, words, date}
│
└── fc_Japanese              → [{cards...}]
    streak_Japanese          → ...
    session_Japanese         → ...
```

### Deck Switching Flow

```
User clicks new deck
       │
       ▼
Save nothing (already saved on each action)
       │
       ▼
Update currentDeck in localStorage
       │
       ▼
Clear in-memory arrays (cards, pool)
       │
       ▼
Load new deck's cards from localStorage
       │
       ▼
Load new deck's streak data
       │
       ▼
Load new deck's session data
       │
       ▼
Reset pool and poolSize
       │
       ▼
Call next() to show first card
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Delete current deck | Switch to first remaining deck |
| Delete only deck | Prevent deletion (minimum 1 deck) |
| Rename deck | Update all localStorage keys |
| Import to new deck | Create deck, switch to it |
| Import to current | Replace all cards in current deck |

---

## Audio System (TTS)

The text-to-speech system provides pronunciation practice using ElevenLabs API with intelligent caching.

### Audio Flow

```
Answer revealed
       │
       ▼
speakText(example sentence)
       │
       ▼
Generate cache key (hash of text + voice + model)
       │
       ▼
Check IndexedDB cache
       │
    ┌──┴──┐
    ▼     ▼
 Found  Not found
    │     │
    ▼     ▼
 Play   Call ElevenLabs API
cached       │
audio        ▼
         Store in IndexedDB
              │
              ▼
         Play audio
              │
              ▼
         (On error: fallback to Web Speech API)
```

### Cache Key Generation

```javascript
// Input
text: "Hello, how are you?"
voice: "JBFqnCBsd6RMkjVDRZzb"
model: "eleven_multilingual_v2"

// Hash function produces
cacheKey: "1234567890" (32-bit integer as string)
```

### IndexedDB Schema

```javascript
// Database: LingodashAudioCache
// Object Store: audio
{
  cacheKey: "1234567890",      // Primary key
  audioBlob: Blob,             // Audio data
  timestamp: 1705574400000     // When cached
}
```

### Fallback Chain

```
ElevenLabs API
    │
    ├─→ Success → Play audio
    │
    └─→ Failure → Web Speech API
                      │
                      ├─→ Success → Speak text
                      │
                      └─→ Failure → Silent (no error shown)
```

---

## Session Lifecycle

A study session manages which cards are shown and tracks progress.

### Session State Machine

```
                         Page Load
                             │
                             ▼
                    ┌────────────────┐
                    │ Check saved    │
                    │ session (today)│
                    └───────┬────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────┐
      │ Restore pool    │       │   No Pool   │ ◄─── New day / New Session
      │ from localStorage│       │  poolSize=0 │
      └────────┬────────┘       └──────┬──────┘
               │                       │
               │                       ▼
               │               ┌─────────────┐
               │               │  initPool() │
               │               │ Create pool │
               │               └──────┬──────┘
               └───────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │  Pool has   │          │ Pool empty  │
       │   cards     │          │ (no due)    │
       └──────┬──────┘          └──────┬──────┘
              │                        │
              ▼                        ▼
       ┌─────────────┐          "No cards due.
       │ Show random │           Come back later!"
       │ card from   │
       │    pool     │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │   Answer    │
       │  submitted  │
       └──────┬──────┘
              │
       ┌──────┴──────┐
       ▼             ▼
   Correct        Wrong
       │             │
       ▼             ▼
   Remove from   Stay in pool
     pool        (will repeat)
       │             │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ Pool empty? │
       └──────┬──────┘
              │
       ┌──────┴──────┐
       ▼             ▼
      No            Yes
       │             │
       ▼             ▼
   Show next    "Session
     card       complete!"
```

### Pool Initialization

```javascript
function initPool() {
  // 1. Reset counters
  sessionCount = 0;
  wrongCount = 0;
  wrongWords = [];

  // 2. Get due cards and shuffle them
  let dueCards = due().sort(() => Math.random() - 0.5);

  // 3. Get new cards (state 0) and shuffle them
  let newCards = cards.filter(c => c.card.state === 0)
    .sort(() => Math.random() - 0.5);

  // 4. Combine: due cards FIRST, then new cards
  // This ensures spaced repetition priority is respected
  let combined = [...dueCards, ...newCards];

  // 5. Take up to sessionLimit cards
  pool = combined.slice(0, sessionLimit());
  poolSize = pool.length;
}

// next() picks pool[0], so due cards always shown before new cards
```

### Progress Calculation

```javascript
// During session
const completed = poolSize - pool.length;  // Cards removed from pool
const total = poolSize;                     // Initial pool size
const progress = completed / total * 100;   // Percentage

// Display
counter.textContent = `${completed} / ${total}`;  // "15 / 51"
progressBar.style.width = `${progress}%`;
```

---

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

---

## Development Guide

### Quick Start

```bash
# Run the app (no installation needed)
1. Open index.html in any modern browser
2. That's it. No npm, no build, no server.

# Or use a local server (optional, for development)
python -m http.server 8000
# Then open http://localhost:8000
```

### Testing Checklist

Before committing any changes, manually verify:

| Area | Test |
|------|------|
| **Cards** | Add a new card, edit it, delete it |
| **Study** | Answer correctly, answer wrong, complete session |
| **Session** | Verify wrong cards repeat, progress updates |
| **Streak** | Check streak increments on new day |
| **Decks** | Create deck, switch decks, rename, delete |
| **Import** | Import a JSON file, verify cards load |
| **Export** | Export cards, verify JSON is valid |
| **TTS** | Verify audio plays after answer |
| **Images** | Verify Bing images appear |
| **Modals** | Open/close all modals, Escape key works |
| **Mobile** | Test on phone or responsive mode |

### Common Development Tasks

#### Add a New Menu Item
```javascript
// 1. Add HTML in the menu div (index.html ~line 95)
<div class="menu-item" id="menuNewThing">
  <svg>...</svg>New Thing
</div>

// 2. Add click handler (in <script>)
menuNewThing.onclick = () => { closeMenu(); doNewThing(); };

// 3. Implement the function
function doNewThing() { /* ... */ }
```

#### Add a New Modal
```javascript
// 1. Add HTML structure
<div class="modal" id="newModal">
  <div class="modal-inner">
    <div class="modal-header">
      <span class="modal-title">Title</span>
      <svg class="modal-close" id="closeNew">...</svg>
    </div>
    <!-- content -->
  </div>
</div>

// 2. Add open/close functions
const openNewModal = () => { newModal.style.display = 'block'; };
const closeNewModal = () => { newModal.style.display = 'none'; ans.focus(); };

// 3. Wire up close button and Escape key
closeNew.onclick = closeNewModal;
// Add to Escape key handler
```

#### Add a New LocalStorage Key
```javascript
// 1. Define the key pattern
const getDeckKey = (base) => `${base}_${currentDeck}`;

// 2. Load on startup
let newData = JSON.parse(localStorage.getItem(getDeckKey('newkey')) || '{}');

// 3. Save when changed
localStorage.setItem(getDeckKey('newkey'), JSON.stringify(newData));

// 4. Clear on deck delete
localStorage.removeItem(`newkey_${deckName}`);
```

### Code Patterns

#### Pattern: HTML Escaping
```javascript
// ALWAYS escape user input before innerHTML
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;')
                  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// Use it
element.innerHTML = `<span>${esc(userInput)}</span>`;
```

#### Pattern: Modal Management
```javascript
// Open modal
const openModal = () => {
  modal.style.display = 'block';
  // Focus first input if any
};

// Close modal
const closeModal = () => {
  modal.style.display = 'none';
  ans.focus(); // Always refocus answer input
};
```

#### Pattern: Deck-Specific Storage
```javascript
// Get key for current deck
const getDeckKey = (base) => `${base}_${currentDeck}`;

// Use it
localStorage.getItem(getDeckKey('fc'));     // 'fc_Spanish'
localStorage.getItem(getDeckKey('streak')); // 'streak_Spanish'
```

### Anti-Patterns

| Don't Do This | Do This Instead |
|---------------|-----------------|
| `innerHTML = userInput` | `innerHTML = esc(userInput)` |
| `element.textContent = '<b>text</b>'` | Use innerHTML for HTML, textContent for plain text |
| Store sensitive data in localStorage | Keep API keys server-side (or accept the risk) |
| Add console.log for production | Remove debug logs before committing |
| Use `var` | Use `let` or `const` |
| Create new files | Keep everything in index.html |
| Add npm dependencies | Use CDN or inline code |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `sessionCount`, `wrongWords` |
| Functions | camelCase | `initPool()`, `updateStreak()` |
| DOM IDs | camelCase | `editModal`, `btnSave` |
| CSS classes | kebab-case | `.menu-item`, `.btn-primary` |
| LocalStorage keys | snake_case with prefix | `fc_Spanish`, `streak_Default` |
| Constants | UPPER_CASE | Not used currently |

---

## Files

| File | Lines | Description |
|------|-------|-------------|
| `index.html` | ~900 | Complete application (HTML + CSS + JS) |
| `CLAUDE.md` | ~1400 | Documentation (this file) |

## External Dependencies

| Dependency | URL | Purpose |
|------------|-----|---------|
| ts-fsrs | `unpkg.com/ts-fsrs/dist/index.mjs` | FSRS spaced repetition algorithm |
| Inter font | `fonts.googleapis.com` | Typography |

## Browser Support

- Modern browsers with ES modules support
- LocalStorage required
- No IE support

---

## Technical Constraints

### Why These Choices Were Made

| Constraint | Reason |
|------------|--------|
| **Single HTML file** | Maximum portability, easy to share, no setup |
| **No build tools** | Removes complexity, no node_modules, instant development |
| **CDN dependencies only** | Avoids bundling, keeps file small, easy updates |
| **LocalStorage primary** | Works offline, no server needed, instant saves |
| **IndexedDB for audio** | LocalStorage has 5MB limit, audio blobs are large |
| **Dark theme only** | Reduces complexity, consistent experience |
| **ES modules** | Modern syntax, clean imports, no transpilation |

### Technical Limits

| Limit | Value | Impact |
|-------|-------|--------|
| LocalStorage size | ~5MB per origin | ~2000-5000 cards depending on content |
| IndexedDB size | ~50MB+ (varies by browser) | Thousands of cached audio files |
| Single file size | Currently ~900 lines | May need refactoring if >2000 lines |
| Session goal max | 100 cards | UI designed for this range |
| Deck name length | No enforced limit | Long names may break UI |

## Decision Log

Historical decisions and their reasoning (ADR-style).

### ADR-001: Single File Architecture
- **Date**: Project inception
- **Decision**: Keep everything in one HTML file
- **Context**: Need simple, portable flashcard app
- **Consequences**:
  - ✅ Easy to share (email, USB, etc.)
  - ✅ No build process
  - ✅ Works offline immediately
  - ❌ File gets long
  - ❌ No code splitting

### ADR-002: FSRS Algorithm
- **Date**: Project inception
- **Decision**: Use FSRS instead of SM-2 or custom algorithm
- **Context**: Need effective spaced repetition
- **Consequences**:
  - ✅ Modern, well-researched algorithm
  - ✅ Available as ES module via CDN
  - ✅ Better than SM-2 for retention
  - ❌ External dependency

### ADR-003: ElevenLabs TTS
- **Date**: 2026-01-17
- **Decision**: Use ElevenLabs API for text-to-speech
- **Context**: Web Speech API quality is poor
- **Consequences**:
  - ✅ High-quality pronunciation
  - ✅ Fallback to Web Speech API
  - ❌ Requires API key (exposed in client)
  - ❌ Costs money per character

### ADR-004: IndexedDB Audio Caching
- **Date**: 2026-01-18
- **Decision**: Cache ElevenLabs audio in IndexedDB
- **Context**: Reduce API costs and latency
- **Consequences**:
  - ✅ Only one API call per unique sentence
  - ✅ Instant playback for cached audio
  - ✅ Works offline for cached content
  - ❌ Storage grows over time
  - ❌ No cleanup mechanism yet

### ADR-005: Pool-Based Sessions
- **Date**: 2026-01-16
- **Decision**: Use pool system instead of random selection
- **Context**: Wrong cards weren't guaranteed to repeat
- **Consequences**:
  - ✅ Wrong cards definitely repeat
  - ✅ Clear session progress
  - ✅ Predictable session length
  - ❌ Slightly more complex code

## Trade-offs

Known compromises and why they were accepted.

| Trade-off | Choice Made | Alternative | Why |
|-----------|-------------|-------------|-----|
| **API key exposure** | Accept risk | Backend proxy | No server = no proxy. Users accept risk. |
| **No cloud sync** | Local only | Firebase/Supabase | Keeps app simple, respects privacy |
| **Dark mode only** | One theme | Theme toggle | Reduces code, consistent experience |
| **Type-answer only** | No multiple choice | Multiple question types | Simpler, typing is better for recall |
| **Manual card creation** | No imports from Anki | Import parsers | Keeps scope focused |
| **English TTS voice** | Single voice | Language detection | Simplicity, most users study English vocab |

## Performance Considerations

### What to Watch For

| Issue | Threshold | Mitigation |
|-------|-----------|------------|
| **Too many cards** | >2000 cards | May slow localStorage reads |
| **Large audio cache** | >100MB | No auto-cleanup, manual clear needed |
| **Long word lists** | >500 in stats | Virtual scrolling not implemented |
| **Deck switching** | Instant expected | All data reloaded from localStorage |

### Performance Tips

- Keep decks under 1000 cards each
- Export/backup regularly to avoid data loss
- Clear browser cache if audio cache grows too large
- Close other tabs if experiencing lag

---

## Future Planning

### Roadmap

> **Note**: This app follows a "no feature creep" policy. Features are only added when explicitly requested.

| Priority | Feature | Status |
|----------|---------|--------|
| - | No planned features | Stable |

### Ideas Backlog

Features that could be added if requested:

| Idea | Complexity | Notes |
|------|------------|-------|
| **Keyboard shortcuts** | Low | Speed up navigation |
| **Card tags/categories** | Medium | Filter cards by topic |
| **Study statistics graph** | Medium | Visual progress over time |
| **Reverse mode** | Low | Show word, type definition |
| **Audio recording** | High | Record pronunciation for comparison |
| **Anki import** | Medium | Parse .apkg files |
| **PWA support** | Low | Add manifest for install prompt |
| **Multiple voices** | Low | Select TTS voice per deck |

### Rejected Ideas

Features explicitly NOT wanted:

| Idea | Reason for Rejection |
|------|---------------------|
| **Cloud sync** | Requires accounts, servers, complexity |
| **User accounts** | Privacy concerns, unnecessary |
| **Gamification (XP, levels)** | Beyond streaks, adds bloat |
| **Leaderboards** | Social features out of scope |
| **AI-generated cards** | External dependency, cost |
| **Multiple choice mode** | Type-answer is more effective |
| **Themes/customization** | Dark mode only, keeps it simple |
| **Browser extension** | Separate project, different scope |
| **Mobile app** | Browser version works on mobile |

---

## Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Loading..." stuck | FSRS CDN failed | Check internet, refresh page |
| "No cards yet" | Empty deck | Add cards via gear menu → Add |
| "No cards due" | All caught up | Come back tomorrow, or add new cards |
| Cards not saving | LocalStorage full/disabled | Clear storage or enable cookies |
| TTS not playing | ElevenLabs API issue | Falls back to Web Speech API |
| Images not loading | Cross-origin restriction | Browser security, mostly harmless |
| Import failed | Invalid JSON | Check file format matches export |

### Browser Quirks

| Browser | Issue | Workaround |
|---------|-------|------------|
| **Safari** | IndexedDB in private mode | Use normal mode for audio caching |
| **Firefox** | Strict cross-origin for iframes | Images may not display |
| **Mobile Safari** | Audio autoplay restrictions | May need tap to hear TTS |
| **Brave** | Shields may block CDN | Whitelist site or disable shields |

### Debug Tips

```javascript
// Check localStorage data in browser console
JSON.parse(localStorage.getItem('fc_Default'))  // Cards
JSON.parse(localStorage.getItem('streak_Default'))  // Streak
JSON.parse(localStorage.getItem('decks'))  // All deck names

// Check IndexedDB (audio cache)
// Open DevTools → Application → IndexedDB → LingodashAudioCache

// Force reset session
pool = []; poolSize = 0; next();

// Clear all data for current deck (danger!)
localStorage.removeItem('fc_Default');
localStorage.removeItem('streak_Default');
localStorage.removeItem('session_Default');
location.reload();
```

### FAQ

**Q: How do I backup my cards?**
A: Gear menu → Settings → Export. Downloads a JSON file.

**Q: How do I restore from backup?**
A: Gear menu → Settings → Select file → Import.

**Q: Can I use this offline?**
A: Yes, except TTS and images need internet. Core study works offline.

**Q: Why does the streak reset?**
A: Missing 2+ days resets it. Missing 1 day uses a freeze if available.

**Q: How do I get more freezes?**
A: Earn +1 freeze every 7-day streak milestone (max 3).

**Q: Can I study multiple languages?**
A: Yes, create separate decks for each language.

**Q: Is my data private?**
A: Yes, everything stays in your browser's localStorage.

**Q: Why is TTS quality sometimes bad?**
A: ElevenLabs failed, fell back to browser's Web Speech API.

**Q: Can I change the TTS voice?**
A: Not currently. The voice is hardcoded.

**Q: How many cards can I have?**
A: Practically ~2000-5000 per deck before performance issues.

---

## Known Issues

> **Note**: These issues are documented for awareness. They are not critical blockers and can be fixed later if requested.

### Critical

| Issue | Description | Location |
|-------|-------------|----------|
| **Exposed API Key** | ElevenLabs API key is hardcoded in client-side JS. Anyone can view source and use it. | `index.html:553` |

### Missing Feature

| Issue | Description | Location |
|-------|-------------|----------|
| **Missing Images Menu Item** | Documentation lists "Images" menu option but it's not in HTML. `openImageSearchModal()` exists but has no trigger. | `index.html:95-101` |

### Logic Bugs

| Issue | Description | Location |
|-------|-------------|----------|
| **IndexedDB Init Race Condition** | `initAudioCache()` not awaited. If `speakText()` called immediately after page load, `audioCacheDB` may be null. | `index.html:262` |
| **Multiple Audio Playback** | Rapid Enter presses can cause multiple audio clips to overlap/play simultaneously. No cancellation of previous audio. | `index.html:529-592` |
| **Memory Leak Potential** | If audio playback fails or is interrupted, `URL.revokeObjectURL()` in `onended` callback never runs. | `index.html:539-542, 575-580` |

### Minor Issues

| Issue | Description | Impact |
|-------|-------------|--------|
| **No IndexedDB Cache Cleanup** | Cached audio blobs accumulate indefinitely. | Storage could grow large over time |
| **Hardcoded Voice ID** | ElevenLabs voice ID hardcoded. If deprecated, TTS breaks silently. | `index.html:548` |
| **Cross-Origin Iframe Warnings** | Bing image search iframes may encounter cross-origin restrictions in some browsers. | Console warnings, potential image display issues |
| **Regex Escaping Bug in Word Highlight** | Line 614 uses `esc(wordText)` instead of regex-escaped `wordPattern`. Words with `?`, `+`, `*`, etc. may cause regex errors. | `index.html:614` |
| **Duplicate Word Removal** | Pool filters by word string, not object reference. If two cards have same word, both are removed when one is answered correctly. | `index.html:600` |

### Why Not Fixed Yet

- **API Key**: Fixing requires either removing TTS, adding a backend proxy, or using environment variables (conflicts with "no build tools" policy)
- **Images Menu**: Quick fix but not prioritized
- **Race Conditions**: Edge cases that rarely occur in normal usage
- **Cache Cleanup**: Low priority - IndexedDB storage is generous
- **Regex Escaping**: Edge case - most vocabulary words don't contain regex special characters
- **Duplicate Word Removal**: Edge case - users rarely add duplicate words with different definitions

## Changelog

### 2026-01-18

#### Fixed: Session State Now Persists Across Page Refresh
- **What**: Session pool and progress now properly saved and restored on page refresh
- **Why**: Previously, session counters were restored but pool was always reinitialized, making restoration useless
- **Files changed**: `index.html` (saveSession function, pool restoration logic)
- **Affected areas**: Session persistence, page refresh behavior
- **Technical details**:
  - `saveSession()` now saves pool (as word list) and poolSize to localStorage
  - On page load, if today's session exists with saved pool, it's restored
  - Counters (sessionCount, wrongCount, wrongWords) now match the restored pool state
- **Old behavior**: Page refresh always started fresh session (counters restored but pool reset)
- **New behavior**: Page refresh continues where you left off within the same day

#### Fixed: Due Cards Now Shown Before New Cards
- **What**: Fixed bug where new cards appeared before due/overdue cards
- **Why**: Spaced repetition requires reviewing due cards first to prevent memory decay
- **Files changed**: `index.html` (initPool and next functions), `CLAUDE.md` (Session Lifecycle section)
- **Affected areas**: Card selection order, session flow
- **Technical details**:
  - `initPool()` now builds pool as: shuffled due cards + shuffled new cards
  - `next()` now picks `pool[0]` instead of random index
  - Due cards always appear before new cards within a session
- **Old behavior**: Random selection from entire pool (new cards could appear before due cards)
- **New behavior**: Due cards shown first (shuffled), then new cards (shuffled)

#### Major: Comprehensive Documentation Expansion
- **What**: Expanded CLAUDE.md from ~350 to ~1400 lines with 20+ new sections
- **Why**: Provide complete project documentation for maintainability and onboarding
- **Files changed**: `CLAUDE.md`
- **Affected areas**: Documentation only
- **New sections added**:
  - **Project Context**: Overview, Goals & Non-Goals, Target Users, Design Philosophy
  - **Technical Reference**: Architecture diagram, State Management, Event Flow, Z-Index Map, LocalStorage Schema
  - **Development Guide**: Quick Start, Testing Checklist, Common Tasks, Code Patterns, Anti-Patterns, Naming Conventions
  - **Constraints & Decisions**: Technical Constraints, Decision Log (ADRs), Trade-offs, Performance Considerations
  - **Future Planning**: Roadmap, Ideas Backlog, Rejected Ideas
  - **Troubleshooting**: Common Errors, Browser Quirks, Debug Tips, FAQ
  - **App-Specific Deep Dives**: FSRS Deep Dive, Deck Data Isolation, Audio System (TTS), Session Lifecycle

#### Added: Known Issues Documentation
- **What**: Added "Known Issues" section documenting 8 identified issues
- **Why**: Track awareness of issues without immediately fixing them
- **Files changed**: `CLAUDE.md` (new Known Issues section)
- **Affected areas**: Documentation only
- **Issues documented**:
  - Critical: Exposed ElevenLabs API key in client-side code
  - Missing: Images menu item (function exists but no UI trigger)
  - Logic: IndexedDB init race condition, multiple audio playback overlap, memory leak potential
  - Minor: No cache cleanup, hardcoded voice ID, cross-origin iframe warnings

#### Improved: File-Based Import/Export
- **What**: Changed import functionality from textarea paste to file selection for better UX
- **Why**: File selection is more user-friendly than copying/pasting large JSON strings
- **Files changed**: `index.html` (replaced textarea with file input, updated btnImport.onclick), `CLAUDE.md` (updated documentation)
- **Affected areas**: Settings modal import section, import user experience
- **Technical details**:
  - Replaced textarea with `<input type="file" accept=".json">`
  - Added async file reading with `file.text()`
  - Maintained same validation and import logic
  - Export functionality unchanged (still downloads JSON file)
- **New behavior**: Users click "Import" → select JSON file → click Import (no manual copy/paste needed)

#### Removed: Manual Import/Export Functionality
- **What**: Removed manual JSON import/export UI since data persists automatically in localStorage
- **Why**: Simplified user experience by eliminating manual backup/restore steps
- **Files changed**: `index.html` (removed import/export UI sections and JavaScript handlers), `CLAUDE.md` (updated documentation)
- **Affected areas**: Settings modal, data management UI
- **Technical details**:
  - Removed textarea for JSON import
  - Removed export download button
  - Kept automatic localStorage persistence
  - Removed btnImport.onclick and btnExport.onclick functions
- **New behavior**: Data saves automatically - no manual import/export needed

#### Added: IndexedDB Audio Caching for TTS
- **What**: Implemented local audio caching using IndexedDB to avoid repeated ElevenLabs API calls
- **Why**: Significant cost savings and performance improvement by caching generated audio locally
- **Files changed**: `index.html` (IndexedDB setup, cache functions, speakText function update), `CLAUDE.md` (TTS feature documentation)
- **Affected areas**: Text-to-speech functionality, local storage, API usage optimization
- **Technical details**:
  - IndexedDB database 'LingodashAudioCache' with 'audio' object store
  - Cache keys generated from text content + voice ID + model (hashed for shorter keys)
  - Check cache before API call, store successful responses
  - Graceful degradation if IndexedDB unavailable
  - Memory management with automatic object URL cleanup
- **Benefits**:
  - Only calls ElevenLabs API once per unique sentence
  - Instant playback for cached audio (no network latency)
  - Offline support for previously heard sentences
  - Significant reduction in API costs
  - Better user experience with faster response times

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
