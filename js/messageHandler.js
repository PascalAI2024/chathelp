export class MessageHandler {
  constructor(settings) {
    this.settings = settings;
  }

  matchPreset(messageText) {
    return this.settings.presets.find(preset => 
      messageText.toLowerCase().includes(preset.name.toLowerCase())
    );
  }

  async handleMessage(message) {
    if (!this.isBotMessage(message)) return;
    
    const preset = this.matchPreset(message.textContent);
    if (preset) {
      await this.insertResponse(preset);
    }
  }

  isBotMessage(message) {
    return message?.classList.contains(this.settings.botMessageClass);
  }

  async insertResponse(preset) {
    const input = document.querySelector(this.settings.inputSelector);
    if (!input) return false;

    input.value = preset.text;
    input.dispatchEvent(new Event('input', { bubbles: true }));

    if (this.settings.autoSubmit) {
      const form = input.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
        return true;
      }
    }
    return false;
  }
}