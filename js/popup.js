import { loadSettings, saveSettings, defaultSettings } from './settings.js';

class PopupManager {
  constructor() {
    this.settings = null;
    this.init();
  }

  async init() {
    this.settings = await loadSettings();
    this.setupEventListeners();
    this.renderPresets();
    this.loadSettingsToUI();
  }

  setupEventListeners() {
    document.getElementById('addPreset').addEventListener('click', () => this.addPreset());
    document.getElementById('save').addEventListener('click', () => this.saveAllSettings());
    
    // Settings inputs
    document.getElementById('inputSelector').addEventListener('change', (e) => {
      this.settings.inputSelector = e.target.value;
    });
    
    document.getElementById('botMessageClass').addEventListener('change', (e) => {
      this.settings.botMessageClass = e.target.value;
    });
    
    document.getElementById('autoSubmit').addEventListener('change', (e) => {
      this.settings.autoSubmit = e.target.checked;
    });
  }

  renderPresets() {
    const presetsList = document.getElementById('presetsList');
    presetsList.innerHTML = '';
    
    this.settings.presets.forEach((preset, index) => {
      const presetDiv = document.createElement('div');
      presetDiv.className = 'preset-item';
      presetDiv.innerHTML = `
        <input type="text" class="preset-name" value="${preset.name}" 
               placeholder="Preset Name" data-index="${index}">
        <input type="text" class="preset-text" value="${preset.text}" 
               placeholder="Response Text" data-index="${index}">
        <button class="remove-preset" data-index="${index}">Remove</button>
      `;
      presetsList.appendChild(presetDiv);
    });

    // Add listeners for the new elements
    document.querySelectorAll('.remove-preset').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        this.removePreset(index);
      });
    });
  }

  loadSettingsToUI() {
    document.getElementById('inputSelector').value = this.settings.inputSelector;
    document.getElementById('botMessageClass').value = this.settings.botMessageClass;
    document.getElementById('autoSubmit').checked = this.settings.autoSubmit;
  }

  addPreset() {
    this.settings.presets.push({ name: '', text: '' });
    this.renderPresets();
  }

  removePreset(index) {
    this.settings.presets.splice(index, 1);
    this.renderPresets();
  }

  async saveAllSettings() {
    // Gather all preset values
    const presetItems = document.querySelectorAll('.preset-item');
    this.settings.presets = Array.from(presetItems).map(item => ({
      name: item.querySelector('.preset-name').value,
      text: item.querySelector('.preset-text').value
    }));

    await saveSettings(this.settings);
    this.showSaveConfirmation();
  }

  showSaveConfirmation() {
    const saveBtn = document.getElementById('save');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.disabled = true;
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }, 1500);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});