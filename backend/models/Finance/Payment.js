import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    bankSlip: { type: String }, // Optional for bank slip uploads
    status: { type: String, default: "Processing" }, // Default status
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
