import BankBookTransaction from "../models/BankBookTransaction.js";
import BankAccount from "../models/BankAccount.js";

// POST /api/bank-book/:accountId/add-transaction
export const addTransactionToAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { transaction_type, amount, description } = req.body;

    // 1) Find the bank account
    const bankAccount = await BankAccount.findById(accountId);
    if (!bankAccount) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    // 2) Compute new balance
    let newBalance = bankAccount.balance;
    if (transaction_type === "deposit" || transaction_type === "unknown_deposit") {
      newBalance += amount;
    } else if (transaction_type === "withdrawal" || transaction_type === "bank_charge") {
      if (bankAccount.balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }
      newBalance -= amount;
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    // 3) Create and save the transaction
    const txn = new BankBookTransaction({
      bank_account_id: bankAccount._id,
      transaction_type,
      amount,
      description,
      current_balance: newBalance,
    });
    await txn.save();

    // 4) Update and save account balance
    bankAccount.balance = newBalance;
    await bankAccount.save();

    return res
      .status(201)
      .json({ message: "Transaction added", transaction: txn });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return res.status(500).json({ error: "Failed to add transaction" });
  }
};

// GET /api/bank-book/:accountId/transactions
export const getTransactionsByAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const txns = await BankBookTransaction.find({
      bank_account_id: accountId,
    }).sort({ createdAt: -1 }); // newest first
    return res.json(txns);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// (Optional) Other CRUD operations on transactions:
export const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { description } = req.body;

    const updated = await BankBookTransaction.findByIdAndUpdate(
      transactionId,
      { description },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    return res.json({ message: "Updated", transaction: updated });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ error: "Failed to update transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const deleted = await BankBookTransaction.findByIdAndDelete(transactionId);
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    return res.json({ message: "Deleted", transaction: deleted });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// (Optional) GET all transactions across accounts
export const getAllTransactions = async (req, res) => {
  try {
    const txns = await BankBookTransaction.find();
    return res.json(txns);
  } catch (error) {
    console.error("Error fetching all txns:", error);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
