import BankBookTransaction from "../models/BankBookTransaction.js";
import BankAccount from "../models/BankAccount.js";

// Add Transaction Logic (Deposit/Withdrawal)
export const addTransaction = async (req, res) => {
  try {
    const { accountNumber, amount, transactionType, description } = req.body;

    // Find the bank account by account number
    const bankAccount = await BankAccount.findOne({ accountNumber });
    if (!bankAccount) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    // Calculate the new balance based on the transaction type
    let newBalance;
    if (transactionType === "deposit") {
      newBalance = bankAccount.balance + amount;
    } else if (transactionType === "withdrawal") {
      if (bankAccount.balance < amount) {
        return res.status(400).json({ error: "Insufficient funds" });
      }
      newBalance = bankAccount.balance - amount;
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    // Create a new transaction record in BankBookTransaction
    const transaction = new BankBookTransaction({
      bank_account_id: bankAccount._id,
      amount,
      transaction_type: transactionType,
      description,
      current_balance: newBalance,
    });

    await transaction.save();

    // Update the bank account with the new balance
    bankAccount.balance = newBalance;
    await bankAccount.save();

    return res.status(201).json({ message: "Transaction successfully added", transaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

// PUT /api/bank-account/transaction/update/:transactionId
export const updateTransaction = async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { description } = req.body;
  
      const updatedTransaction = await BankBookTransaction.findByIdAndUpdate(
        transactionId,
        { description },
        { new: true }
      );
  
      if (!updatedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      res.json({ message: "Transaction updated", updatedTransaction });
    } catch (error) {
      console.error("Update transaction error:", error);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  };

  
  // DELETE /api/bank-account/transaction/delete/:transactionId
export const deleteTransaction = async (req, res) => {
    try {
      const { transactionId } = req.params;
  
      const deletedTransaction = await BankBookTransaction.findByIdAndDelete(transactionId);
  
      if (!deletedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      res.json({ message: "Transaction deleted", deletedTransaction });
    } catch (error) {
      console.error("Delete transaction error:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  };
  

  export const getAllTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  };
  