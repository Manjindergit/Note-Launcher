// Listen for keyboard commands registered in the extension manifest
chrome.commands.onCommand.addListener((command) => {
    if (command === "show_input_box") {
        // Query the currently active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Send a message to the content script of the active tab to show the input box
            chrome.tabs.sendMessage(tabs[0].id, { type: "showInputBox" }, (res) => {
                // Log an error if the message fails to send
                if (chrome.runtime.lastError) {
                    console.error("Failed to send message:", chrome.runtime.lastError.message);
                }
            });
        });
    }
});

// Listen for messages sent to the background script
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "openNoteInBackground") {
        // Open a new tab with the specified URL in the background (not active)
        chrome.tabs.create({ url: msg.url, active: false });
    }
});
