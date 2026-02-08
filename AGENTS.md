# LingoFlash - AI Agent Documentation

## Project Overview

LingoFlash is a **single-file flashcard application** for vocabulary learning using the SM-2 spaced repetition algorithm. It supports multiple languages and includes a Chrome extension for Text-to-Speech (TTS) functionality.

**Key Characteristics:**
- Zero-dependency vanilla JavaScript (no frameworks, no build tools)
- Single-file architecture: all HTML, CSS, and JavaScript in `index.html`
- Browser LocalStorage for data persistence
- Responsive design with warm cream/sage green color palette
- Deployed to Netlify at `lingoflash.netlify.app` (also `lingoflash.yds.today`)

---

## File Structure

```
lingoflash/
├── index.html                    # Complete application (~2800 lines, HTML+CSS+JS)
├── color-palette.css             # CSS custom properties (warm cream theme)
├── data.json                     # Sample English vocabulary (61 cards)
├── CLAUDE.md                     # Detailed feature documentation (human-oriented)
├── AGENTS.md                     # This file (AI-oriented)
├── firebase-debug.log            # Deployment artifact (can be ignored)
└── flashcard-tts-extension/      # Chrome Extension for TTS
    ├── manifest.json             # Extension manifest (Manifest V3)
    ├── background.js             # Service worker (Google Translate TTS)
    ├── content.js                # Injected into flashcard app
    ├── content.css               # Hides old TTS button styles
    ├── popup.html                # Extension popup UI
    ├── popup.js                  # Popup functionality
    ├── README.md                 # Extension documentation
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla HTML5, CSS3, ES6+ JavaScript |
| State Management | In-memory + LocalStorage persistence |
| Styling | CSS Custom Properties, Grid, Flexbox |
| Data Format | JSON (cards, languages, export/import) |
| TTS Engine | Google Translate TTS (primary) + Web Speech API (fallback) |
| Extension | Chrome Manifest V3 |

**No Build Process**: This is a static site. Simply open `index.html` in a browser or serve with any static file server.

---

## Architecture

### Core Data Models

**Card Object:**
```javascript
{
  w: "apple",              // Word to learn (string)
  s: "She ate the apple",  // Example sentence (string, must contain word)
  d: "a round fruit",      // Definition/hint (string)
  lang: "en",              // Language code (string)
  int: 1,                  // Current interval in minutes (number)
  due: 1700000000000,      // Next review timestamp (ms since epoch)
  ef: 2.5,                 // Easiness Factor (number, min 1.3)
  n: 0,                    // Repetition count/stage (0-4+)
  reviews: 0,              // Total review count (number)
  correct: 0,              // Correct answer count (number)
  lastReview: "2024-...",  // ISO timestamp (string)
  lastQuality: 4,          // Last quality rating 0-5 (number)
  addedAt: 1700000000000   // Creation timestamp (number)
}
```

**Language Object:**
```javascript
{
  code: "en",      // Unique identifier (string)
  name: "English"  // Display name (string)
}
```

### LocalStorage Keys

| Key | Content |
|-----|---------|
| `cards` | JSON array of all flashcards |
| `languages` | JSON array of language objects |
| `currentLang` | Currently selected language code |
| `focusMode` | Boolean for focus mode state |
| `imagePanelOpen` | Boolean for image panel state |
| `dailyProgress` | Daily study tracking object |
| `lastStudyDate` | ISO date string for streak tracking |

### SM-2 Algorithm Implementation

The spaced repetition scheduling uses the SM-2 algorithm:

**Quality Calculation (0-5):**
- 5 = Perfect, fast (< 3 seconds)
- 4 = Perfect, normal (3-8 seconds)  
- 3 = Perfect, slow (> 8 seconds)
- 2 = Minor typo (≥80% similarity via Levenshtein)
- 1 = Major mistake (≥50% similarity)
- 0 = Complete miss (<50% similarity)

**Intervals (minutes):**
- n=0 (new): 1 minute
- n=1: 10 minutes
- n=2: 1 day (1440 min)
- n=3: 6 days (8640 min)
- n≥4: interval × EF (capped at 1 year)

**EF Update Formula:**
```
EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
```

---

## Key Functions Reference

### Core Study Functions
| Function | Description |
|----------|-------------|
| `show()` | Display next due card or completion screen |
| `dueCards()` | Get cards ready for review (filtered by language) |
| `sm2(card, quality)` | Apply SM-2 algorithm, update interval/EF |
| `calculateQuality(user, correct, timeMs)` | Auto-rate answer quality |
| `levenshtein(a, b)` | String distance for typo detection |

### Session Management
| Function | Description |
|----------|-------------|
| `startStudying()` | Begin new study session |
| `returnToWelcome()` | End session, return to welcome page |
| `showStudyComplete()` | Display completion screen |
| `showDailyGoalComplete()` | Show daily goal reached screen |

### Card Management
| Function | Description |
|----------|-------------|
| `openAddModal()` | Show add card modal |
| `saveCard()` | Add new or update existing card |
| `editCard(i)` | Load card from list into edit form |
| `editCurrentCard()` | Edit the card currently being studied |
| `delCard(i)` | Delete single card with confirmation |
| `clearWords()` | Clear current language or ALL cards |

### Data Operations
| Function | Description |
|----------|-------------|
| `exp()` | Export current language to JSON file |
| `handleImport(input)` | Import cards from JSON file |
| `save()` | Persist cards to LocalStorage |
| `saveLangs()` | Persist languages to LocalStorage |

### UI Functions
| Function | Description |
|----------|-------------|
| `renderList()` | Render word list with sorting/filtering |
| `updateStats()` | Refresh statistics display |
| `toggleFocus()` | Toggle distraction-free mode |
| `toggleImagePanel()` | Show/hide image panel |
| `loadBingImages(word)` | Load Bing image search |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit answer OR proceed to next card |
| `Escape` | Close modals OR finish studying (if goal reached) |
| `S` | Speak current word (TTS extension) |
| `Shift + S` | Speak full sentence (TTS extension) |
| `I` | Toggle image panel (when not typing) |

---

## Development Guidelines

### Code Style

1. **Single File Architecture**: All code lives in `index.html`. CSS is in `<style>` tags, JS in `<script>` tags.

2. **Naming Conventions**:
   - Functions: camelCase (`updateStats`, `saveCard`)
   - DOM elements: cached in constants at top of script
   - CSS classes: kebab-case (`.study-panel`, `.word-item`)

3. **CSS Organization**:
   - CSS variables defined in `color-palette.css`
   - Component-based organization in `index.html` style section
   - Uses elevation system (0-4) for depth hierarchy

4. **State Management**:
   - Global variables for current state (`cards`, `cur`, `isStudying`)
   - Immediate LocalStorage persistence on changes
   - No async state management needed

### Making Changes

1. **Always update both UI and data**: When modifying card structure, ensure `save()` persists correctly.

2. **Test LocalStorage migration**: If changing data models, add migration code to handle old data formats.

3. **Maintain accessibility**: Use proper focus states, ARIA labels where needed.

4. **Color changes**: Modify `color-palette.css` CSS variables, not individual elements.

5. **Keep it simple**: Avoid adding build tools or frameworks. The single-file constraint is intentional.

### Testing Checklist

When making changes, verify:
- [ ] Cards save/load correctly from LocalStorage
- [ ] SM-2 algorithm calculates intervals correctly
- [ ] Import/Export works with existing JSON files
- [ ] Language switching preserves data isolation
- [ ] TTS extension still detects words correctly
- [ ] Image panel loads Bing search results
- [ ] Focus mode toggles correctly
- [ ] Daily progress tracks across sessions

---

## Chrome Extension Development

### Extension Architecture

The TTS extension uses Manifest V3 with these components:

1. **background.js**: Service worker handling Google Translate TTS requests
2. **content.js**: Injected script that detects answers and triggers speech
3. **popup.html/js**: Settings UI for TTS configuration

### Extension Permissions

```json
{
  "permissions": ["activeTab", "storage"],
  "host_permissions": [
    "file:///*",
    "http://localhost/*",
    "https://lingoflash.netlify.app/*",
    "https://lingoflash.yds.today/*",
    "https://translate.googleapis.com/*",
    "https://translate.google.com/*"
  ]
}
```

### Extension Settings

Stored in `chrome.storage.local`:
- `ttsEnabled`: Master toggle (default: true)
- `autoSpeak`: Auto-speak on answer (default: true)
- `speakWord`: Speak just the word (default: false)
- `speakSentence`: Speak full sentence (default: true)
- `speed`: Playback speed 0.5-2.0 (default: 1.3)

### Extension Communication Flow

1. Content script detects answer reveal (via DOM mutation observer)
2. Sends `speak` message to background script
3. Background fetches audio from Google Translate TTS
4. Returns data URL to content script for playback
5. On failure, automatically falls back to Web Speech API

---

## Deployment

### Static Hosting

The app can be deployed to any static hosting service:
- Netlify (primary): `lingoflash.netlify.app`
- Firebase Hosting (configured but may not be primary)
- GitHub Pages
- Any CDN serving static files

### No Build Required

Simply upload `index.html`, `color-palette.css`, and optionally `data.json`.

### Extension Distribution

To distribute the TTS extension:
1. Zip the `flashcard-tts-extension/` folder
2. Upload to Chrome Web Store Developer Dashboard
3. Or users can load unpacked in `chrome://extensions/`

