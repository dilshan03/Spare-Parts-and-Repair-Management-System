import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense", "sales"], required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

export default mongoose.model("Transaction", transactionSchema);
