import mongoose from "mongoose";

const BankBookTransactionSchema = new mongoose.Schema(
  {
    bank_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
    },
    transaction_type: {
      type: String,
      enum: ["deposit", "withdrawal", "bank_charge", "unknown_deposit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    current_balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BankBookTransaction", BankBookTransactionSchema);