---

## Common Tasks

### Adding a New Sorting Option

1. Add `<option>` to `#sortSelect` in HTML
2. Add sorting logic in `renderList()` function
3. Update this documentation

### Adding a New Keyboard Shortcut

1. Add handler in `document.onkeydown` for global shortcuts
2. Add handler in `answer.onkeydown` for input-specific shortcuts
3. Update Keyboard Shortcuts section in this file

### Modifying the Color Scheme

1. Edit CSS variables in `color-palette.css`
2. The app uses a warm cream palette with sage green accents
3. Dark mode styles are commented out (can be enabled)

### Adding Card Fields

1. Update Card Object documentation above
2. Add input fields to Add/Edit modals in HTML
3. Update `saveCard()` and `saveEdit()` functions
4. Ensure backward compatibility with existing LocalStorage data

---

## Troubleshooting

### LocalStorage Issues
- Data is browser-specific (not synced across devices)
- Private browsing may prevent LocalStorage persistence
- Maximum storage: ~5MB (sufficient for thousands of cards)

### TTS Not Working
- Check extension is enabled in `chrome://extensions/`
- Verify host permissions include current URL
- Check browser console for CORS errors (Google Translate may block)
- Extension automatically falls back to Web Speech API

### Import/Export Issues
- Export format: JSON with metadata wrapper or raw array
- Duplicates detected by `w` (word) + `lang` combination
- Invalid cards (missing required fields) are filtered out

---

## Security Considerations

1. **XSS Prevention**: User input is displayed via `textContent` (safe) not `innerHTML` (except for sentence highlighting which uses controlled replacement)

2. **No Server-Side**: All data stays client-side in LocalStorage

3. **Extension Privacy**: TTS extension only activates on known URLs, sends text only to Google Translate

4. **CSP**: No Content Security Policy currently implemented (static file)

---

## Related Files

- `CLAUDE.md` - Detailed feature documentation (human-oriented)
- `flashcard-tts-extension/README.md` - Extension-specific docs
- `data.json` - Example card data format

---

*Last updated: 2026-02-08*
*Project: LingoFlash - Spaced Repetition Flashcards*
*Maintainer: AI Agent (via AGENTS.md conventions)*
