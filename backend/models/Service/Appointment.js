import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true }, // Slot in the format of '9 AM', '10 AM', etc.
  status: { type: String, default: 'pending' },
});

export default mongoose.model('Appointment', appointmentSchema);
