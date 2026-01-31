# Flashcard App

Single-file flashcard application with SM-2 spaced repetition algorithm and multi-language support.

## File Structure

```
index.html    # Complete application (HTML, CSS, JS)
CLAUDE.md     # This documentation
```

## Tech Stack

- Vanilla HTML5/CSS3/JavaScript (no frameworks)
- Browser LocalStorage for data persistence
- Responsive design with CSS Grid/Flexbox
- Single file architecture

---

## UI Layout

### Top Bar
- **Due Count**: Number of cards due for review
- **Focus Button**: Toggle sidebar visibility

### Study Panel (Main Area)
- **Sentence**: Cloze deletion format (word replaced with `___`)
- **Hint**: Definition + first letter in parentheses
- **Input Field**: Centered text input for answer
- **Feedback**: Shows correct answer highlighted after submission

### Sidebar Cards

| Card | Content |
|------|---------|
| **Language** | Current language name, card count, selector dropdown, add/rename buttons |
| **Stats** | Due Now, Learning, Mastered, Accuracy (per language) |
| **Actions** | Add Card, Export, Import, Clear All buttons |
| **Words** | Sortable list with edit/delete actions |

### Focus Mode
- Toggle with ☰ button (top-right)
- Hides sidebar for distraction-free studying
- State persisted in LocalStorage

---

## SM-2 Spaced Repetition

### Auto-Calculated Quality (0-5)

| Quality | Condition |
|---------|-----------|
| 5 (Perfect) | Correct answer in < 3 seconds |
| 4 (Good) | Correct answer in 3-8 seconds |
| 3 (Struggled) | Correct answer in > 8 seconds |
| 2 (Typo) | Wrong, but ≥80% similar (Levenshtein) |
| 1 (Almost) | Wrong, ≥50% similar |
| 0 (Forgot) | Wrong, <50% similar |

### Learning Stages

| Stage | Interval | Label |
|-------|----------|-------|
| L0 | 1 minute | new |
| L1 | 10 minutes | L1 |
| L2 | 1 day | L2 |
| L3 | 6 days | L3 |
| M | interval × EF | M (Mastered) |

- Failed reviews reset to L0 but preserve Easiness Factor
- Maximum interval: 1 year (525,600 minutes)

### Easiness Factor (EF)

```
EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
```
- Minimum: 1.3
- Default: 2.5

---

## Multi-Language Support

### Language Management
- **Add Language**: Click "+ New", enter name and code
- **Switch Language**: Use dropdown selector
- **Rename Language**: Click "Rename" button
- **Card Count**: Shows cards for current language only

### Language Isolation
- Stats calculated per language
- Study mode shows only current language cards
- Word list filtered by language
- New cards tagged with current language
- Export includes only current language

---

## Data Structure

### Card Object

```javascript
{
  w: "apple",              // Word to learn
  s: "She ate the apple",  // Example sentence (contains word)
  d: "a round fruit",      // Definition/hint
  lang: "en",              // Language code
  int: 1,                  // Current interval (minutes)
  due: 1700000000000,      // Next review timestamp (ms)
  ef: 2.5,                 // Easiness Factor
  n: 0,                    // Repetition count (learning stage)
  reviews: 0,              // Total review count
  correct: 0,              // Correct answer count
  lastReview: "2024-...",  // ISO timestamp
  lastQuality: 4           // Last quality rating (0-5)
}
```

### Language Object

```javascript
{
  code: "en",      // Unique identifier
  name: "English"  // Display name
}
```

---

## Key Functions

### Core
| Function | Description |
|----------|-------------|
| `sm2(card, quality)` | Apply SM-2 algorithm, update interval/EF |
| `calculateQuality(user, correct, timeMs)` | Auto-rate answer quality 0-5 |
| `levenshtein(a, b)` | String distance for typo detection |
| `show()` | Display next due card or "All done" |
| `dueCards()` | Get cards ready for review (filtered by language) |

### Language
| Function | Description |
|----------|-------------|
| `renderLangSelect()` | Populate language dropdown |
| `switchLang()` | Change active language |
| `addLang()` | Create new language set |
| `renameLang()` | Rename current language |
| `currentLangCards()` | Get cards for current language |

### Card Management
| Function | Description |
|----------|-------------|
| `toggleAdd()` | Show/hide add card form |
| `validateCard()` | Check word exists in sentence, show preview |
| `saveCard()` | Add new or update existing card |
| `editCard(i)` | Load card into edit form |
| `delCard(i)` | Delete single card with confirmation |
| `clearWords()` | Clear current language or ALL cards |

### Data
| Function | Description |
|----------|-------------|
| `exp()` | Export current language to CSV |
| `parseCSV(text)` | Parse CSV with quoted fields |
| `save()` | Persist cards to LocalStorage |
| `saveLangs()` | Persist languages to LocalStorage |

### UI
| Function | Description |
|----------|-------------|
| `updateStats()` | Refresh statistics display |
| `renderList()` | Render word list with sorting |
| `toggleFocus()` | Toggle distraction-free mode |
| `formatInterval(mins)` | Format minutes as "new", "5m", "2h", "3d" |
| `resetAll()` | Reset all cards for restudy |

---

## LocalStorage Keys

| Key | Content |
|-----|---------|
| `cards` | JSON array of all flashcards |
| `languages` | JSON array of language objects |
| `currentLang` | Currently selected language code |
| `focusMode` | Boolean for focus mode state |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit answer |

---

## CSV Format

### Export/Import Schema

```csv
Word,Definition,Example,Language
"apple","a round fruit","She ate the apple.","en"
"banana","a yellow fruit","The monkey ate the banana.","en"
```

- Header row automatically skipped on import
- Quoted fields support commas and quotes
- Language column optional (defaults to current)
- Duplicate cards (by word+lang) are replaced on import

---

## Word List Sorting

| Option | Sort By |
|--------|---------|
| Due First | Review timestamp (earliest first) |
| A-Z | Word alphabetical |
| Hardest (EF) | Lowest easiness factor first |
| Learning Stage | Lowest repetition count first |

---

## Study Flow

1. **Display**: Show sentence with `___` and hint
2. **Type**: User types answer and presses Enter
3. **Evaluate**: Calculate quality based on accuracy and speed
4. **Apply SM-2**: Update interval, EF, due time
5. **Show Result**: Highlight correct answer (green/red)
6. **Next**: Auto-advance after 600ms (correct) or 1200ms (wrong)

When no cards due: Shows "All done" with "Study Again" button to reset all cards.

---

## Clear Words Behavior

1. Click "Clear All" → Shows confirmation dialog
2. **OK** → Deletes only current language cards
3. **Cancel** → Prompt to type "ALL" (uppercase)
4. Type "ALL" → Deletes ALL cards across all languages
