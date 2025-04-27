import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import excelJS from "exceljs";
import Transaction from "../../models/Finance/Transaction.js";

// ✅ Correct Date-Time format function
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

// Generate PDF Report
// Generate PDF Report (Fixed Column Collision)
const generatePDFReport = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: 'Financial Transaction Report',
        Author: 'Cosmo Exports Lanka (PVT) LTD',
        Subject: 'Transaction History'
      }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="financial_report.pdf"'
    );
    doc.pipe(res);

    // Color Scheme
    const primaryColor = '#2c3e50';
    const secondaryColor = '#3498db';
    const rowColorEven = '#ffffff';
    const rowColorOdd = '#f8f9fa';
    const textColor = '#212529';
    const borderColor = '#dee2e6';

    // Header with Logo
    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);

    const logoPath = "images/logo.jpg";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 25, { width: 70 });
    }

    // Company Info
    doc.fillColor('#ffffff')
      .fontSize(18)
      .text("Cosmo Exports Lanka (PVT) LTD", 0, 40, { align: "center" })
      .fontSize(10)
      .text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" })
      .text(
        "Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com",
        { align: "center" }
      )
      .moveDown(0.5);

    // Document Title
    doc.fontSize(16)
      .fillColor('#ffffff')
      .text("FINANCIAL TRANSACTION REPORT", { align: "center" })
      .fontSize(10)
      .text(`Generated on ${new Date().toLocaleDateString()}`, { align: "center" })
      .moveDown(2);

    // Reset colors
    doc.fillColor(textColor).strokeColor(borderColor);

    // Table Setup - Adjusted column widths to prevent collision
    const startX = 50;
    let startY = doc.y;
    const rowHeight = 22;
    const colWidths = [130, 90, 100, 150]; // Wider columns: [Date, Type, Amount, Description]
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);

    // Table Header
    doc.rect(startX, startY, tableWidth, rowHeight).fill(secondaryColor);
    
    doc.fillColor('#ffffff')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text("DATE & TIME", startX + 10, startY + 7)
      .text("TYPE", startX + colWidths[0] + 10, startY + 7)
      .text("AMOUNT (LKR)", startX + colWidths[0] + colWidths[1] + 10, startY + 7, { 
        width: colWidths[2] - 20, 
        align: 'right' 
      })
      .text("DESCRIPTION", startX + colWidths[0] + colWidths[1] + colWidths[2] + 10, startY + 7, {
        width: colWidths[3] - 20
      });

    // Header bottom border
    doc.moveTo(startX, startY + rowHeight)
      .lineTo(startX + tableWidth, startY + rowHeight)
      .lineWidth(1)
      .stroke();

    startY += rowHeight;

    // Data rows
    transactions.forEach((txn, index) => {
      const rowColor = index % 2 === 0 ? rowColorEven : rowColorOdd;
      doc.rect(startX, startY, tableWidth, rowHeight).fill(rowColor);
      doc.strokeColor(borderColor)
        .rect(startX, startY, tableWidth, rowHeight)
        .stroke();

      // Calculate column positions
      const dateCol = startX + 10;
      const typeCol = startX + colWidths[0] + 10;
      const amountCol = startX + colWidths[0] + colWidths[1] + 10;
      const descCol = startX + colWidths[0] + colWidths[1] + colWidths[2] + 10;

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor(textColor)
        .text(formatDateTime(txn.timestamp), dateCol, startY + 7)
        .text(txn.type, typeCol, startY + 7)
        .text(
          txn.amount.toLocaleString('en-US', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          }), 
          amountCol, 
          startY + 7, 
          { 
            width: colWidths[2] - 20, 
            align: 'right' 
          }
        )
        .text(
          txn.description, 
          descCol, 
          startY + 7, 
          { 
            width: colWidths[3] - 20,
            ellipsis: true 
          }
        );

      startY += rowHeight;
      
      // Page break with header repeat
      if (startY > doc.page.height - 100) {
        doc.addPage();
        startY = 50;
        
        // Repeat header
        doc.rect(startX, startY, tableWidth, rowHeight).fill(secondaryColor);
        doc.fillColor('#ffffff')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text("DATE & TIME", dateCol, startY + 7)
          .text("TYPE", typeCol, startY + 7)
          .text("AMOUNT (LKR)", amountCol, startY + 7, { 
            width: colWidths[2] - 20, 
            align: 'right' 
          })
          .text("DESCRIPTION", descCol, startY + 7, {
            width: colWidths[3] - 20
          });
          
        doc.moveTo(startX, startY + rowHeight)
          .lineTo(startX + tableWidth, startY + rowHeight)
          .lineWidth(1)
          .stroke();
          
        startY += rowHeight;
      }
    });

    // Footer
    doc.fontSize(10)
      .fillColor(textColor)
      .text(`Total Transactions: ${transactions.length}`, 50, doc.page.height - 50)
      .text("Authorized Signature: ____________________", doc.page.width - 200, doc.page.height - 50, { align: "right" });

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
        timestamp: formatDateTime(txn.timestamp),
        type: txn.type,
        amount: txn.amount,
        description: txn.description,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="financial_report.xlsx"'
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel report:", error);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};

// Export controller
const financeController = {
  generatePDFReport,
  generateExcelReport,
};

export default financeController;
