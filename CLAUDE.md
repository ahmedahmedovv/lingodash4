# Flashcard App

Minimal FSRS-based flashcard app for language learning. Single HTML file, no build process.

---

## STRICT POLICIES

**MANDATORY** for all changes:

| # | Policy |
|---|--------|
| 1 | **Single file only** - Everything in one HTML file |
| 2 | **No build tools** - No npm, webpack, or compilation |
| 3 | **Keep it short** - Concise code, simple solutions |
| 4 | **Minimal style** - Clean, minimal UI design |
| 5 | **No feature creep** - Only add explicitly requested features |
| 6 | **Test before commit** - Manually verify changes work |

## Stack

| Component | Technology |
|-----------|------------|
| Structure | Single HTML file |
| JavaScript | Vanilla JS with ES modules |
| Algorithm | FSRS via CDN (ts-fsrs) |
| Storage | LocalStorage + IndexedDB (audio cache) |
| TTS | ElevenLabs API with Web Speech fallback |

---

## Architecture

```
index.html
├── <style>     - Colors, layout, components
├── <body>      - Card, modals, menus
└── <script>    - FSRS, state, events, storage
        │
        ├── LocalStorage (cards, streaks, sessions)
        ├── IndexedDB (audio cache)
        └── External APIs (ts-fsrs, ElevenLabs, Bing images)
```

## Global State

| Variable | Purpose |
|----------|---------|
| `cards` | All flashcards for current deck |
| `cur` | Currently displayed card |
| `pool` | Cards remaining in session |
| `poolSize` | Initial session size |
| `currentDeck` | Active deck name |
| `decks` | List of all deck names |
| `streakData` | {count, date, freezes} |
| `sessionGoal` | Target cards per session |

## LocalStorage Keys

```javascript
// Global
localStorage.getItem('decks')        // '["Default","Spanish"]'
localStorage.getItem('currentDeck')  // 'Spanish'
localStorage.getItem('sessionGoal')  // '51'

// Per-deck (where <deck> is deck name)
localStorage.getItem('fc_<deck>')      // [{word, def, ex, card}...]
localStorage.getItem('streak_<deck>')  // {count, date, freezes}
localStorage.getItem('session_<deck>') // {count, wrong, words, date, pool, poolSize}
```

---

## Features

### Study Flow
- Type word to answer (case-insensitive)
- Correct = FSRS Good rating, Wrong = FSRS Again rating
- First letter hint shown after definition
- Example sentence with word hidden as `___`
- Green/red highlight after answer, shake on wrong

### Session System (Pool-Based)
- Pool created from due cards first, then new cards (both shuffled)
- Wrong cards stay in pool until answered correctly
- Session persists across page refresh (same day)
- Configurable goal: 10/25/51/100 cards

### Additional Features
- **TTS**: ElevenLabs with IndexedDB caching, Web Speech fallback
- **Images**: Automatic Bing image search after answer
- **Streaks**: Daily streak with freeze protection (earn +1 every 7 days, max 3)
- **Multi-deck**: Separate cards, streaks, sessions per deck
- **Stats**: Sort by due date, difficulty, stability, lapses, reviews, state
- **Import/Export**: CSV format (Word, Definition, Example)
- **Quick actions**: Edit/delete buttons on card hover

---

## Card Data Structure

```javascript
{
  word: "string",      // Required
  def: "string",       // Required
  ex: "string",        // Optional example sentence
  card: {              // FSRS state
    due: Date,
    stability: Number, // Memory strength in days
    difficulty: Number,// 0-10
    reps: Number,
    lapses: Number,
    state: Number      // 0=New, 1=Learning, 2=Review, 3=Relearning
  }
}
```

## CSV Format

```csv
Word,Definition,Example
hello,a greeting,"Hello, how are you?"
```

---

## Key Functions

| Function | Purpose |
|----------|---------|
| `save()` | Persist cards to LocalStorage |
| `due()` | Filter cards where due ≤ now |
| `initPool()` | Create shuffled pool (due first, then new) |
| `next()` | Show next card or session complete |
| `speakText(text)` | TTS with ElevenLabs + caching |
| `updateStreak()` | Increment streak if new day |
| `getDeckKey(base)` | Generate deck-specific storage key |
| `parseCSV(text)` | Parse CSV with quote handling |
| `escapeCSV(s)` | Escape string for CSV output |
| `esc(s)` | HTML escape for XSS protection |

## FSRS Rating

| Answer | Rating | Effect |
|--------|--------|--------|
| Correct | Good (3) | Stability increases |
| Wrong | Again (1) | Reset to relearning |

---

## UI Structure

### Main Page
```
┌─────────────────────────────────────┐
│ [Deck ▼]                   [⚙]     │
│  15/51    🔷 7d    ❄️ 2    🔥 5    │
│  ████████████░░░░░░░░░░░░░░░░░░░   │
│  ┌─────────────────────────────┐   │
│  │  The cat ___ on the mat.    │   │
│  └─────────────────────────────┘   │
│     to rest in a seated position (s)│
│  ┌─────────────────────────────┐   │
│  │  [answer input]             │   │
│  └─────────────────────────────┘   │
│            [✎] [🗑]                 │
└─────────────────────────────────────┘
```

### Modals
- **Edit**: Word, Definition, Example fields + Save/Delete
- **Stats**: Summary + sortable word list
- **Settings**: Deck management, Import/Export, Session goal, Clear all

### Color Palette (Dark Theme)
| Element | Hex |
|---------|-----|
| Background | #0f172a |
| Card | #1e293b |
| Text | #f8fafc |
| Accent/Focus | #60a5fa |
| Success | #22c55e |
| Error | #dc2626 |

---

## Development

### Quick Start
```bash
# Just open in browser - no build needed
open index.html
```

### Code Patterns

```javascript
// Always escape user input
element.innerHTML = `<span>${esc(userInput)}</span>`;

// Deck-specific storage
const getDeckKey = (base) => `${base}_${currentDeck}`;
localStorage.getItem(getDeckKey('fc')); // 'fc_Spanish'
```

### Testing Checklist
- [ ] Add/edit/delete card
- [ ] Answer correct/wrong, complete session
- [ ] Wrong cards repeat
- [ ] Streak increments on new day
- [ ] Create/switch/rename/delete deck
- [ ] Import/export CSV
- [ ] TTS plays, images appear
- [ ] Modals open/close, Escape key works

---

## Known Issues

| Issue | Description |
|-------|-------------|
| **Exposed API Key** | ElevenLabs key in client-side code |
| **No cache cleanup** | Audio blobs accumulate in IndexedDB |
| **Audio overlap** | Rapid Enter can play multiple clips |

---

## External Dependencies

| Dependency | Purpose |
|------------|---------|
| ts-fsrs (CDN) | Spaced repetition algorithm |
| ElevenLabs API | High-quality TTS |
| Google Fonts | Inter typography |
