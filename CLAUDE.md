# Flashcard App

Single-file flashcard application with SM-2 spaced repetition algorithm and multi-language support.

## File Structure

```
index.html                      # Complete application (HTML, CSS, JS)
CLAUDE.md                       # This documentation
flashcard-tts-extension/        # Chrome extension for TTS
├── manifest.json               # Extension configuration (Manifest V3)
├── background.js               # Service worker (Google Translate TTS)
├── content.js                  # Injected script for TTS controls
├── content.css                 # TTS button styling
├── popup.html                  # Extension popup UI
├── popup.js                    # Popup functionality
└── icons/                      # Extension icons (16, 48, 128px)
```

## Tech Stack

- Vanilla HTML5/CSS3/JavaScript (no frameworks)
- Browser LocalStorage for data persistence
- Responsive design with CSS Grid/Flexbox
- Single file architecture

---

## UI Layout

### Top Bar (Fixed Top-Right)
- **Due Count**: Number of cards due for review
- **Focus Button (☰/◧)**: Toggle sidebar visibility for distraction-free studying

### Session Info (Fixed Top-Left)
- **Progress**: "X/Y" showing cards studied in current session
- **Progress Bar**: Visual progress indicator
- **Mistake Badge**: Shows count of cards to re-review (appears during session)

### Study Panel (Main Area)

#### Welcome Page (shown before session starts)
- **Language Selector**: Choose which language to study
- **Cards to Study Input**: Set session size (1-500, default 20)
- **Start Button**: Begins study session (disabled if no cards due)

#### Study Interface (active during session)
- **Review Banner**: Yellow banner shown during mistake review mode
- **Sentence**: Cloze deletion format (word replaced with `___`)
- **Hint**: Definition with first letter in parentheses
- **Input Field**: Centered text input for answer
- **Feedback Message**: Shows prompts like "Press Enter to continue"
- **Study Actions**: Edit/Delete buttons for current card (hover to reveal)

### Sidebar Cards

| Card | Content |
|------|---------|
| **Language** | Current language name, card count, selector dropdown, add/rename buttons |
| **Stats** | Due Now, Learning, Mastered, Accuracy (per language) |
| **Streak** | Daily streak counter, progress bar, words studied today |
| **Data** | Export, Import, Clear All buttons |
| **Words** | Sortable list with edit/delete actions, "Add Card" button |

### Focus Mode
- Toggle with ☰ button (top-right)
- Hides sidebar for distraction-free studying
- State persisted in LocalStorage

### Image Panel (Bottom)
- Fixed bottom panel showing Bing image search results
- Auto-opens after answering (correct or wrong)
- Toggle with 🖼️ Images button or `I` key
- Links to open full Bing search in new tab
- State persisted in LocalStorage

---

## Study Session System

### Session Flow
1. **Welcome Screen**: Choose language and session size
2. **Study Phase**: Cards presented in random order
3. **Mistake Review**: Every 10 cards, review mistakes (if any)
4. **Session Complete**: Stats summary with option for new session

### Mistake Review Mode
- Cards answered incorrectly are queued for review
- Interleaved every 10 cards during session
- Final review round at session end if mistakes remain
- Review banner shown when in this mode

### Session Stats (Completion Screen)
- Cards Studied
- Correct Answers
- Accuracy Percentage
- Remaining cards still due

---

## Streak System

### Daily Goal
- Default: 50 words per day
- Progress bar shows completion percentage
- Streak increments when daily goal is reached

### Streak Rules
- Streak continues if you study every day
- Missing a day resets streak to 0
- Words count toward streak only on correct answers (not mistake reviews)

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

- Failed reviews (quality < 3) reset to L0 but preserve Easiness Factor
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
- **Add Language**: Click "+" button, enter name and code
- **Switch Language**: Use dropdown selector
- **Rename Language**: Click "✎" button
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
  n: 0,                    // Repetition count (learning stage 0-4+)
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

### Core Algorithm
| Function | Description |
|----------|-------------|
| `sm2(card, quality)` | Apply SM-2 algorithm, update interval/EF |
| `calculateQuality(user, correct, timeMs)` | Auto-rate answer quality 0-5 based on accuracy and speed |
| `levenshtein(a, b)` | String distance for typo detection |
| `show()` | Display next due card or appropriate state |
| `dueCards()` | Get cards ready for review (filtered by language) |

### Session Management
| Function | Description |
|----------|-------------|
| `startSession()` | Begin new study session |
| `returnToWelcome()` | End session, return to welcome page |
| `showSessionComplete()` | Display session summary stats |
| `checkInterleaveReview()` | Check if it's time for mistake review |

### Language
| Function | Description |
|----------|-------------|
| `renderLangSelect()` | Populate language dropdowns |
| `switchLang()` | Change active language |
| `addLang()` | Create new language set |
| `renameLang()` | Rename current language |
| `currentLangCards()` | Get cards for current language |

### Card Management
| Function | Description |
|----------|-------------|
| `openAddModal()` | Show add card modal |
| `validateAddForm()` | Check word exists in sentence, show preview |
| `saveCard()` | Add new or update existing card |
| `editCard(i)` | Load card from list into edit form |
| `editCurrentCard()` | Edit the card currently being studied |
| `saveEdit()` | Save changes to currently studied card |
| `delCard(i)` | Delete single card with confirmation |
| `deleteCurrentCard()` | Delete the card being studied |
| `clearWords()` | Clear current language or ALL cards |

### Data
| Function | Description |
|----------|-------------|
| `exp()` | Export current language to JSON file |
| `handleImport(input)` | Import cards from JSON file |
| `save()` | Persist cards to LocalStorage |
| `saveLangs()` | Persist languages to LocalStorage |

