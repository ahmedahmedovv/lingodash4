/**
 * Flashcard TTS Extension - Background Service Worker
 *
 * Handles text-to-speech requests using Google Translate's TTS endpoint.
 * The flow:
 * 1. Content script sends 'speak' message with text and language
 * 2. Background detects language if not provided
 * 3. Fetches audio from Google Translate TTS
 * 4. Returns audio data URL to content script for playback
 */

// Language detection using Google Translate API
async function detectLanguage(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    // The detected language is in data[2]
    return data[2] || 'en';
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en'; // Default to English
  }
}

// Get TTS audio URL from Google Translate
function getTTSUrl(text, lang) {
  // Google Translate TTS endpoint
  // textlen parameter helps with longer text
  const encodedText = encodeURIComponent(text);
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob&ttsspeed=1`;
}

// Fetch audio as base64 data URL
async function fetchAudioAsDataUrl(text, lang) {
  const url = getTTSUrl(text, lang);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('TTS fetch failed:', error);
    throw error;
  }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'speak') {
    const { text, lang } = request;

    (async () => {
      try {
        // Detect language if not provided
        const detectedLang = lang || await detectLanguage(text);

        // Get audio data URL
        const audioDataUrl = await fetchAudioAsDataUrl(text, detectedLang);

        sendResponse({
          success: true,
          audioUrl: audioDataUrl,
          detectedLang
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message
        });
      }
    })();

    // Return true to indicate async response
    return true;
  }

  if (request.action === 'detectLanguage') {
    detectLanguage(request.text).then(lang => {
      sendResponse({ lang });
    });
    return true;
  }

  if (request.action === 'getSettings') {
    chrome.storage.local.get(['ttsEnabled', 'autoSpeak', 'speakWord', 'speakSentence', 'speed'], (result) => {
      sendResponse({
        ttsEnabled: result.ttsEnabled !== false,
        autoSpeak: result.autoSpeak !== false,
        speakWord: result.speakWord || false,
        speakSentence: result.speakSentence !== false,
        speed: result.speed || 1.3
      });
    });
    return true;
  }

  if (request.action === 'saveSettings') {
    chrome.storage.local.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Log when extension is loaded
console.log('Flashcard TTS Extension loaded');
