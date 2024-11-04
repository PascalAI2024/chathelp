import { loadSettings, saveSettings } from './js/settings.js';

let currentSettings;

const createPresetElement = (preset, index) => {
  const div = document.createElement('div');
  div.className = 'preset-item';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Preset Name';
  nameInput.value = preset.name;
  
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Response Text';
  textInput.value = preset.text;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn danger';
  deleteBtn.textContent = '×';
  deleteBtn.onclick = () => {
    currentSettings.presets.splice(index, 1);
    renderPresets();
  };
  
  div.appendChild(nameInput);
  div.appendChild(textInput);
  div.appendChild(deleteBtn);
  
  return div;
};

const renderPresets = () => {
  const container = document.getElementById('presetsList');
  container.innerHTML = '';
  currentSettings.presets.forEach((preset, index) => {
    container.appendChild(createPresetElement(preset, index));
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  currentSettings = await loadSettings();
  
  document.getElementById('inputSelector').value = currentSettings.inputSelector;
  document.getElementById('botMessageClass').value = currentSettings.botMessageClass;
  document.getElementById('autoSubmit').checked = currentSettings.autoSubmit;
  
  renderPresets();
  
  document.getElementById('addPreset').onclick = () => {
    currentSettings.presets.push({ name: '', text: '' });
    renderPresets();
  };
  
  document.getElementById('save').onclick = async () => {
    const presetElements = document.querySelectorAll('.preset-item');
    currentSettings.presets = Array.from(presetElements).map(el => ({
      name: el.children[0].value,
      text: el.children[1].value
    }));
    
    currentSettings.inputSelector = document.getElementById('inputSelector').value;
    currentSettings.botMessageClass = document.getElementById('botMessageClass').value;
    currentSettings.autoSubmit = document.getElementById('autoSubmit').checked;
    
    await saveSettings(currentSettings);
    
    const status = document.createElement('div');
    status.textContent = 'Settings saved!';
    status.style.cssText = 'position:fixed;top:10px;right:10px;background:#4caf50;color:white;padding:8px;border-radius:4px;';
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 2000);
  };
});