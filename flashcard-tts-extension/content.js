/**
 * Flashcard TTS Extension - Content Script
 *
 * Provides TTS functionality for the flashcard app:
 * - Auto-speaks after correct/incorrect answers
 * - Keyboard shortcut (S key) to speak current word
 * - Message handlers for popup TTS controls
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
      // Notify popup that speaking is finished
      chrome.runtime.sendMessage({ action: 'speakingFinished' });
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.speaking = false;
    chrome.runtime.sendMessage({ action: 'speakingFinished' });
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

// Watch for answer reveals (when word is shown)
let lastSpokenSentence = '';

function observeAnswers() {
  const sentenceEl = document.querySelector('.sentence');
  if (!sentenceEl) return;

  const observer = new MutationObserver((mutations) => {
    const sentenceText = sentenceEl.textContent.trim();
    
    // Reset lastSpokenSentence when card goes back to hidden state (showing ___)
    // This happens when user is retrying after a wrong answer
    if (sentenceText.includes('___')) {
      lastSpokenSentence = '';
      return;
    }
    
    // Check if word was revealed (has .ok or .no span)
    const revealed = sentenceEl.querySelector('.ok, .no');
    if (revealed && speechService.settings.autoSpeak && !speechService.speaking) {
      // Delay to ensure DOM is fully updated
      setTimeout(async () => {
        const lang = getCurrentLanguage();

        // Get the full sentence text from DOM (fresh read)
        const currentText = sentenceEl.textContent.trim();

        // Skip if still has blanks or same as last
        if (currentText.includes('___') || currentText === lastSpokenSentence) {
          return;
        }

        // Speak sentence (default behavior)
        if (speechService.settings.speakSentence) {
          lastSpokenSentence = currentText;
          console.log('TTS speaking sentence:', currentText);
          await speechService.speak(currentText, lang);
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

  // Shift+S for sentence (check first)
  if ((e.key === 's' || e.key === 'S') && e.shiftKey) {
    e.preventDefault();
    const sent = getCurrentSentence();
    const lang = getCurrentLanguage();

    if (sent) {
      speechService.speak(sent, lang);
    }
    return;
  }

  // S for word
  if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    const word = getCurrentWord();
    const lang = getCurrentLanguage();

    if (word) {
      speechService.speak(word, lang);
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsChanged') {
    speechService.settings = { ...speechService.settings, ...request.settings };
    sendResponse({ success: true });
    return false;
  }

  if (request.action === 'speakFromPopup') {
    (async () => {
      const lang = getCurrentLanguage();
      const text = request.type === 'word' ? getCurrentWord() : getCurrentSentence();
      
      if (text) {
        // Estimate duration for response
        const duration = Math.max(1, text.length / 10);
        speechService.speak(text, lang);
        sendResponse({ success: true, duration });
      } else {
        sendResponse({ success: false, error: 'No text available' });
      }
    })();
    return true; // Async response
  }

  if (request.action === 'stopSpeaking') {
    speechService.stop();
    sendResponse({ success: true });
    return false;
  }
});

// Remove any existing TTS buttons from previous extension version
function cleanupOldTTSButtons() {
  const oldControls = document.querySelectorAll('.tts-controls, .tts-settings-panel');
  oldControls.forEach(el => el.remove());
}

// Initialize when DOM is ready
function init() {
  // Clean up any old buttons first
  cleanupOldTTSButtons();

  // Wait for app to load
  const checkReady = setInterval(() => {
    const studyPanel = document.getElementById('studyPanel');
    if (studyPanel) {
      clearInterval(checkReady);
      cleanupOldTTSButtons(); // Clean again after panel loads
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
