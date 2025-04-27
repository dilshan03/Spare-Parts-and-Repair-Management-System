import express from "express";
import {
  addBalanceSheet,
  getBalanceSheets,
  updateBalanceSheet,
  deleteBalanceSheet,
  getBalanceSheetById,
  downloadBalanceSheetPDF,
  downloadBalanceSheetByIdPDF,
} from "../../controllers/Finance/balanceSheetController.js";

import PettyCash from '../../models/Finance/PettyCash.js';
import Allocation from '../../models/Finance/PettyCashAllocation.js';


const router = express.Router();

// 📌 Add Balance Sheet
router.post("/add", addBalanceSheet);

// 📌 Get All Balance Sheets
router.get("/all", getBalanceSheets);

// 📌 Get Balance Sheet by ID (New Route)
router.get("/:id", getBalanceSheetById); // This route is for fetching a single balance sheet by its ID

// 📌 Update Balance Sheet by ID
router.put("/update/:id", updateBalanceSheet);

// 📌 Delete Balance Sheet by ID
router.delete("/delete/:id", deleteBalanceSheet);

router.get('/download/:id', downloadBalanceSheetByIdPDF);

// GET /api/balance-sheet/download/all
router.get('/download/all', downloadBalanceSheetPDF);


// POST /api/pettycash/allocate
// Create or update this month’s allocation
router.post('/allocate', async (req, res) => {
  const { month, year, amount } = req.body;
  if (!month || !year || !amount) return res.status(400).send('month, year & amount required');
  try {
    const alloc = await Allocation.findOneAndUpdate(
      { month, year },
      { amount },
      { upsert: true, new: true }
    );
    res.json(alloc);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /api/pettycash/balance?month=4&year=2025
// Returns { allocation, spent, remaining }
router.get('/balance', async (req, res) => {
  const month = parseInt(req.query.month);
  const year  = parseInt(req.query.year);
  if (!month || !year) return res.status(400).send('month & year query required');

  try {
    const allocDoc = await Allocation.findOne({ month, year });
    const allocation = allocDoc ? allocDoc.amount : 0;

    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1); // exclusive

    // sum of all petty-cash entries in this month
    const agg = await PettyCash.aggregate([
      { $match: { transactionDate: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const spent = agg.length ? agg[0].total : 0;
    const remaining = allocation - spent;

    res.json({ allocation, spent, remaining });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
