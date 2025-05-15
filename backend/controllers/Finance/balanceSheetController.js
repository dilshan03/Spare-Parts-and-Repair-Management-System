import PDFDocument from 'pdfkit';
import fs from 'fs';
import BalanceSheet from '../../models/Finance/BalanceSheet.js';

// Helper function for currency formatting
function formatCurrency(value) {
  if (typeof value !== 'number') return value;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace('LKR', 'LKR ');
}

// 📌 Generate and Download Balance Sheet PDF (Enhanced Design)
export const downloadBalanceSheetPDF = async (req, res) => {
  try {
    const balanceSheets = await BalanceSheet.find();

    if (!balanceSheets.length) {
      return res.status(404).json({ message: "No balance sheets found" });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: 'Balance Sheet Report',
        Author: 'Cosmo Exports Lanka (PVT) LTD',
        Subject: 'Financial Statement'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=balance-sheets.pdf');
    doc.pipe(res);

    // Color Scheme
    const primaryColor = '#2c3e50';
    const secondaryColor = '#3498db';
    const lightGray = '#f5f5f5';
    const darkGray = '#333333';
    const white = '#ffffff';

    // Header with Logo
    doc.rect(0, 0, doc.page.width, 120)
      .fill(primaryColor);

    const logoPath = 'images/logo.jpg';
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
      .text("BALANCE SHEET REPORT", { align: "center" })
      .moveDown(2);

    // Reset to normal colors
    doc.fillColor(darkGray).strokeColor(darkGray);

    // Loop Through Balance Sheets
    balanceSheets.forEach((sheet, index) => {
      if (index > 0) {
        doc.addPage();
        doc.fillColor(darkGray);
      }

      // Balance Sheet Header
      doc.rect(40, doc.y, doc.page.width - 80, 25)
        .fill(secondaryColor);
      
      doc.fillColor(white)
        .fontSize(14)
        .text(`Balance Sheet #${index + 1}`, 50, doc.y + 5)
        .fillColor(darkGray)
        .moveDown(2);

      // Assets Section
      doc.rect(40, doc.y, doc.page.width - 80, 20)
        .fill(lightGray);
      
      doc.fillColor(darkGray)
        .fontSize(12)
        .text("ASSETS", 50, doc.y + 5)
        .moveDown(1.5);

      // Current Assets
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .text("Current Assets:")
        .fillColor(darkGray);

      const ca = sheet.assets.currentAssets || {};
      doc.fontSize(10)
        .text(`• Cash & Bank Balances: ${formatCurrency(ca.cashBankBalances)}`, { indent: 20 })
        .text(`• Accounts Receivable: ${formatCurrency(ca.accountsReceivable)}`, { indent: 20 })
        .text(`• Inventory: ${formatCurrency(ca.inventory)}`, { indent: 20 })
        .text(`• Prepaid Expenses: ${formatCurrency(ca.prepaidExpenses)}`, { indent: 20 })
        .moveDown();

      // Non-Current Assets
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .text("Non-Current Assets:")
        .fillColor(darkGray);

      const nca = sheet.assets.nonCurrentAssets || {};
      doc.fontSize(10)
        .text(`• Property, Plant & Equipment: ${formatCurrency(nca.propertyPlantEquipment)}`, { indent: 20 })
        .text(`• Machinery & Tools: ${formatCurrency(nca.machineryTools)}`, { indent: 20 })
        .text(`• Vehicles: ${formatCurrency(nca.vehicles)}`, { indent: 20 })
        .text(`• Intangible Assets: ${formatCurrency(nca.intangibleAssets)}`, { indent: 20 })
        .moveDown(1.5);

      // Liabilities Section
      doc.rect(40, doc.y, doc.page.width - 80, 20)
        .fill(lightGray);
      
      doc.fillColor(darkGray)
        .fontSize(12)
        .text("LIABILITIES", 50, doc.y + 5)
        .moveDown(1.5);

      // Current Liabilities
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .text("Current Liabilities:")
        .fillColor(darkGray);

      const cl = sheet.liabilities.currentLiabilities || {};
      doc.fontSize(10)
        .text(`• Accounts Payable: ${formatCurrency(cl.accountsPayable)}`, { indent: 20 })
        .text(`• Short-Term Loans: ${formatCurrency(cl.shortTermLoans)}`, { indent: 20 })
        .text(`• Taxes Payable: ${formatCurrency(cl.taxesPayable)}`, { indent: 20 })
        .text(`• Wages Payable: ${formatCurrency(cl.wagesPayable)}`, { indent: 20 })
        .moveDown();

      // Non-Current Liabilities
      doc.fontSize(11)
        .fillColor(secondaryColor)
        .text("Non-Current Liabilities:")
        .fillColor(darkGray);

      const ncl = sheet.liabilities.nonCurrentLiabilities || {};
      doc.fontSize(10)
        .text(`• Long-Term Loans: ${formatCurrency(ncl.longTermLoans)}`, { indent: 20 })
        .text(`• Lease Obligations: ${formatCurrency(ncl.leaseObligations)}`, { indent: 20 })
        .text(`• Deferred Tax Liabilities: ${formatCurrency(ncl.deferredTaxLiabilities)}`, { indent: 20 })
        .moveDown(1.5);

      // Equity Section
      doc.rect(40, doc.y, doc.page.width - 80, 20)
        .fill(lightGray);
      
      doc.fillColor(darkGray)
        .fontSize(12)
        .text("EQUITY", 50, doc.y + 5)
        .moveDown(1.5);

      const eq = sheet.equity || {};
      doc.fontSize(10)
        .text(`• Owner's Capital: ${formatCurrency(eq.ownersCapital)}`, { indent: 20 })
        .text(`• Retained Earnings: ${formatCurrency(eq.retainedEarnings)}`, { indent: 20 })
        .text(`• Shareholder Contributions: ${formatCurrency(eq.shareholderContributions)}`, { indent: 20 })
        .moveDown(1.5);

      // Description
      if (sheet.description) {
        doc.rect(40, doc.y, doc.page.width - 80, 20)
          .fill(lightGray);
        
        doc.fillColor(darkGray)
          .fontSize(12)
          .text("NOTES", 50, doc.y + 5)
          .moveDown(1.5);

        doc.fontSize(10)
          .text(sheet.description, { indent: 20, align: 'justify' })
          .moveDown();
      }
    });

    // Footer
    doc.fontSize(10)
      .fillColor(darkGray)
      .text(`Generated on ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50)
      .text("Authorized Signature: ______________", doc.page.width - 200, doc.page.height - 50, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "❌ Error generating PDF report", error: error.message });
  }
};

// 📌 Generate PDF for a specific Balance Sheet by ID (Enhanced Design)
export const downloadBalanceSheetByIdPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const sheet = await BalanceSheet.findById(id);

    if (!sheet) {
      return res.status(404).json({ message: "❌ Balance Sheet not found" });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: 'Balance Sheet Report',
        Author: 'Cosmo Exports Lanka (PVT) LTD',
        Subject: 'Financial Statement'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=balance-sheet-${id}.pdf`);
    doc.pipe(res);

    // Color Scheme
    const primaryColor = '#2c3e50';
    const secondaryColor = '#3498db';
    const lightGray = '#f5f5f5';
    const darkGray = '#333333';
    const white = '#ffffff';

    // Header with Logo
    doc.rect(0, 0, doc.page.width, 120)
      .fill(primaryColor);

    const logoPath = 'images/logo.jpg';
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
      .text("BALANCE SHEET REPORT", { align: "center" })
      .moveDown(2);

    // Reset to normal colors
    doc.fillColor(darkGray).strokeColor(darkGray);

    // Balance Sheet Header
    doc.rect(40, doc.y, doc.page.width - 80, 25)
      .fill(secondaryColor);
    
    doc.fillColor(white)
      .fontSize(14)
      .text(`Balance Sheet - ${sheet.description}`, 50, doc.y + 5)
      .fillColor(darkGray)
      .moveDown(2);

    // Assets Section
    doc.rect(40, doc.y, doc.page.width - 80, 20)
      .fill(lightGray);
    
    doc.fillColor(darkGray)
      .fontSize(12)
      .text("ASSETS", 50, doc.y + 5)
      .moveDown(1.5);

    // Current Assets
    doc.fontSize(11)
      .fillColor(secondaryColor)
      .text("Current Assets:")
      .fillColor(darkGray);

    const ca = sheet.assets.currentAssets || {};
    doc.fontSize(10)
      .text(`• Cash & Bank Balances: ${formatCurrency(ca.cashBankBalances)}`, { indent: 20 })
      .text(`• Accounts Receivable: ${formatCurrency(ca.accountsReceivable)}`, { indent: 20 })
      .text(`• Inventory: ${formatCurrency(ca.inventory)}`, { indent: 20 })
      .text(`• Prepaid Expenses: ${formatCurrency(ca.prepaidExpenses)}`, { indent: 20 })
      .moveDown();

    // Non-Current Assets
    doc.fontSize(11)
      .fillColor(secondaryColor)
      .text("Non-Current Assets:")
      .fillColor(darkGray);

    const nca = sheet.assets.nonCurrentAssets || {};
    doc.fontSize(10)
      .text(`• Property, Plant & Equipment: ${formatCurrency(nca.propertyPlantEquipment)}`, { indent: 20 })
      .text(`• Machinery & Tools: ${formatCurrency(nca.machineryTools)}`, { indent: 20 })
      .text(`• Vehicles: ${formatCurrency(nca.vehicles)}`, { indent: 20 })
      .text(`• Intangible Assets: ${formatCurrency(nca.intangibleAssets)}`, { indent: 20 })
      .moveDown(1.5);

    // Liabilities Section
    doc.rect(40, doc.y, doc.page.width - 80, 20)
      .fill(lightGray);
    
    doc.fillColor(darkGray)
      .fontSize(12)
      .text("LIABILITIES", 50, doc.y + 5)
      .moveDown(1.5);

    // Current Liabilities
    doc.fontSize(11)
      .fillColor(secondaryColor)
      .text("Current Liabilities:")
      .fillColor(darkGray);

    const cl = sheet.liabilities.currentLiabilities || {};
    doc.fontSize(10)
      .text(`• Accounts Payable: ${formatCurrency(cl.accountsPayable)}`, { indent: 20 })
      .text(`• Short-Term Loans: ${formatCurrency(cl.shortTermLoans)}`, { indent: 20 })
      .text(`• Taxes Payable: ${formatCurrency(cl.taxesPayable)}`, { indent: 20 })
      .text(`• Wages Payable: ${formatCurrency(cl.wagesPayable)}`, { indent: 20 })
      .moveDown();

    // Non-Current Liabilities
    doc.fontSize(11)
      .fillColor(secondaryColor)
      .text("Non-Current Liabilities:")
      .fillColor(darkGray);

    const ncl = sheet.liabilities.nonCurrentLiabilities || {};
    doc.fontSize(10)
      .text(`• Long-Term Loans: ${formatCurrency(ncl.longTermLoans)}`, { indent: 20 })
      .text(`• Lease Obligations: ${formatCurrency(ncl.leaseObligations)}`, { indent: 20 })
      .text(`• Deferred Tax Liabilities: ${formatCurrency(ncl.deferredTaxLiabilities)}`, { indent: 20 })
      .moveDown(1.5);

    // Equity Section
    doc.rect(40, doc.y, doc.page.width - 80, 20)
      .fill(lightGray);
    
    doc.fillColor(darkGray)
      .fontSize(12)
      .text("EQUITY", 50, doc.y + 5)
      .moveDown(1.5);

    const eq = sheet.equity || {};
    doc.fontSize(10)
      .text(`• Owner's Capital: ${formatCurrency(eq.ownersCapital)}`, { indent: 20 })
      .text(`• Retained Earnings: ${formatCurrency(eq.retainedEarnings)}`, { indent: 20 })
      .text(`• Shareholder Contributions: ${formatCurrency(eq.shareholderContributions)}`, { indent: 20 })
      .moveDown(1.5);

    // Description
    if (sheet.description) {
      doc.rect(40, doc.y, doc.page.width - 80, 20)
        .fill(lightGray);
      
      doc.fillColor(darkGray)
        .fontSize(12)
        .text("NOTES", 50, doc.y + 5)
        .moveDown(1.5);

      doc.fontSize(10)
        .text(sheet.description, { indent: 20, align: 'justify' })
        .moveDown();
    }

    // Footer
    doc.fontSize(10)
      .fillColor(darkGray)
      .text(`Generated on ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50)
      .text("Authorized Signature: ______________", doc.page.width - 200, doc.page.height - 50, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "❌ Error generating PDF report", error: error.message });
  }
};

// 📌 Add Balance Sheet Entry
export const addBalanceSheet = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    const { assets, liabilities, equity, description } = req.body;

    if (!assets || !liabilities || !equity) {
      return res.status(400).json({ message: "All fields must be provided." });
    }

    const newBalanceSheet = new BalanceSheet({
      assets,
      liabilities,
      equity,
      description,
    });

    await newBalanceSheet.save();
    res.status(201).json({
      message: "✅ Balance Sheet Added Successfully",
      balanceSheet: newBalanceSheet,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
};

// 📌 Get All Balance Sheets
export const getBalanceSheets = async (req, res) => {
  try {
    const balanceSheets = await BalanceSheet.find();
    res.status(200).json(balanceSheets);
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
};

// 📌 Get Balance Sheet by ID
export const getBalanceSheetById = async (req, res) => {
  const { id } = req.params;
  try {
    const balanceSheet = await BalanceSheet.findById(id);
    if (!balanceSheet) {
      return res.status(404).json({ message: "❌ Balance Sheet not found" });
    }
    res.status(200).json(balanceSheet);
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
};

// 📌 Update Balance Sheet by ID
export const updateBalanceSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedBalanceSheet = await BalanceSheet.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBalanceSheet) {
      return res.status(404).json({ message: "❌ Balance Sheet Not Found" });
    }

    res.status(200).json({ message: "✅ Balance Sheet Updated", updatedBalanceSheet });
  } catch (error) {
    res.status(500).json({ message: "❌ Error Updating Balance Sheet", error: error.message });
  }
};

// 📌 Delete Balance Sheet by ID
export const deleteBalanceSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const sheet = await BalanceSheet.findById(id);

    if (!sheet) {
      return res.status(404).json({ message: "❌ Balance Sheet not found" });
    }

    await BalanceSheet.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Balance Sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting balance sheet:", error);
    res.status(500).json({ message: "❌ Error deleting balance sheet", error: error.message });
  }
};