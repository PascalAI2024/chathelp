import { MessageHandler } from './messageHandler.js';
import { DOMObserver } from './domObserver.js';
import { ElementInspector } from './inspector.js';
import { loadSettings } from './settings.js';

class ChatBotAssistant {
  constructor() {
    this.init();
  }

  async init() {
    const settings = await loadSettings();
    const messageHandler = new MessageHandler(settings);
    const observer = new DOMObserver(messageHandler);
    observer.start();

    // Initialize inspector when Alt+Shift+B is pressed
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'b') {
        const inspector = new ElementInspector();
        inspector.start();
      }
    });
  }
}

new ChatBotAssistant();