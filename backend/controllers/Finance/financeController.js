import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import excelJS from "exceljs";
import Transaction from "../models/Transaction.js";

// Generate PDF Report
const generatePDFReport = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="financial_report.pdf"');
    doc.pipe(res);

    // Add Logo
    const logoPath = "images/logo.jpg"; // Adjust the path based on your project structure
    doc.image(logoPath, 50, 50, { width: 100 });

    // Add Letterhead
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);

    // Report Title
    doc.fontSize(16).text("Financial Report (Transaction History)", { align: "center", underline: true });
    doc.moveDown(2);

    // Table Headers
    const startX = 60;
    let startY = doc.y;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Date & Time", startX, startY);
    doc.text("Type", startX + 120, startY);
    doc.text("Amount", startX + 220, startY);
    doc.text("Description", startX + 320, startY);
    doc.moveTo(startX, startY + 15).lineTo(550, startY + 15).stroke();

    // Reset font for data
    doc.font("Helvetica");
    startY += 25;

    // Add Transactions with Fixed Alignment
    transactions.forEach((txn) => {
      // Use `toLocaleString()` to include both date and time
      doc.text(new Date(txn.timestamp).toLocaleString(), startX, startY);
      doc.text(txn.type, startX + 120, startY);
      doc.text(`LKR ${txn.amount}`, startX + 220, startY);
      doc.text(txn.description, startX + 320, startY, { width: 200, ellipsis: true });

      startY += 20; // Ensure consistent row height
      if (startY > 750) {
        doc.addPage();
        startY = 50; // Reset Y position on new page
      }
    });

    doc.moveDown(4);

    // Signature
    doc.text("Authorized Signature: ____________________", { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
};

// Generate Excel Report
const generateExcelReport = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Report");

    worksheet.columns = [
      { header: "Date & Time", key: "timestamp", width: 30 },
      { header: "Type", key: "type", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Description", key: "description", width: 30 },
    ];

    transactions.forEach((txn) => {
      worksheet.addRow({
        // Format the timestamp to include both date and time
        timestamp: new Date(txn.timestamp).toLocaleString(),
        type: txn.type,
        amount: txn.amount,
        description: txn.description,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="financial_report.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel report:", error);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};

// ✅ Define `financeController` before exporting
const financeController = {
  generatePDFReport,
  generateExcelReport,
};

export default financeController;
