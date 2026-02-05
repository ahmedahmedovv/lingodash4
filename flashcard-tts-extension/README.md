# Flashcard TTS Chrome Extension

Text-to-Speech extension for the Flashcard app using Google Translate TTS with automatic fallback to Web Speech API.

## Features

- **Auto-speak**: Automatically speaks the word after you answer (correct or incorrect)
- **Manual speak**: Click the speaker button or press `S` to speak
- **Sentence speak**: Optionally speak the full sentence with `Shift + S`
- **Speed control**: Adjust playback speed from 0.5x to 2x
- **Multi-language**: Auto-detects language or uses the app's language setting
- **Smart fallback**: If Google Translate fails, automatically uses Web Speech API

## How It Works

The extension uses **two TTS engines**:

1. **Google Translate TTS** (Primary) - Better quality, natural-sounding voices
2. **Web Speech API** (Fallback) - Native browser TTS, works when Google is blocked

### Why the fallback?

Google Translate TTS sometimes blocks or rate-limits requests. When this happens, the extension automatically switches to your browser's built-in Web Speech API, so TTS always works.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `flashcard-tts-extension` folder
5. The extension icon should appear in your toolbar

## Usage

### With the Flashcard App

1. Open https://lingoflash.yds.today/ in Chrome (or your local `index.html`)
2. The extension activates automatically
3. Answer a flashcard - the word will be spoken automatically
4. Click the speaker buttons to manually speak word or sentence

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `S` | Speak the current word |
| `Shift + S` | Speak the full sentence |

### Settings

Click the extension icon to access settings:

- **Enable TTS**: Turn TTS on/off
- **Auto-speak on answer**: Automatically speak when you answer
- **Speak word**: Speak the vocabulary word
- **Speak sentence**: Also speak the full sentence
- **Speed**: Adjust playback speed (0.5x - 2x)

## Troubleshooting

### TTS not working?

1. Make sure the extension is enabled in `chrome://extensions/`
2. Refresh the flashcard app page
3. Check that TTS is enabled in the extension settings
4. Open browser console (F12) to see error messages

### "Using Web Speech API fallback" message?

This means Google Translate TTS is being blocked. The extension automatically falls back to your browser's built-in TTS. This is normal and TTS will still work.

### Audio not playing?

- Check your system volume
- Try adjusting the speed setting
- Check browser console for errors
- Make sure your browser supports the language

### Extension not loading?

- Make sure you selected the correct folder when loading unpacked
- Check for errors in `chrome://extensions/`
- Try reloading the extension
- Make sure you're on https://lingoflash.yds.today/ (not http)

## Files

```
flashcard-tts-extension/
├── manifest.json     # Extension configuration
├── background.js     # Service worker (TTS requests)
├── content.js        # Injected into flashcard app
├── content.css       # Styling for TTS controls
├── popup.html        # Extension popup UI
├── popup.js          # Popup functionality
├── icons/            # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # This file
```

## Privacy

This extension:
- Only activates on lingoflash.yds.today, lingoflash.netlify.app, local files, and localhost
- Sends text to Google Translate for TTS only
- Stores settings locally in your browser
- Does not collect or transmit any personal data

## Technical Notes

### Google Translate TTS Endpoint

The extension uses: `https://translate.google.com/translate_tts`

This endpoint may:
- Have rate limits (too many requests = temporary block)
- Block requests without proper headers
- Change without notice

When Google fails, the extension **automatically switches** to Web Speech API.

### Web Speech API Support

Supported in:
- Chrome/Edge (best)
- Safari
- Firefox (limited)

Language support depends on your operating system and installed voices.

## Updates

### v1.1.0
- Added automatic fallback to Web Speech API when Google fails
- Improved error handling
- Better language detection

### v1.0.0
- Initial release
- Google Translate TTS support
- Auto-speak and manual speak
- Speed control