### UI
| Function | Description |
|----------|-------------|
| `updateStats()` | Refresh statistics display |
| `updateSessionUI()` | Update progress bar and mistake badge |
| `renderList()` | Render word list with sorting |
| `toggleFocus()` | Toggle distraction-free mode |
| `formatInterval(mins)` | Format minutes as "new", "5m", "2h", "3d" |
| `resetAll()` | Reset all cards to "new" state |

### Image Panel
| Function | Description |
|----------|-------------|
| `toggleImagePanel()` | Show/hide image panel |
| `loadBingImages(word)` | Load Bing image search for word |
| `openBingSearch()` | Open Bing search in new tab |

### Streak
| Function | Description |
|----------|-------------|
| `checkStreak()` | Verify/update streak status for today |
| `addWordsToStreak(count)` | Add words to daily count, check goal |
| `updateStreakUI()` | Refresh streak display elements |

---

## LocalStorage Keys

| Key | Content |
|-----|---------|
| `cards` | JSON array of all flashcards |
| `languages` | JSON array of language objects |
| `currentLang` | Currently selected language code |
| `focusMode` | Boolean for focus mode state |
| `imagePanelOpen` | Boolean for image panel state |
| `streakData` | JSON object with streak info (currentStreak, lastStudyDate, wordsStudiedToday) |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit answer OR proceed to next card |
| `Escape` | Close modals (Add/Edit/Image) |
| `I` | Toggle image panel (when not typing) |
| `S` | Speak current word (TTS extension) |
| `Shift + S` | Speak full sentence (TTS extension) |

### Answer Flow with Enter Key
1. Type answer → Press `Enter` → Feedback shown
2. If correct: Word highlighted green, "Press Enter to continue"
3. If wrong: Word highlighted red, "Press Enter to try again"
4. Press `Enter` again → Next card (or retry if wrong)

---

## JSON Export/Import Format

### Export Schema

```json
{
  "version": 1,
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "language": "English",
  "languageCode": "en",
  "cardCount": 50,
  "cards": [
    {
      "w": "apple",
      "d": "a round fruit",
      "s": "She ate the apple.",
      "lang": "en",
      "ef": 2.5,
      "n": 2,
      "int": 1440,
      "due": 1700000000000
    }
  ]
}
```

### Import Behavior
- Supports both object format `{cards: [...]}` and array format `[...]`
- Validates required fields (`w`, `s`, `d`)
- Duplicate cards (by word+lang) are replaced
- Imported cards retain their scheduling data

---

## Word List Sorting

| Option | Sort By |
|--------|---------|
| Due First | Review timestamp (earliest first) |
| A-Z | Word alphabetical |
| Hardest (EF) | Lowest easiness factor first |
| Stage | Lowest repetition count first |

---

## Study Flow

1. **Display**: Show sentence with `___` and hint
2. **Type**: User types answer
3. **Submit**: Press Enter, calculate quality based on accuracy and speed
4. **Evaluate**: Apply SM-2 algorithm, update card data
5. **Show Result**:
   - Correct: Word highlighted in green, image panel shows word images
   - Wrong: Word highlighted in red, shake animation, added to mistake queue, image panel shows word images
6. **Next**: Press Enter to continue to next card

---

## Clear Words Behavior

1. Click "Clear" → Shows confirmation dialog
2. **OK** → Deletes only current language cards
3. **Cancel** → Prompt to type "ALL" (uppercase)
4. Type "ALL" → Deletes ALL cards across all languages

---

## Visual Feedback

| State | Visual Indicator |
|-------|-----------------|
| Correct answer | Green highlighted word, gray input background, image panel opens |
| Wrong answer | Red highlighted word, light red input background, shake animation, image panel opens |
| Due cards | Orange status dot with glow |
| Mastered cards | Green status dot |
| New cards | Gray status dot |
| Mistake review | Yellow banner with "🔄 Mistake Review Mode" |
| Active streak | Animated flame emoji, orange progress bar |
| Goal reached | Green checkmark in streak progress text |

---

## TTS Chrome Extension

### Overview
Chrome extension that adds Text-to-Speech using Google Translate TTS. Auto-speaks the sentence after answering.

### Installation
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `flashcard-tts-extension` folder

### Supported URLs
- `https://lingoflash.netlify.app/*`
- `file:///*` (local files)
- `http://localhost/*`

### Features
- **Auto-speak sentence**: Speaks full sentence after correct/incorrect answer
- **Manual buttons**: Click to speak word or sentence
- **Speed control**: 0.5x to 2x (default: 1.3x)
- **Settings panel**: Toggle features on/off

### Keyboard Shortcuts (TTS)

| Key | Action |
|-----|--------|
| `S` | Speak current word |
| `Shift + S` | Speak full sentence |

### TTS Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Enable TTS | On | Master toggle |
| Auto-speak on answer | On | Speak automatically after answering |
| Speak sentence | On | Speak the full sentence |
| Speak word only | Off | Speak just the word (alternative) |
| Speed | 1.3x | Playback speed |

### How It Works
1. Content script detects when answer is revealed (`.ok` or `.no` class)
2. Reads sentence text from DOM
3. Sends to background script with language code
4. Background fetches audio from Google Translate TTS
5. Returns audio data URL for playback

### Extension Storage Keys

| Key | Content |
|-----|---------|
| `ttsEnabled` | Boolean for TTS on/off |
| `autoSpeak` | Boolean for auto-speak |
| `speakWord` | Boolean for word-only mode |
| `speakSentence` | Boolean for sentence mode |
| `speed` | Number for playback speed |
