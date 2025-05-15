import mongoose from "mongoose";

const MockCardSchema = new mongoose.Schema({
    cardNumber: String,
    customerName: String,
    cvc: String,
    balance: Number
});

//module.exports = mongoose.model('MockCard', MockCardSchema);

const MockCard = mongoose.model("MockCard", MockCardSchema);

export default MockCard;