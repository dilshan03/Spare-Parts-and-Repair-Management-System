import mongoose from 'mongoose';

const bankBookTransactionSchema = new mongoose.Schema({
  bank_account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
  amount: { type: Number, required: true },
  transaction_type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  description: { type: String },
  current_balance: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
});

// Default export of the model
export default mongoose.model('BankBookTransaction', bankBookTransactionSchema);
