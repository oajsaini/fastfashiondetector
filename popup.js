// Popup script for Amazon Sustainability Highlighter

document.addEventListener('DOMContentLoaded', function() {
  // Get button elements
  const toggleButton = document.getElementById('toggleHighlighting');
  const refreshButton = document.getElementById('refreshPage');
  const showLegendButton = document.getElementById('showLegend');
  const statusDiv = document.getElementById('status');
  
  // Check if we're on an Amazon page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    const isAmazonPage = currentTab.url && currentTab.url.includes('amazon.com');
    
    if (!isAmazonPage) {
      statusDiv.textContent = '⚠️ Not on Amazon.com';
      statusDiv.className = 'status inactive';
      toggleButton.disabled = true;
      refreshButton.disabled = true;
      showLegendButton.disabled = true;
    }
  });
  
  // Toggle highlighting
  toggleButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleHighlighting'}, function(response) {
        if (response && response.active) {
          statusDiv.textContent = '✅ Highlighting is active';
          statusDiv.className = 'status active';
        } else {
          statusDiv.textContent = '❌ Highlighting is disabled';
          statusDiv.className = 'status inactive';
        }
      });
    });
  });
  
  // Refresh page
  refreshButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });
  
  // Show legend on page
  showLegendButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'showLegend'});
    });
  });
  
  // Check current status when popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
      if (response && response.active) {
        statusDiv.textContent = '✅ Highlighting is active';
        statusDiv.className = 'status active';
      } else {
        statusDiv.textContent = '❌ Highlighting is disabled';
        statusDiv.className = 'status inactive';
      }
    });
  });
}); 