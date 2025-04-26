import express from 'express';
import PDFDocument from 'pdfkit';
import PettyCash from '../models/PettyCash.js';

const router = express.Router();

// Route to add a new petty cash entry
router.post('/add', async (req, res) => {
  try {
    const { description, amount, transactionDate } = req.body;

    // Basic validation
    if (!description || !amount || !transactionDate) {
      return res.status(400).send("All fields are required.");
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0 || amountNum > 5000) {
      return res.status(400).send("Amount must be greater than 0 and ≤ 5000.");
    }

    const date = new Date(transactionDate);
    const today = new Date();
    if (date > today) {
      return res.status(400).send("Future dates are not allowed.");
    }

    const newEntry = new PettyCash({
      description,
      amount: amountNum,
      transactionDate: date,
    });

    await newEntry.save();
    res.status(201).send('Petty Cash Entry Added');
  } catch (error) {
    res.status(500).send('Error adding petty cash entry: ' + error.message);
  }
});

// Route to get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await PettyCash.find().sort({ transactionDate: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).send('Error fetching entries: ' + error.message);
  }
});

// Update route
router.put('/update/:id', async (req, res) => {
    try {
        const { description, amount, transactionDate } = req.body;
        const updatedPettyCash = await PettyCash.findByIdAndUpdate(
            req.params.id,
            { description, amount, transactionDate },
            { new: true }
        );
        res.status(200).send('Petty Cash Entry Updated');
    } catch (error) {
        res.status(500).send('Error updating petty cash entry: ' + error.message);
    }
});

// Delete route
router.delete('/delete/:id', async (req, res) => {
    try {
        await PettyCash.findByIdAndDelete(req.params.id);
        res.status(200).send('Petty Cash Entry Deleted');
    } catch (error) {
        res.status(500).send('Error deleting petty cash entry: ' + error.message);
    }
});

// Route to generate petty cash report
router.get('/generate-report', async (req, res) => {
  try {
    const pettyCashEntries = await PettyCash.find();

    if (!pettyCashEntries || pettyCashEntries.length === 0) {
      return res.status(400).json({ message: "No petty cash entries found." });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=petty_cash_report.pdf');

    doc.pipe(res); // Pipe the document to the response

    // Add Logo
    const logoPath = "images/logo.jpg"; // Adjust the path based on your project structure
    doc.image(logoPath, 50, 50, { width: 100 });

    // Add Letterhead
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);

    // Report Title
    doc.fontSize(16).text("Petty Cash Report", { align: "center", underline: true });
    doc.moveDown(2);

    // Table Headers
    const startX = 60;
    let startY = doc.y;

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Date & Time", startX, startY);
    doc.text("Description", startX + 120, startY);
    doc.text("Amount", startX + 320, startY);
    doc.moveTo(startX, startY + 15).lineTo(550, startY + 15).stroke();

    // Reset font for data
    doc.font("Helvetica");
    startY += 25;

    // Add Petty Cash Entries with Fixed Alignment
    pettyCashEntries.forEach(entry => {
      // Use `toLocaleString()` to include both date and time
      doc.text(new Date(entry.transactionDate).toLocaleString(), startX, startY);
      doc.text(entry.description, startX + 120, startY, { width: 180, ellipsis: true });
      doc.text(`LKR ${entry.amount.toFixed(2)}`, startX + 320, startY);

      startY += 20; // Ensure consistent row height
      if (startY > 750) {
        doc.addPage();
        startY = 50; // Reset Y position on new page
      }
    });

    doc.moveDown(4);

    // Signature
    doc.text("Authorized Signature: ____________________", { align: "right" });

    doc.end(); // Finalize the PDF document

  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Error generating the report.", error: err.message });
  }
});

export default router;
