import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
