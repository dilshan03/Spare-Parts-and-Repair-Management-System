import express from "express";
import Appointment from "../../models/Service/Appointment.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Send confirmation email
const sendConfirmationEmail = async (email, name, date, timeSlot) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Appointment Confirmation",
      text: `Hello ${name}, your appointment is confirmed for ${date} at ${timeSlot}.`,
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Hello ${name},</p>
        <p>Your appointment has been confirmed for:</p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${timeSlot}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `
    });
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

// Create Appointment
router.post("/", async (req, res) => {
  try {
    console.log('Received appointment request:', req.body);
    
    // Create and save the appointment
    const appointment = new Appointment(req.body);
    await appointment.save();
    console.log('Appointment saved successfully');

    // Try to send the confirmation email
    try {
      await sendConfirmationEmail(req.body.email, req.body.name, req.body.date, req.body.timeSlot);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the response even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to create appointment',
      error: err.toString()
    });
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
