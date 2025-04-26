import express from 'express';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import ProfitLoss from '../models/ProfitLoss.js';

const router = express.Router();

// ─── Create a new P&L entry ───────────────────────────────────────────────────
router.post('/add', async (req, res) => {
  try {
    const { date, description, revenue, cogs, expenses, other } = req.body;
    if (!date) return res.status(400).send('Date is required.');
    const entry = new ProfitLoss({
      date: new Date(date),
      description: description || '',
      revenue, cogs, expenses, other
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).send('Error creating entry: ' + err.message);
  }
});

// ─── Get all entries (newest first) ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const entries = await ProfitLoss.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).send('Error fetching entries: ' + err.message);
  }
});

// ─── Update an entry ─────────────────────────────────────────────────────────
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await ProfitLoss.findByIdAndUpdate(
      req.params.id,
      { ...req.body, date: new Date(req.body.date) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).send('Error updating entry: ' + err.message);
  }
});

// ─── Delete an entry ─────────────────────────────────────────────────────────
router.delete('/delete/:id', async (req, res) => {
  try {
    await ProfitLoss.findByIdAndDelete(req.params.id);
    res.send('Entry deleted');
  } catch (err) {
    res.status(500).send('Error deleting entry: ' + err.message);
  }
});

// ─── Monthly summary ─────────────────────────────────────────────────────────
// Returns sums of each category + computed metrics:
//   totalRevenue, totalCOGS, grossProfit,
//   totalOperatingExpenses, operatingProfit,
//   netOther, netProfit
router.get('/monthly', async (req, res) => {
  try {
    const month = parseInt(req.query.month, 10);
    const year  = parseInt(req.query.year, 10);
    if (!month || !year) return res.status(400).send('month and year required');

    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);

    const [agg] = await ProfitLoss.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: {
          _id: null,
          serviceIncome:    { $sum: '$revenue.serviceIncome' },
          sparePartsSales:  { $sum: '$revenue.sparePartsSales' },
          otherIncome:      { $sum: '$revenue.otherIncome' },
          partsCost:        { $sum: '$cogs.partsCost' },
          materialsCost:    { $sum: '$cogs.materialsCost' },
          salaries:         { $sum: '$expenses.salaries' },
          rent:             { $sum: '$expenses.rent' },
          utilities:        { $sum: '$expenses.utilities' },
          maintenance:      { $sum: '$expenses.maintenance' },
          marketing:        { $sum: '$expenses.marketing' },
          depreciation:     { $sum: '$expenses.depreciation' },
          interestIncome:   { $sum: '$other.interestIncome' },
          interestExpense:  { $sum: '$other.interestExpense' },
          misc:             { $sum: '$other.misc' }
      }}
    ]);

    const data = agg || {};
    const totalRevenue = (data.serviceIncome||0) + (data.sparePartsSales||0) + (data.otherIncome||0);
    const totalCOGS    = (data.partsCost||0)     + (data.materialsCost||0);
    const grossProfit  = totalRevenue - totalCOGS;
    const totalOpEx    = (data.salaries||0) + (data.rent||0) + (data.utilities||0)
                       + (data.maintenance||0) + (data.marketing||0) + (data.depreciation||0);
    const operatingProfit = grossProfit - totalOpEx;
    const netOther     = (data.interestIncome||0) - (data.interestExpense||0) + (data.misc||0);
    const netProfit    = operatingProfit + netOther;

    res.json({
      ...data,
      totalRevenue,
      totalCOGS,
      grossProfit,
      totalOperatingExpenses: totalOpEx,
      operatingProfit,
      netOther,
      netProfit
    });
  } catch (err) {
    res.status(500).send('Error computing summary: ' + err.message);
  }
});

// Route to generate profit & loss report
router.get('/generate-report', async (req, res) => {
  try {
    const entries = await ProfitLoss.find().sort({ date: -1 });
    if (!entries.length) {
      return res.status(400).json({ message: 'No profit & loss entries found.' });
    }

    // ── Setup PDF ──────────────────────────────────────────────────────────────
    const margin    = 50;
    const doc       = new PDFDocument({ margin });
    const pageWidth = doc.page.width;
    const usableW   = pageWidth - margin * 2;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=profit_loss_report.pdf');
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
    doc.fontSize(16).text("Profit & Loss Statement", { align: "center", underline: true });
    doc.moveDown(2);

    // ── Table layout ───────────────────────────────────────────────────────────
    // Define fixed widths
    const dateW    = 60;
    const numColsW = 60 * 5;          // Revenue, COGS, Expenses, Other, Net
    const descW    = usableW - dateW - numColsW;

    // Calculate X positions
    const cols = {
      date:        margin,
      description: margin + dateW,
      revenue:     margin + dateW + descW,
      cogs:        margin + dateW + descW + 60,
      expenses:    margin + dateW + descW + 120,
      other:       margin + dateW + descW + 180,
      net:         margin + dateW + descW + 240
    };

    // Header
    let y = doc.y;
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Date',        cols.date,        y)
      .text('Description', cols.description, y, { width: descW })
      .text('Revenue',     cols.revenue,     y, { width: 60, align: 'right' })
      .text('COGS',        cols.cogs,        y, { width: 60, align: 'right' })
      .text('Expenses',    cols.expenses,    y, { width: 60, align: 'right' })
      .text('Other',       cols.other,       y, { width: 60, align: 'right' })
      .text('Net Profit',  cols.net,         y, { width: 60, align: 'right' })
      .moveTo(margin, y + 15)
      .lineTo(margin + usableW, y + 15)
      .stroke();

    // Rows
    doc.font('Helvetica').fontSize(10);
    y += 25;
    for (const e of entries) {
      if (y > doc.page.height - margin - 50) {
        doc.addPage();
        y = margin;
      }

      const revTotal = e.revenue.serviceIncome + e.revenue.sparePartsSales + e.revenue.otherIncome;
      const cogsTotal= e.cogs.partsCost + e.cogs.materialsCost;
      const expTotal = Object.values(e.expenses).reduce((a,b)=>a+b,0);
      const otherNet = e.other.interestIncome - e.other.interestExpense + e.other.misc;
      const netProfit= revTotal - cogsTotal - expTotal + otherNet;

      doc
        .text(new Date(e.date).toLocaleDateString(),       cols.date,        y, { width: dateW })
        .text(e.description,                                cols.description, y, { width: descW, ellipsis: true })
        .text(revTotal.toFixed(2),                         cols.revenue,     y, { width: 60, align: 'right' })
        .text(cogsTotal.toFixed(2),                        cols.cogs,        y, { width: 60, align: 'right' })
        .text(expTotal.toFixed(2),                         cols.expenses,    y, { width: 60, align: 'right' })
        .text(otherNet.toFixed(2),                         cols.other,       y, { width: 60, align: 'right' })
        .text(netProfit.toFixed(2),                        cols.net,         y, { width: 60, align: 'right' });

      y += 20;
    }

    // Footer & finalize
    doc.moveDown(4);

    // Signature
    doc.text("Authorized Signature: ");
    doc.moveDown(1);
    doc.text("_________");
    doc.moveDown(2);
    doc.text("Generated on: " + new Date().toLocaleString(), { align: "right" });

    doc.end();
  } catch (err) {
    console.error('❌ PDF generation error:', err);
    // cannot res.json here once piping, so just abort
  }
});


export default router;
