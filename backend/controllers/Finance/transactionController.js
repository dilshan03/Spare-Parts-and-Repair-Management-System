import Transaction from "../models/Transaction.js";
//const Transaction = require("../models/TransactionModel");
/*
// ✅ 1. Add Transaction (Triggered after successful payment)
const addTransaction = async (req, res) => {
  try {
    const {
      transaction_id, user_id, payment_method, amount, status, 
      reference_number, payment_type, remarks
    } = req.body;

    const newTransaction = new Transaction({
      transaction_id,
      user_id,
      payment_method,
      amount,
      status,
      reference_number,
      payment_type,
      remarks,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction recorded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving transaction", error });
  }
};*/


const addTransaction = async (req, res) => {
  try {
    console.log("Received transaction request:", req.body);

    const {
      transaction_id, user_id, payment_method, amount, status, 
      reference_number, payment_type, remarks
    } = req.body;

    if (!transaction_id || !user_id || !amount || !status || !reference_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTransaction = new Transaction({
      transaction_id,
      user_id,
      payment_method,
      amount,
      status,
      reference_number,
      payment_type,
      remarks,
    });

    await newTransaction.save();
    console.log("Transaction saved successfully!");
    res.status(201).json({ message: "Transaction recorded successfully!" });
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



// ✅ 2. Get All Transactions (For admin dashboard)
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ transaction_date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// ✅ 3. Get Transaction Summary (Total Revenue)
const getTransactionSummary = async (req, res) => {
  try {
    const totalTransactions = await Transaction.aggregate([
      { $match: { status: "Success" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    res.status(200).json({ totalRevenue: totalTransactions[0]?.totalAmount || 0 });
  } catch (error) {
    res.status(500).json({ message: "Error calculating summary", error });
  }
};


const transactionController = {
  addTransaction,
  getTransactions,
  getTransactionSummary,
};

export default transactionController;