// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "insertLatexImage") {
    insertLatexImage(request.latexCode);
  }
});

function insertLatexImage(latexCode) {
  // URL encode the LaTeX code for the CodeCogs API
  const encodedLatex = encodeURIComponent(latexCode);
  const imageUrl = `https://latex.codecogs.com/png.image?${encodedLatex}`;
  
  // Get the currently focused element (should be the Gmail compose area)
  const activeElement = document.activeElement;
  
  // Check if we're in a Gmail compose area (contenteditable div)
  if (!activeElement || !isGmailComposeArea(activeElement)) {
    console.error("Not in a Gmail compose area");
    return;
  }
  
  // Create the image element
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = latexCode;
  img.style.verticalAlign = 'middle';
  img.style.margin = '0 2px';
  
  // Insert the image at the current cursor position
  insertImageAtCursor(img, activeElement);
}

function isGmailComposeArea(element) {
  // Gmail compose areas are contenteditable divs with specific attributes
  if (element.getAttribute('contenteditable') !== 'true') {
    return false;
  }
  
  // Check if element is within Gmail's compose structure
  // Gmail compose areas typically have aria-label containing "message body"
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.toLowerCase().includes('message body')) {
    return true;
  }
  
  // Alternative check: look for parent with specific Gmail classes
  let parent = element;
  while (parent) {
    if (parent.classList && (
      parent.classList.contains('Am') || // Gmail compose class
      parent.getAttribute('role') === 'textbox'
    )) {
      return true;
    }
    parent = parent.parentElement;
  }
  
  return false;
}

function insertImageAtCursor(img, container) {
  const selection = window.getSelection();
  
  if (!selection.rangeCount) {
    // No selection, append to the end
    container.appendChild(img);
    // Add a space after the image
    container.appendChild(document.createTextNode(' '));
    return;
  }
  
  const range = selection.getRangeAt(0);
  
  // Make sure the range is within our container
  if (!container.contains(range.commonAncestorContainer)) {
    container.appendChild(img);
    container.appendChild(document.createTextNode(' '));
    return;
  }
  
  // Delete the selected text (the LaTeX code)
  range.deleteContents();
  
  // Insert the image
  range.insertNode(img);
  
  // Add a space after the image for easier typing
  const spaceNode = document.createTextNode(' ');
  range.setStartAfter(img);
  range.insertNode(spaceNode);
  
  // Move cursor after the space
  range.setStartAfter(spaceNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // Trigger input event so Gmail knows the content changed
  container.dispatchEvent(new Event('input', { bubbles: true }));
}
