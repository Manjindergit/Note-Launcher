// Listen for messages sent to the content script
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "showInputBox") {
        // Prevent creating multiple input boxes if one already exists
        if (document.getElementById("sap-note-box")) return;

        // Create an input box for entering the SAP Note
        const box = document.createElement("input");
        box.type = "text";
        box.id = "sap-note-box";
        box.placeholder = "Enter SAP Note";
        box.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            font-size: 18px;
            padding: 12px 16px;
            width: 280px;
            border: 2px solid #0070f3;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            background: #f0f8ff;
            color: #000;
        `;

        // Handle keydown events for the input box
        box.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                // Match and extract a valid SAP Note number
                const match = box.value.match(/\d{5,10}/);
                if (match) {
                    // Send a message to the background script to open the SAP Note in a new tab
                    chrome.runtime.sendMessage({
                        type: "openNoteInBackground",
                        url: `https://i7p.wdf.sap.corp/sap/support/notes/${match[0]}`
                    });
                }
                // Remove the input box and event listener
                box.remove();
                document.removeEventListener("mousedown", clickHandler);
            } else if (e.key === "Escape") {
                // Remove the input box if the Escape key is pressed
                box.remove();
                document.removeEventListener("mousedown", clickHandler);
            }
        });

        // Handle clicks outside the input box to remove it
        const clickHandler = (e) => {
            if (e.target !== box) {
                box.remove();
                document.removeEventListener("mousedown", clickHandler);
            }
        };

        // Append the input box to the document body and focus on it
        document.body.appendChild(box);
        box.focus();
        // Add a click event listener to detect clicks outside the input box
        document.addEventListener("mousedown", clickHandler);
    }
});
