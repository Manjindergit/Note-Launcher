chrome.commands.onCommand.addListener((command) => {
    if (command === "open_sap_note") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: getSelectedNumber,
                },
                (results) => {
                    if (results && results[0] && results[0].result) {
                        const noteNumber = results[0].result;
                        const sapUrl = `https://i7p.wdf.sap.corp/sap/support/notes/${noteNumber}`;
                        chrome.tabs.create({ url: sapUrl, active: false }); // Open in background
                    }
                }
            );
        });
    }
});

function getSelectedNumber() {
    return window.getSelection().toString().trim();
}