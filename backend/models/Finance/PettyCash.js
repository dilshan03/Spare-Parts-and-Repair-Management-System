import mongoose from 'mongoose';

const pettyCashSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0 && value <= 5000;
      },
      message: 'Amount must be greater than 0 and not exceed 5000',
    },
  },
  transactionDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("PettyCash", pettyCashSchema);
