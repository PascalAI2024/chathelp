export class DOMObserver {
  constructor(messageHandler) {
    this.messageHandler = messageHandler;
    this.observer = null;
  }

  start() {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          this.checkNewNodes(mutation.addedNodes);
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  checkNewNodes(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches(this.messageHandler.settings.messageSelector)) {
          this.messageHandler.handleMessage(node);
        }
        
        const messages = node.querySelectorAll(this.messageHandler.settings.messageSelector);
        messages.forEach(message => this.messageHandler.handleMessage(message));
      }
    });
  }
}