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
    vehicleType: {
        type: String,
        required: true,
        enum: ['Car', 'SUV', 'Van', 'Truck']
    },
    preferredBrand: {
        type: String,
        required: true,
        enum: ['Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi']
    },
    budget: {
        type: Number,
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleModel',
        required: false 
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);
export default CustomerRequest;
