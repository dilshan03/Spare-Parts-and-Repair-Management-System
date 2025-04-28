import fs from 'fs';
import PDFDocument from "pdfkit";
import BankBookTransaction from "../../models/Finance/BankBookTransaction.js";
import BankAccount from "../../models/Finance/BankAccount.js";

export const generateBankStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const account = await BankAccount.findById(accountId);
    if (!account) {
      throw new Error('Bank account not found');
    }

    const transactions = await BankBookTransaction.find({ 
      bank_account_id: accountId 
    }).sort({ createdAt: -1 });

    console.log('Found transactions:', transactions.length);

    // PDF Document Setup
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: 'Bank Statement',
        Author: 'Cosmo Exports Lanka (PVT) LTD',
        Subject: 'Account Statement'
      }
    });
    
    res.setHeader('Content-Disposition', 'attachment; filename="bank_statement.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Colors
    const primaryColor = '#2c3e50';
    const secondaryColor = '#3498db';
    const lightGray = '#f5f5f5';
    const darkGray = '#333333';
    const white = '#ffffff';

    // Header with Logo
    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
    
    const logoPath = "images/logo.jpg";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 25, { width: 70 });
    }

    // Company Info
    doc.fillColor(white)
      .fontSize(18)
      .text("Cosmo Exports Lanka (PVT) LTD", 0, 40, { align: "center" })
      .fontSize(10)
      .text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" })
      .text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" })
      .moveDown(0.5);

    // Document Title
    doc.fontSize(16)
      .text("BANK STATEMENT", { align: "center", underline: false })
      .moveDown(2);

    // Reset to normal colors
    doc.fillColor(darkGray).strokeColor(darkGray);

    // Account Holder Details Section
    doc.rect(40, 150, doc.page.width - 80, 20)
      .fill(secondaryColor);
    
    doc.fillColor(white)
      .fontSize(12)
      .text('ACCOUNT HOLDER DETAILS', 50, 155)
      .fillColor(darkGray);

    doc.fontSize(11)
      .text(`Account Holder Name: John Doe`, 50, 180)
      .text(`Registered Mobile Number: +94 77 086 4011`, 50, 195)
      .text(`Residential Address: Sri Lanka`, 50, 210)
      .moveDown(1.5);

    // Account Details Section
    doc.rect(40, 240, doc.page.width - 80, 20)
      .fill(secondaryColor);
    
    doc.fillColor(white)
      .fontSize(12)
      .text('ACCOUNT DETAILS', 50, 245)
      .fillColor(darkGray);

    doc.fontSize(11)
      .text(`Account Type: Savings`, 50, 270)
      .text(`Account Balance: ${account.balance.toFixed(2)} LKR`, 50, 285)
      .text(`Total Balance: ${account.balance.toFixed(2)} LKR`, 50, 300)
      .moveDown(1.5);

    // Account Statement Section
    doc.rect(40, 330, doc.page.width - 80, 20)
      .fill(secondaryColor);
    
    doc.fillColor(white)
      .fontSize(12)
      .text('ACCOUNT STATEMENT', 50, 335)
      .fillColor(darkGray)
      .moveDown(2);

    // Table Header
    const tableTop = 370;
    const rowHeight = 20;
    const dateX = 50;
    const typeX = 150;
    const amountX = 320;
    const balanceX = 450;

    // Header background
    doc.rect(40, tableTop - 10, doc.page.width - 80, rowHeight + 5)
      .fill(lightGray);

    doc.fontSize(11)
      .fillColor(darkGray)
      .text('Date', dateX, tableTop)
      .text('Transaction Type', typeX, tableTop)
      .text('Amount (LKR)', amountX, tableTop)
      .text('Balance After', balanceX, tableTop);

    // Table Rows
    let y = tableTop + 25;
    let isEvenRow = false;

    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedTransactions.forEach((tx, index) => {
      // Alternate row colors
      if (isEvenRow) {
        doc.rect(40, y - 10, doc.page.width - 80, rowHeight)
          .fill(lightGray);
      }
      isEvenRow = !isEvenRow;

      const formattedAmount = parseFloat(tx.amount).toFixed(2);
      const txnDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const txnDateStr = txnDate && !isNaN(txnDate) ? 
        txnDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }) : 'Unknown';

      let transactionType = '';
      switch (tx.transaction_type) {
        case 'withdrawal':
        case 'bank_charge':
          transactionType = 'Withdrawal';
          break;
        case 'deposit':
        case 'unknown_deposit':
          transactionType = 'Deposit';
          break;
        default:
          transactionType = 'Transaction';
      }

      doc.fontSize(10)
        .fillColor(darkGray)
        .text(txnDateStr, dateX, y)
        .text(transactionType, typeX, y)
        .text(formattedAmount, amountX, y, { width: 80, align: 'right' })
        .text(parseFloat(tx.current_balance).toFixed(2), balanceX, y, { width: 80, align: 'right' });

      y += rowHeight;

      // Page break logic
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 50;
        isEvenRow = false; // Reset row coloring on new page
      }
    });

    // Footer
    doc.fontSize(10)
      .fillColor(darkGray)
      .text(`Generated on ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50)
      .text("Authorized Signature: ______________", doc.page.width - 200, doc.page.height - 50, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate statement.");
  }
};