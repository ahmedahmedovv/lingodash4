/**
 * Flashcard TTS Extension - Popup Script
 * Handles settings and TTS controls in the extension popup
 */

// DOM elements
const elements = {
  ttsEnabled: document.getElementById('ttsEnabled'),
  autoSpeak: document.getElementById('autoSpeak'),
  speakWord: document.getElementById('speakWord'),
  speakSentence: document.getElementById('speakSentence'),
  speed: document.getElementById('speed'),
  speedValue: document.getElementById('speedValue'),
  status: document.getElementById('status'),
  ttsControls: document.getElementById('ttsControls'),
  speakWordBtn: document.getElementById('speakWordBtn'),
  speakSentenceBtn: document.getElementById('speakSentenceBtn')
};

let currentTab = null;
let isSpeaking = false;

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
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'settingsChanged', settings });
    }
  } catch (e) {
    console.log('Could not save settings');
  }
}

// Check if flashcard app is open in current tab
async function checkStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    if (tab && tab.url) {
      const isFlashcardApp =
        tab.url.includes('file://') ||
        tab.url.includes('localhost') ||
        tab.url.includes('127.0.0.1') ||
        tab.url.includes('lingoflash.netlify.app') ||
        tab.url.includes('lingoflash.yds.today');

      if (isFlashcardApp) {
        elements.status.textContent = 'TTS Ready (Google + Fallback)';
        elements.status.classList.add('active');
        elements.ttsControls.style.display = 'block';
      } else {
        elements.status.textContent = 'Open flashcard app to use TTS';
        elements.status.classList.remove('active');
        elements.ttsControls.style.display = 'none';
      }
    }
  } catch (e) {
    console.log('Could not check status');
  }
}

// Send TTS message to content script
async function sendSpeakMessage(type) {
  if (!currentTab) return;

  try {
    // If already speaking, stop it
    if (isSpeaking) {
      await chrome.tabs.sendMessage(currentTab.id, { action: 'stopSpeaking' });
      updateSpeakingState(false);
      return;
    }

    updateSpeakingState(true, type);

    const response = await chrome.tabs.sendMessage(currentTab.id, { 
      action: 'speakFromPopup', 
      type: type 
    });

    // If speak finished or failed
    setTimeout(() => {
      updateSpeakingState(false);
    }, response && response.duration ? response.duration * 1000 : 5000);

  } catch (e) {
    console.log('Could not send speak message:', e);
    updateSpeakingState(false);
  }
}

// Update UI when speaking
function updateSpeakingState(speaking, type = null) {
  isSpeaking = speaking;

  elements.speakWordBtn.classList.toggle('speaking', speaking && type === 'word');
  elements.speakSentenceBtn.classList.toggle('speaking', speaking && type === 'sentence');

  // Change icon to stop when speaking
  const icon = speaking ? '⏹' : '🔊';
  if (speaking && type === 'word') {
    elements.speakWordBtn.querySelector('.icon').textContent = icon;
  } else if (speaking && type === 'sentence') {
    elements.speakSentenceBtn.querySelector('.icon').textContent = icon;
  } else {
    elements.speakWordBtn.querySelector('.icon').textContent = '🔊';
    elements.speakSentenceBtn.querySelector('.icon').textContent = '🔊';
  }
}

// Event listeners for settings
elements.ttsEnabled.addEventListener('change', saveSettings);
elements.autoSpeak.addEventListener('change', saveSettings);
elements.speakWord.addEventListener('change', saveSettings);
elements.speakSentence.addEventListener('change', saveSettings);

elements.speed.addEventListener('input', () => {
  elements.speedValue.textContent = parseFloat(elements.speed.value).toFixed(1) + 'x';
});

elements.speed.addEventListener('change', saveSettings);

// TTS button event listeners
elements.speakWordBtn.addEventListener('click', () => sendSpeakMessage('word'));
elements.speakSentenceBtn.addEventListener('click', () => sendSpeakMessage('sentence'));

// Listen for messages from content script (speaking finished)
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'speakingFinished') {
    updateSpeakingState(false);
  }
});

// Initialize
loadSettings();
checkStatus();
