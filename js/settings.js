class StorageManager {
  constructor() {
    this.storage = this.initializeStorage();
  }

  initializeStorage() {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return {
        sync: {
          get: (keys, callback) => {
            const data = JSON.parse(localStorage.getItem('chatbot_settings') || '{}');
            callback(Object.keys(keys).length ? { ...keys, ...data } : data);
          },
          set: (items, callback) => {
            localStorage.setItem('chatbot_settings', JSON.stringify(items));
            if (callback) callback();
          }
        }
      };
    }
    return chrome.storage;
  }

  async saveSettings(settings) {
    return new Promise((resolve) => {
      this.storage.sync.set(settings, resolve);
    });
  }

  async loadSettings() {
    return new Promise((resolve) => {
      this.storage.sync.get(defaultSettings, resolve);
    });
  }
}

export const defaultSettings = {
  presets: [
    { name: 'Next Task', text: 'Next task please!' },
    { name: 'Continue', text: 'Please continue' },
    { name: 'Confirm', text: 'Yes, that works perfectly' }
  ],
  inputSelector: '.chat-input',
  autoSubmit: true,
  messageSelector: '.message, .chat-message',
  botMessageClass: 'assistant-message'
};

const storageManager = new StorageManager();
export const saveSettings = (settings) => storageManager.saveSettings(settings);
export const loadSettings = () => storageManager.loadSettings();