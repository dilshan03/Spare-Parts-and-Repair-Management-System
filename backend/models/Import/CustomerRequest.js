import mongoose from 'mongoose';

const customerRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    bank: {
        type: String,
        required: true,
        enum: ['HNB', 'Sampath Bank', 'Commercial Bank', 'Peoples Bank']
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleModel', // <-- Correct reference name
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);
export default CustomerRequest;
