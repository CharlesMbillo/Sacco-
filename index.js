const transactionForm = document.getElementById("transaction-form");
const reportDiv = document.getElementById("report");

transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(transactionForm);
    const data = {
        memberId: formData.get("member-id"),
        transactionType: formData.get("transaction-type"),
        faceAmount: parseFloat(formData.get("face-amount")),
        transactionDate: formData.get("transaction-date"),
    };

    try {
        const response = await fetch("/api/transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const reportData = await fetch(`/api/report?id=${data.memberId}`).then((response) => response.json());
            const report = generateReport(reportData);
            reportDiv.innerHTML = report;
        } else {
            throw new Error("Failed to save transaction.");
        }
    } catch (error) {
        console.error(error);
        reportDiv.innerHTML = "An error occurred while saving the transaction. Please try again.";
    }
});

function generateReport(data) {
    let report = "<h2>Transaction Report</h2>";
    report += "<table>";
    report += "<thead><tr><th>Date</th><th>Type</th><th>Amount</th></tr></thead>";
    report += "<tbody>";

    for (const item of data) {
        report += `<tr><td>${item.transactionDate}</td><td>${item.transactionType}</td><td>${item.faceAmount}</td></tr>`;
    }

    report += "</tbody>";
    report += "</table>";

    return report;
}