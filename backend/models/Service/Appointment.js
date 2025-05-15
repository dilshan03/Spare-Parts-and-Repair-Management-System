import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  vehicleNumber: String,
  serviceType: String,
  date: String,
  timeSlot: String,
});

export default mongoose.model("Appointment", appointmentSchema);
