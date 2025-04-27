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

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Disposition', 'attachment; filename="bank_statement.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Logo
    const logoPath = "images/logo.jpg";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 100 });
    }

    // Company Info
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text("Bank Statement", { align: "center" });
    doc.moveDown();

    // Account Holder Details
    doc.fontSize(12).fillColor('black').text('ACCOUNT HOLDER DETAILS',{ underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Holder Name: John Doe`)
      .text(`Registered Mobile Number: +94 77 086 4011`)
      .text(`Residential Address: Sri Lanka`);
    doc.moveDown(3);

    // Account Details
    doc.fontSize(12).fillColor('black').text('ACCOUNT DETAILS', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Type: Savings`)
      .text(`Account Balance: ${account.balance}`)
      .text(`Total Balance: ${account.balance}`);
    doc.moveDown();

    // Account Statement
    doc.fontSize(12).fillColor('black').text('ACCOUNT STATEMENT',{ underline: true });
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    const rowHeight = 20;
    const dateX = 50;
    const typeX = 150;
    const amountX = 320;
    const balanceX = 450;

    doc
      .fontSize(11)
      .text('Date', dateX, tableTop)
      .text('Transaction Type', typeX, tableTop)
      .text('Amount (LKR)', amountX, tableTop)
      .text('Balance After', balanceX, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    let y = tableTop + 25;

    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedTransactions.forEach(tx => {
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

      doc
        .fontSize(10)
        .text(txnDateStr, dateX, y)
        .text(transactionType, typeX, y)
        .text(formattedAmount, amountX, y, { width: 80, align: 'right' })
        .text(parseFloat(tx.current_balance).toFixed(2), balanceX, y, { width: 80, align: 'right' });

      y += rowHeight;

      if (y > doc.page.height - 100) {
        doc.addPage();
        y = 50;
      }
    });

    doc.moveDown(6);

    doc.fontSize(12).text("Authorized Signature: ______________", { align: "right" });
 

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate statement.");
  }
};
