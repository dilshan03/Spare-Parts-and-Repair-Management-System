//Product.js

import mongoose from "mongoose";

const SparePartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    picture: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, required: true, enum: ["New", "Used", "Refurbished"] },
    category: { type: String, required: true },
    reorderLevel: {type: Number} // New field for reorder level
}, { timestamps: true });

const SparePart = mongoose.model("SparePart", SparePartSchema);
export default SparePart;
