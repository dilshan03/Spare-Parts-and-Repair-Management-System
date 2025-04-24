import mongoose from 'mongoose';


const profitLossSchema = new mongoose.Schema({
    revenue: {
        type: Number,
        required: true
    },
    expenses: {
        type: Number,
        required: true
    },
    netProfit: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//const ProfitLoss = mongoose.model('ProfitLoss', profitLossSchema);
//module.exports = ProfitLoss;

export default mongoose.model("ProfitLoss", profitLossSchema);
