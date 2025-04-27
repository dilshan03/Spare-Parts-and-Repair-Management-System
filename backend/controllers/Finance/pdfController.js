//for bank book management

import PDFDocument from "pdfkit";
import BankBookTransaction from "../../models/Finance/BankBookTransaction.js";
import BankAccount from "../../models/Finance/BankAccount.js";

export const generateBankStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Fetch account with error handling
    const account = await BankAccount.findById(accountId);
    if (!account) {
      throw new Error('Bank account not found');
    }

    // Fetch all transactions for this account
    const transactions = await BankBookTransaction.find({ 
      bank_account_id: accountId 
    }).sort({ createdAt: -1 }); // newest first

    console.log('Found transactions:', transactions.length);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Disposition', 'attachment; filename="bank_statement.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // BANK STATEMENT TITLE
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text("Bank Statement", { align: "center" });
    doc.moveDown();

    // ACCOUNT HOLDER DETAILS
    doc.fontSize(12).fillColor('black').text('ACCOUNT HOLDER DETAILS', { bold: true, background: 'grey' });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Holder Name: John Doe`)
      .text(`Registered Mobile Number: +94 77 086 4011`)
      .text(`Residential Address: Sri Lanka`);
    doc.moveDown(1);

    // ACCOUNT DETAILS
    doc.fontSize(12).fillColor('black').text('ACCOUNT DETAILS', { bold: true });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Type: Savings`)
      .text(`Account Balance: ${account.balance}`)
      .text(`Total Balance: ${account.balance}`)
    doc.moveDown(1);

    // ACCOUNT STATEMENT
    doc.fontSize(12).fillColor('black').text('ACCOUNT STATEMENT');
    doc.moveDown(0.5);

    // Table Header
    doc.fontSize(10).fillColor('black');
    const tableTop = doc.y;
    const colWidths = [60, 60, 100, 60, 50, 50, 60];
    const headers = ['Txn Date', 'Value Date', 'Description', 'Ref No/Cheque No', 'Debit', 'Credit', 'Balance'];
    let x = doc.x;
    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    doc.moveDown(0.5);
    doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();

    // Table Rows
    let y = doc.y + 2;
    let runningBalance = account.balance;
    
    // Sort transactions in reverse chronological order
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedTransactions.forEach(tx => {
      // Debug log for transaction
      console.log('Processing transaction:', {
        id: tx._id,
        type: tx.transaction_type,
        amount: tx.amount,
        balance: tx.current_balance
      });

      let debit = '', credit = '';
      const formattedAmount = parseFloat(tx.amount).toFixed(2);
      
      // Explicitly handle each transaction type
      switch(tx.transaction_type) {
        case 'withdrawal':
        case 'bank_charge':
          debit = formattedAmount;
          credit = '';
          break;
        case 'deposit':
        case 'unknown_deposit':
          debit = '';
          credit = formattedAmount;
          break;
        default:
          console.log('Unknown transaction type:', tx.transaction_type);
      }
      
      x = doc.x;
      const txnDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const txnDateStr = txnDate && !isNaN(txnDate) ? 
        txnDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }) : '';
      
      // Transaction description based on type
      const description = tx.description || 
        (tx.transaction_type === 'deposit' ? 'Cash Deposit' :
         tx.transaction_type === 'withdrawal' ? 'Cash Withdrawal' :
         tx.transaction_type === 'bank_charge' ? 'Bank Charge' :
         tx.transaction_type === 'unknown_deposit' ? 'Unknown Deposit' : '');
      
      // Write row data
      doc.text(txnDateStr, x, y, { width: colWidths[0] });
      x += colWidths[0];
      doc.text(txnDateStr, x, y, { width: colWidths[1] });
      x += colWidths[1];
      doc.text(description, x, y, { width: colWidths[2] });
      x += colWidths[2];
      doc.text(tx._id.toString().slice(-6), x, y, { width: colWidths[3] }); // Use last 6 chars of transaction ID as reference
      x += colWidths[3];
      doc.text(debit, x, y, { width: colWidths[4], align: 'right' });
      x += colWidths[4];
      doc.text(credit, x, y, { width: colWidths[5], align: 'right' });
      x += colWidths[5];
      doc.text(parseFloat(tx.current_balance).toFixed(2), x, y, { width: colWidths[6], align: 'right' });
      
      // Add a line between transactions
      y += 20;
      if (y > doc.page.height - 100) {  // Check if we need a new page
        doc.addPage();
        y = 50;  // Reset Y position on new page
      }
    });
    doc.moveDown(2);

    // REWARD POINTS SUMMARY (placeholder)
    doc.fontSize(12).fillColor('black').text('REWARD POINTS SUMMARY');
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text('Savings Account number: ' + (account.accountNumber || '__________'))
      .text('Card Number: __________')
      .text('Earnings: __________')
      .text('Total Balance: ' + account.balance);
    doc.moveDown(1);

    // ACCOUNT RELATED OTHER INFO (placeholder)
    doc.fontSize(12).fillColor('black').text('ACCOUNT RELATED OTHER INFO');
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text('Account Type: Savings')
      .text('Account Number: ' + (account.accountNumber || '__________'))
      .text('MICR: __________')
      .text('IFSC: __________');

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate statement.");
  }
};
