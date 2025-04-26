import BankAccount from "../models/BankAccount.js";
import BankBookTransaction from "../models/BankBookTransaction.js";

// Create a new Bank Account
export const createBankAccount = async (req, res) => {
    try {
      const { bankName, accountNumber, initialBalance } = req.body;
  
      // Check if all required fields are provided
      if (!bankName || !accountNumber || !initialBalance) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Create a new bank account
      const newBankAccount = new BankAccount({
        bankName,
        accountNumber,
        balance: initialBalance, // Set initial balance
      });
  
      // Save the bank account to the database
      await newBankAccount.save();
  
      return res.status(201).json({
        message: 'Bank account successfully created',
        newAccount: newBankAccount,
      });
    } catch (error) {
      console.error("Error creating bank account:", error);
      return res.status(500).json({ error: 'Failed to create bank account' });
    }
  };


  // PUT /api/bank-account/update/:accountNumber
export const updateBankAccount = async (req, res) => {
    try {
      const { accountNumber } = req.params;
      const { bankName } = req.body;
  
      const updatedAccount = await BankAccount.findOneAndUpdate(
        { accountNumber },
        { bankName },
        { new: true }
      );
  
      if (!updatedAccount) {
        return res.status(404).json({ error: "Bank account not found" });
      }
  
      res.json({ message: "Bank account updated", updatedAccount });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Failed to update account" });
    }
  };

  
  // DELETE /api/bank-account/delete/:accountNumber
  export const deleteBankAccount = async (req, res) => {
    try {
      const accountNumber = req.params.accountNumber;
  
      // First, find the account
      const account = await BankAccount.findOne({ accountNumber });
      if (!account) {
        return res.status(404).json({ error: "Bank account not found" });
      }
  
      // Optionally: delete related transactions
      await BankBookTransaction.deleteMany({ bank_account_id: account._id });
  
      // Delete the account
      await BankAccount.deleteOne({ _id: account._id });
  
      res.status(200).json({ message: "Bank account and related transactions deleted successfully" });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  };


  export const getAllBankAccounts = async (req, res) => {
    try {
      const accounts = await BankAccount.find();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bank accounts" });
    }
  };
  
  
