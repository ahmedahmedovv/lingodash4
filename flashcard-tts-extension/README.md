# Flashcard TTS Chrome Extension

Text-to-Speech extension for the Flashcard app using Google Translate TTS.

## Features

- **Auto-speak**: Automatically speaks the word after you answer (correct or incorrect)
- **Manual speak**: Click the speaker button or press `S` to speak
- **Sentence speak**: Optionally speak the full sentence
- **Speed control**: Adjust playback speed from 0.5x to 2x
- **Multi-language**: Auto-detects language or uses the app's language setting

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `flashcard-tts-extension` folder
5. The extension icon should appear in your toolbar

## Usage

### With the Flashcard App

1. Open your flashcard app (`index.html`) in Chrome
2. The TTS controls will appear at the bottom of the study panel
3. Answer a flashcard - the word will be spoken automatically
4. Click the speaker buttons to manually speak word or sentence

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `S` | Speak the current word |
| `Shift + S` | Speak the full sentence |

### Settings

Click the gear icon (⚙️) in the TTS controls or the extension popup to access settings:

- **Enable TTS**: Turn TTS on/off
- **Auto-speak on answer**: Automatically speak when you answer
- **Speak word**: Speak the vocabulary word
- **Speak sentence**: Also speak the full sentence
- **Speed**: Adjust playback speed (0.5x - 2x)

## How It Works

The extension uses Google Translate's text-to-speech service:

1. Detects the language of the text
2. Requests audio from `translate.google.com/translate_tts`
3. Plays the audio in the browser

## Troubleshooting

### TTS not working?

- Make sure the extension is enabled in `chrome://extensions/`
- Refresh the flashcard app page
- Check that TTS is enabled in the extension settings

### Audio not playing?

- Check your system volume
- Try adjusting the speed setting
- The first request may take a moment to load

### Extension not loading?

- Make sure you selected the correct folder when loading unpacked
- Check for errors in `chrome://extensions/`

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
- Only activates on lingoflash.netlify.app, local files, and localhost
- Sends text to Google Translate for TTS only
- Stores settings locally in your browser
- Does not collect or transmit any personal data
