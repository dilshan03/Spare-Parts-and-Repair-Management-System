import express from "express";
import Transaction from "../../models/Finance/Transaction.js";
import financeController from "../../controllers/Finance/financeController.js";


const router = express.Router();

// 📌 Add Transaction
/*router.post("/add", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/

router.post("/add", async (req, res) => {
  try {
    //console.log("Incoming request body:", req.body); // ✅ Debugging line
    const transaction = new Transaction({
      type: req.body.type,
      amount: req.body.amount,
      description: req.body.description || "", // Ensure description is stored
      timestamp: req.body.timestamp || Date.now(),
      approved: req.body.approved || false
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 📌 Get All Transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Get Financial Reports
router.get("/reports", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSales = 0;

    transactions.forEach((txn) => {
      if (txn.type === "income") totalIncome += txn.amount;
      if (txn.type === "expense") totalExpense += txn.amount;
      if (txn.type === "sales") totalSales += txn.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      balanceSheet: { assets: totalIncome, liabilities: totalExpense, equity: balance },
      profitLoss: { revenue: totalIncome, expenses: totalExpense, profit: balance },
      bankBook: transactions,
      salesReport: { totalSales },
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating reports" });
  }
});

// DELETE request to remove a transaction by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

// 📌 Download Reports
router.get("/reports/pdf", financeController.generatePDFReport);
router.get("/reports/excel", financeController.generateExcelReport);

export default router;
