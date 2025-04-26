// models/PettyCashAllocation.js
import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  month: { type: Number, required: true },    // 1–12
  year:  { type: Number, required: true },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// ensure one allocation per month/year
allocationSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model('PettyCashAllocation', allocationSchema);
