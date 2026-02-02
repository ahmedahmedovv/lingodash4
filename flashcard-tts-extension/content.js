/**
 * Flashcard TTS Extension - Content Script
 *
 * Injects TTS functionality into the flashcard app:
 * - Adds speaker buttons to speak words/sentences
 * - Auto-speaks after correct/incorrect answers
 * - Keyboard shortcut (S key) to speak current word
 */

// TTS Service class using Google Translate
class SpeechService {
  constructor() {
    this.audio = new Audio();
    this.speaking = false;
    this.settings = {
      ttsEnabled: true,
      autoSpeak: true,
      speakWord: false,
      speakSentence: true,
      speed: 1.3
    };
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response) {
        this.settings = { ...this.settings, ...response };
      }
    } catch (e) {
      console.log('Could not load settings, using defaults');
    }
  }

  async speak(text, lang = null) {
    if (!this.settings.ttsEnabled || !text || this.speaking) return;

    try {
      this.speaking = true;
      this.updateButtonState(true);

      // Request TTS from background script
      const response = await chrome.runtime.sendMessage({
        action: 'speak',
        text: text.trim(),
        lang
      });

      if (response.success) {
        this.audio.src = response.audioUrl;
        this.audio.playbackRate = this.settings.speed;

        await this.audio.play();

        // Wait for audio to finish
        await new Promise(resolve => {
          this.audio.onended = resolve;
          this.audio.onerror = resolve;
        });
      } else {
        console.error('TTS failed:', response.error);
      }
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      this.speaking = false;
      this.updateButtonState(false);
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.speaking = false;
    this.updateButtonState(false);
  }

  updateButtonState(speaking) {
    const buttons = document.querySelectorAll('.tts-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('speaking', speaking);
    });
  }
}

// Initialize speech service
const speechService = new SpeechService();

// Get current word from the flashcard app
function getCurrentWord() {
  // Look for the highlighted word after answer (green=correct, red=wrong)
  const okSpan = document.querySelector('.sentence .ok');
  if (okSpan) return okSpan.textContent.trim();

  const noSpan = document.querySelector('.sentence .no');
  if (noSpan) return noSpan.textContent.trim();

  return null;
}

// Get current sentence
function getCurrentSentence() {
  const sentenceEl = document.querySelector('.sentence');
  if (!sentenceEl) return null;

  // Get the text content - when answered, the word is revealed
  const text = sentenceEl.textContent.trim();

  // If still has blanks, not ready
  if (text.includes('___')) return null;

  // Return the full sentence text
  return text;
}

// Get language code from the app
function getCurrentLanguage() {
  // Get from select element in sidebar
  const langSelect = document.getElementById('langSelect');
  if (langSelect) return langSelect.value;

  // Try welcome page select
  const welcomeLangSelect = document.getElementById('welcomeLangSelect');
  if (welcomeLangSelect) return welcomeLangSelect.value;

  return null; // Let Google auto-detect
}

// Create TTS button element
function createTTSButton(type = 'word') {
  const btn = document.createElement('button');
  btn.className = 'tts-btn tts-btn-' + type;
  btn.title = type === 'word' ? 'Speak word (S)' : 'Speak sentence';

  const icon = document.createElement('span');
  icon.className = 'tts-icon';
  icon.textContent = '\uD83D\uDD0A'; // Speaker emoji
  btn.appendChild(icon);

  btn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (speechService.speaking) {
      speechService.stop();
      return;
    }

    const text = type === 'word' ? getCurrentWord() : getCurrentSentence();
    const lang = getCurrentLanguage();

    if (text) {
      await speechService.speak(text, lang);
    }
  };

  return btn;
}

// Inject TTS buttons into the study panel
function injectTTSButtons() {
  const studyPanel = document.getElementById('studyPanel');
  if (!studyPanel) return;

  // Check if already injected
  if (document.querySelector('.tts-controls')) return;

  // Create TTS controls container
  const controls = document.createElement('div');
  controls.className = 'tts-controls';

  // Word speak button
  const wordBtn = createTTSButton('word');
  controls.appendChild(wordBtn);

  // Sentence speak button
  const sentBtn = createTTSButton('sentence');
  const sentLabel = document.createElement('span');
  sentLabel.className = 'tts-label';
  sentLabel.textContent = 'Sentence';
  sentBtn.appendChild(sentLabel);
  controls.appendChild(sentBtn);

  // Settings toggle
  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'tts-btn tts-btn-settings';
  settingsBtn.title = 'TTS Settings';
  settingsBtn.textContent = '\u2699\uFE0F'; // Gear emoji
  settingsBtn.onclick = toggleSettingsPanel;
  controls.appendChild(settingsBtn);

  // Insert into study panel
  const studyActions = document.querySelector('.study-actions');
  if (studyActions) {
    studyActions.parentNode.insertBefore(controls, studyActions);
  } else {
    studyPanel.appendChild(controls);
  }

  // Create settings panel
  createSettingsPanel();
}

