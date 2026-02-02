/**
 * Flashcard TTS Extension - Popup Script
 * Handles settings in the extension popup
 */

// DOM elements
const elements = {
  ttsEnabled: document.getElementById('ttsEnabled'),
  autoSpeak: document.getElementById('autoSpeak'),
  speakWord: document.getElementById('speakWord'),
  speakSentence: document.getElementById('speakSentence'),
  speed: document.getElementById('speed'),
  speedValue: document.getElementById('speedValue'),
  status: document.getElementById('status')
};

// Load settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get([
      'ttsEnabled',
      'autoSpeak',
      'speakWord',
      'speakSentence',
      'speed'
    ]);

    elements.ttsEnabled.checked = result.ttsEnabled !== false;
    elements.autoSpeak.checked = result.autoSpeak !== false;
    elements.speakSentence.checked = result.speakSentence !== false;
    elements.speakWord.checked = result.speakWord || false;
    elements.speed.value = result.speed || 1.3;
    elements.speedValue.textContent = (result.speed || 1.3).toFixed(1) + 'x';
  } catch (e) {
    console.log('Could not load settings');
  }
}

// Save settings to storage
async function saveSettings() {
  const settings = {
    ttsEnabled: elements.ttsEnabled.checked,
    autoSpeak: elements.autoSpeak.checked,
    speakWord: elements.speakWord.checked,
    speakSentence: elements.speakSentence.checked,
    speed: parseFloat(elements.speed.value)
  };

  try {
    await chrome.storage.local.set(settings);

    // Notify content script of settings change
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'settingsChanged', settings });
    }
  } catch (e) {
    console.log('Could not save settings');
  }
}

// Check if flashcard app is open in current tab
async function checkStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const isFlashcardApp =
        tab.url.includes('file://') ||
        tab.url.includes('localhost') ||
        tab.url.includes('127.0.0.1') ||
        tab.url.includes('lingoflash.netlify.app');

      if (isFlashcardApp) {
        elements.status.textContent = 'TTS Ready';
        elements.status.classList.add('active');
      } else {
        elements.status.textContent = 'Open flashcard app to use TTS';
        elements.status.classList.remove('active');
      }
    }
  } catch (e) {
    console.log('Could not check status');
  }
}

// Event listeners
elements.ttsEnabled.addEventListener('change', saveSettings);
elements.autoSpeak.addEventListener('change', saveSettings);
elements.speakWord.addEventListener('change', saveSettings);
elements.speakSentence.addEventListener('change', saveSettings);

elements.speed.addEventListener('input', () => {
  elements.speedValue.textContent = parseFloat(elements.speed.value).toFixed(1) + 'x';
});

elements.speed.addEventListener('change', saveSettings);

// Initialize
loadSettings();
checkStatus();
