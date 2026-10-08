document.addEventListener("DOMContentLoaded", () => {
    setupExportButton();
});

const csvWorkerCode = `
self.onmessage = function(e) {
    const transactions = e.data;
    const headers = ["Date", "Type", "Category", "Title", "Amount"];
    let csvContent = headers.join(",") + "\\n";
    
    // Sort transactions chronologically
    const sorted = transactions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Format & escape fields compliant with RFC-4180
    sorted.forEach((tx) => {
        const cleanTitle = '"' + (tx.title || "").replace(/"/g, '""') + '"';
        const cleanCategory = '"' + (tx.category || "General").replace(/"/g, '""') + '"';
        const rowData = [
            tx.date.split("T")[0],
            tx.type,
            cleanCategory,
            cleanTitle,
            tx.amount
        ];
        csvContent += rowData.join(",") + "\\n";
    });

    // Send compiled CSV back to the main thread
    self.postMessage(csvContent);
};
`;

function setupExportButton() {
    const buttons = document.querySelectorAll(".btn-secondary");
    let exportBtn = null;
    buttons.forEach((btn) => {
        const text = btn.textContent.toLowerCase();
        if (text.includes("export") || text.includes("download report")) {
            exportBtn = btn;
        }
    });

    if (!exportBtn) return;

    exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user || !user.transactions || user.transactions.length === 0) {
            alert("No data available to export.");
            return;
        }
        
        exportWithWebWorker(user.transactions);
    });
}

function exportWithWebWorker(transactions) {
    if (window.Worker && window.Blob) {
        try {
            const blob = new Blob([csvWorkerCode], { type: "application/javascript" });
            const workerUrl = URL.createObjectURL(blob);
            const worker = new Worker(workerUrl);

            worker.onmessage = function(e) {
                const csvString = e.data;
                triggerDownload(csvString, "WealthWise_Financial_Report.csv");
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
            };

            worker.onerror = function() {
                worker.terminate();
                fallbackExport(transactions);
            };

            worker.postMessage(transactions);
            return;
        } catch (err) {
            console.warn("Worker creation failed, falling back to main thread:", err);
        }
    }

    fallbackExport(transactions);
}


function fallbackExport(transactions) {
    const csvString = generateCSV(transactions);
    triggerDownload(csvString, "WealthWise_Financial_Report.csv");
}

function generateCSV(transactions) {
    const headers = ["Date", "Type", "Category", "Title", "Amount"];
    let csvContent = headers.join(",") + "\n";
    const sorted = transactions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    sorted.forEach((tx) => {
        const cleanTitle = `"${tx.title.replace(/"/g, '""')}"`;
        const cleanCategory = `"${tx.category || "General"}"`;
        const rowData = [
            tx.date.split("T")[0],
            tx.type,
            cleanCategory,
            cleanTitle,
            tx.amount
        ];
        csvContent += rowData.join(",") + "\n";
    });

    return csvContent;
}

function triggerDownload(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const ghostLink = document.createElement("a");
    ghostLink.href = downloadUrl;
    ghostLink.setAttribute("download", filename);
    ghostLink.style.display = "none";
    document.body.appendChild(ghostLink);
    ghostLink.click();
    document.body.removeChild(ghostLink);
    URL.revokeObjectURL(downloadUrl);
}