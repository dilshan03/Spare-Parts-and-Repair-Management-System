import mongoose from 'mongoose';

const profitLossSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  revenue: {
    serviceIncome:    { type: Number, default: 0, min: 0 },
    sparePartsSales:  { type: Number, default: 0, min: 0 },
    otherIncome:      { type: Number, default: 0, min: 0 }
  },
  cogs: {
    partsCost:        { type: Number, default: 0, min: 0 },
    materialsCost:    { type: Number, default: 0, min: 0 }
  },
  expenses: {
    salaries:         { type: Number, default: 0, min: 0 },
    rent:             { type: Number, default: 0, min: 0 },
    utilities:        { type: Number, default: 0, min: 0 },
    maintenance:      { type: Number, default: 0, min: 0 },
    marketing:        { type: Number, default: 0, min: 0 },
    depreciation:     { type: Number, default: 0, min: 0 }
  },
  other: {
    interestIncome:   { type: Number, default: 0, min: 0 },
    interestExpense:  { type: Number, default: 0, min: 0 },
    misc:             { type: Number, default: 0, min: 0 }
  }
});

export default mongoose.model('ProfitLoss', profitLossSchema);
