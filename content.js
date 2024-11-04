import { loadSettings } from './js/settings.js';

class ChatBotAssistant {
  constructor() {
    this.settings = null;
    this.init();
  }

  async init() {
    this.settings = await loadSettings();
    this.setupMutationObserver();
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.checkForNewMessages();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkForNewMessages() {
    const messages = document.querySelectorAll(this.settings.messageSelector);
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.classList.contains(this.settings.botMessageClass)) {
      this.handleBotMessage(lastMessage);
    }
  }

  handleBotMessage(message) {
    const preset = this.findMatchingPreset(message.textContent);
    if (preset) {
      this.sendResponse(preset.text);
    }
  }

  findMatchingPreset(messageText) {
    return this.settings.presets.find(preset => 
      messageText.toLowerCase().includes(preset.name.toLowerCase())
    );
  }

  sendResponse(text) {
    const input = document.querySelector(this.settings.inputSelector);
    if (!input) return;

    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));

    if (this.settings.autoSubmit) {
      const form = input.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  }
}

// Initialize the assistant
new ChatBotAssistant();