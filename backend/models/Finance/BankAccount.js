import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,  // Ensure account numbers are unique
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

export default BankAccount;
