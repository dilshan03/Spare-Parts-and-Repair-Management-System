import mongoose from "mongoose";

const balanceSheetSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now }, // Automatically set date

    // 📌 Assets Breakdown
    assets: {
      currentAssets: {
        cashBankBalances: { type: Number, default: 0 },
        accountsReceivable: { type: Number, default: 0 },
        inventory: { type: Number, default: 0 },
        prepaidExpenses: { type: Number, default: 0 },
      },
      nonCurrentAssets: {
        propertyPlantEquipment: { type: Number, default: 0 },
        machineryTools: { type: Number, default: 0 },
        vehicles: { type: Number, default: 0 },
        intangibleAssets: { type: Number, default: 0 },
      },
    },

    // 📌 Liabilities Breakdown
    liabilities: {
      currentLiabilities: {
        accountsPayable: { type: Number, default: 0 },
        shortTermLoans: { type: Number, default: 0 },
        taxesPayable: { type: Number, default: 0 },
        wagesPayable: { type: Number, default: 0 },
      },
      nonCurrentLiabilities: {
        longTermLoans: { type: Number, default: 0 },
        leaseObligations: { type: Number, default: 0 },
        deferredTaxLiabilities: { type: Number, default: 0 },
      },
    },

    // 📌 Equity Breakdown
    equity: {
      ownersCapital: { type: Number, default: 0 },
      retainedEarnings: { type: Number, default: 0 },
      shareholderContributions: { type: Number, default: 0 },
    },

    description: { type: String, default: "" }, // Optional field for additional details
  },
  { timestamps: true }
);

const BalanceSheet = mongoose.model("BalanceSheet", balanceSheetSchema);
export default BalanceSheet;
