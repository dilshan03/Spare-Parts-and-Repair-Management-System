import express from "express";
import Appointment from "../../models/Appointment.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Send confirmation email
const sendConfirmationEmail = async (email, name, date, timeSlot) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Appointment Confirmation",
    text: `Hello ${name}, your appointment is confirmed for ${date} at ${timeSlot}.`,
  });
};

// Create Appointment
router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    await sendConfirmationEmail(req.body.email, req.body.name, req.body.date, req.body.timeSlot);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Appointments
router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Update Appointment
router.put("/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Appointment
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
