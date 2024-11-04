export class ElementInspector {
  constructor() {
    this.overlay = null;
    this.isActive = false;
    this.selectedElement = null;
  }

  start() {
    this.createOverlay();
    this.attachEventListeners();
    this.isActive = true;
  }

  stop() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.removeEventListeners();
    this.isActive = false;
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'bolt-inspector-overlay';
    this.overlay.innerHTML = `
      <div class="bolt-inspector-controls">
        <button id="bolt-select-input">Select Chat Input</button>
        <button id="bolt-select-message">Select Bot Message</button>
        <div class="bolt-selected-elements">
          <div>Input: <span id="bolt-input-selector">Not selected</span></div>
          <div>Message: <span id="bolt-message-selector">Not selected</span></div>
        </div>
      </div>
    `;
    
    const styles = document.createElement('style');
    styles.textContent = `
      #bolt-inspector-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      .bolt-inspector-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .bolt-inspector-controls button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #2196f3;
        color: white;
        cursor: pointer;
      }
      
      .bolt-inspector-controls button:hover {
        background: #1976d2;
      }
      
      .bolt-selected-elements {
        margin-top: 10px;
        font-size: 12px;
      }
      
      .bolt-highlight {
        outline: 2px solid #2196f3 !important;
        background: rgba(33, 150, 243, 0.1) !important;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(this.overlay);
  }

  attachEventListeners() {
    this.overlay.querySelector('#bolt-select-input').addEventListener('click', () => {
      this.startSelection('input');
    });
    
    this.overlay.querySelector('#bolt-select-message').addEventListener('click', () => {
      this.startSelection('message');
    });
  }

  startSelection(type) {
    const oldHighlight = document.querySelector('.bolt-highlight');
    if (oldHighlight) {
      oldHighlight.classList.remove('bolt-highlight');
    }

    const handleMouseOver = (e) => {
      e.stopPropagation();
      const target = e.target;
      
      if (target !== this.overlay && !this.overlay.contains(target)) {
        const oldHighlight = document.querySelector('.bolt-highlight');
        if (oldHighlight) {
          oldHighlight.classList.remove('bolt-highlight');
        }
        target.classList.add('bolt-highlight');
      }
    };

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target;
      if (target !== this.overlay && !this.overlay.contains(target)) {
        this.selectElement(target, type);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleClick);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
  }

  selectElement(element, type) {
    const selector = this.generateSelector(element);
    
    if (type === 'input') {
      this.overlay.querySelector('#bolt-input-selector').textContent = selector;
      chrome.storage.sync.get(['chatbot_settings'], (result) => {
        const settings = result.chatbot_settings || {};
        settings.inputSelector = selector;
        chrome.storage.sync.set({ chatbot_settings: settings });
      });
    } else {
      this.overlay.querySelector('#bolt-message-selector').textContent = selector;
      chrome.storage.sync.get(['chatbot_settings'], (result) => {
        const settings = result.chatbot_settings || {};
        settings.messageSelector = selector;
        chrome.storage.sync.set({ chatbot_settings: settings });
      });
    }
  }

  generateSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = Array.from(element.classList).join('.');
      return `.${classes}`;
    }
    
    const tag = element.tagName.toLowerCase();
    const siblings = element.parentNode.children;
    const index = Array.from(siblings).indexOf(element);
    
    return `${tag}:nth-child(${index + 1})`;
  }

  removeEventListeners() {
    const oldHighlight = document.querySelector('.bolt-highlight');
    if (oldHighlight) {
      oldHighlight.classList.remove('bolt-highlight');
    }
  }
}