// Create settings panel using DOM methods
function createSettingsPanel() {
  if (document.querySelector('.tts-settings-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'tts-settings-panel';

  // Header
  const header = document.createElement('div');
  header.className = 'tts-settings-header';

  const headerTitle = document.createElement('span');
  headerTitle.textContent = 'TTS Settings';
  header.appendChild(headerTitle);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'tts-settings-close';
  closeBtn.textContent = '\u00D7';
  closeBtn.onclick = () => panel.classList.remove('show');
  header.appendChild(closeBtn);

  panel.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.className = 'tts-settings-body';

  // Create checkbox items
  const checkboxes = [
    { id: 'ttsEnabled', label: 'Enable TTS', checked: true },
    { id: 'ttsAutoSpeak', label: 'Auto-speak on answer', checked: true },
    { id: 'ttsSpeakSentence', label: 'Speak sentence', checked: true },
    { id: 'ttsSpeakWord', label: 'Speak word only', checked: false }
  ];

  checkboxes.forEach(item => {
    const label = document.createElement('label');
    label.className = 'tts-checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = item.id;
    input.checked = item.checked;
    input.addEventListener('change', saveSettingsFromPanel);
    label.appendChild(input);

    const span = document.createElement('span');
    span.textContent = item.label;
    label.appendChild(span);

    body.appendChild(label);
  });

  // Speed control
  const speedDiv = document.createElement('div');
  speedDiv.className = 'tts-speed';

  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Speed: ';
  const speedValue = document.createElement('span');
  speedValue.id = 'speedValue';
  speedValue.textContent = '1.3';
  speedLabel.appendChild(speedValue);
  speedLabel.appendChild(document.createTextNode('x'));
  speedDiv.appendChild(speedLabel);

  const speedInput = document.createElement('input');
  speedInput.type = 'range';
  speedInput.id = 'ttsSpeed';
  speedInput.min = '0.5';
  speedInput.max = '2';
  speedInput.step = '0.1';
  speedInput.value = '1.3';
  speedInput.addEventListener('input', () => {
    speedValue.textContent = parseFloat(speedInput.value).toFixed(1);
  });
  speedInput.addEventListener('change', saveSettingsFromPanel);
  speedDiv.appendChild(speedInput);

  body.appendChild(speedDiv);
  panel.appendChild(body);

  document.body.appendChild(panel);

  // Load settings
  loadSettingsToPanel();
}

function toggleSettingsPanel() {
  const panel = document.querySelector('.tts-settings-panel');
  if (panel) {
    panel.classList.toggle('show');
  }
}

async function loadSettingsToPanel() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    if (response) {
      document.getElementById('ttsEnabled').checked = response.ttsEnabled;
      document.getElementById('ttsAutoSpeak').checked = response.autoSpeak;
      document.getElementById('ttsSpeakWord').checked = response.speakWord;
      document.getElementById('ttsSpeakSentence').checked = response.speakSentence;
      document.getElementById('ttsSpeed').value = response.speed;
      document.getElementById('speedValue').textContent = parseFloat(response.speed).toFixed(1);

      speechService.settings = response;
    }
  } catch (e) {
    console.log('Could not load settings');
  }
}

async function saveSettingsFromPanel() {
  const settings = {
    ttsEnabled: document.getElementById('ttsEnabled').checked,
    autoSpeak: document.getElementById('ttsAutoSpeak').checked,
    speakWord: document.getElementById('ttsSpeakWord').checked,
    speakSentence: document.getElementById('ttsSpeakSentence').checked,
    speed: parseFloat(document.getElementById('ttsSpeed').value)
  };

  speechService.settings = settings;

  try {
    await chrome.runtime.sendMessage({ action: 'saveSettings', settings });
  } catch (e) {
    console.log('Could not save settings');
  }
}

// Watch for answer reveals (when word is shown)
let lastSpokenSentence = '';

function observeAnswers() {
  const sentenceEl = document.querySelector('.sentence');
  if (!sentenceEl) return;

  const observer = new MutationObserver((mutations) => {
    // Check if word was revealed (has .ok or .no span)
    const revealed = sentenceEl.querySelector('.ok, .no');
    if (revealed && speechService.settings.autoSpeak && !speechService.speaking) {
      // Delay to ensure DOM is fully updated
      setTimeout(async () => {
        const lang = getCurrentLanguage();

        // Get the full sentence text from DOM
        const sentenceText = sentenceEl.textContent.trim();

        // Skip if still has blanks or same as last
        if (sentenceText.includes('___') || sentenceText === lastSpokenSentence) {
          return;
        }

        // Speak sentence (default behavior)
        if (speechService.settings.speakSentence) {
          lastSpokenSentence = sentenceText;
          console.log('TTS speaking sentence:', sentenceText);
          await speechService.speak(sentenceText, lang);
        }
        // Or speak just the word if sentence is disabled
        else if (speechService.settings.speakWord) {
          const word = revealed.textContent.trim();
          if (word) {
            console.log('TTS speaking word:', word);
            await speechService.speak(word, lang);
          }
        }
      }, 200);
    }
  });

  observer.observe(sentenceEl, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Keyboard shortcut: S to speak word
document.addEventListener('keydown', (e) => {
  // Don't trigger if typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    const word = getCurrentWord();
    const lang = getCurrentLanguage();

    if (word) {
      speechService.speak(word, lang);
    }
  }

  // Shift+S for sentence
  if ((e.key === 's' || e.key === 'S') && e.shiftKey) {
    e.preventDefault();
    const sent = getCurrentSentence();
    const lang = getCurrentLanguage();

    if (sent) {
      speechService.speak(sent, lang);
    }
  }
});

// Initialize when DOM is ready
function init() {
  // Wait for app to load
  const checkReady = setInterval(() => {
    const studyPanel = document.getElementById('studyPanel');
    if (studyPanel) {
      clearInterval(checkReady);
      injectTTSButtons();
      observeAnswers();
      console.log('Flashcard TTS Extension initialized');
    }
  }, 500);

  // Timeout after 10 seconds
  setTimeout(() => clearInterval(checkReady), 10000);
}

// Run init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
