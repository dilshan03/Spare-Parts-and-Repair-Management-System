import mongoose from 'mongoose';


const bankBookSchema = new mongoose.Schema({
    transactionDate: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    depositAmount: {
        type: Number,
        default: 0
    },
    withdrawalAmount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        required: true
    }
});

//const BankBook = mongoose.model('BankBook', bankBookSchema);
//module.exports = BankBook;

export default mongoose.model("BankBook", bankBookSchema);
