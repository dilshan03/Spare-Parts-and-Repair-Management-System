// models/Sale.js
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "SparePart", required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
});

const Sale = mongoose.model("Sale", SaleSchema);
export default Sale;

