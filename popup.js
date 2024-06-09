document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const summaryContainer = document.getElementById('summary-container');
  const summaryContent = document.getElementById('summary-content');
  const loadingSpinner = document.getElementById('loading-spinner');

  function showLoadingSpinner() {
    if (loadingSpinner) loadingSpinner.style.display = 'block';
  }

  function hideLoadingSpinner() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }

  if (summarizeButton) {
    summarizeButton.addEventListener('click', () => {
      showLoadingSpinner();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          hideLoadingSpinner();
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content_script.js']
        }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            hideLoadingSpinner();
          }
        });
      });
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showSummary') {
      console.log('Summary received in popup:', request.summary);
      if (summaryContent && summaryContainer) {
        summaryContent.textContent = request.summary;
        summaryContainer.style.display = 'block';
        hideLoadingSpinner();
      }
    }
  });  
});
