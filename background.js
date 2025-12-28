// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertLatexToImage",
    title: "Convert to LaTeX Image",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertLatexToImage" && info.selectionText) {
    // Send message to content script to insert the LaTeX image
    chrome.tabs.sendMessage(tab.id, {
      action: "insertLatexImage",
      latexCode: info.selectionText
    });
  }
});
