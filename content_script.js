function getMainContent() {
  return document.querySelector('body').innerText;
}

function sendContentToBackground(content) {
  chrome.runtime.sendMessage({ action: 'summarize', content: content });
}

sendContentToBackground(getMainContent());
