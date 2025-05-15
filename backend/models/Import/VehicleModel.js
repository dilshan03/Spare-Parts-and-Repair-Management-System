import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true }
});

const VehicleModel = mongoose.model('VehicleModel', vehicleSchema); // <- Use 'VehicleModel'
export default VehicleModel;
