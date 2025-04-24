// routes/appointmentRoutes.js
import express from "express";
import Appointment from "../models/Appointment.js"; // Ensure the .js extension is included
import { createAppointment } from "../controllers/appointmentController.js"; // Also include .js

const router = express.Router();

// Book an appointment
router.post("/book", createAppointment);

// Fetch all appointments (For Admin)
router.get("/", async (req, res) => {
  console.log("GET /api/appointments request received");
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
});

// Update an appointment
router.put("/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error });
  }
});

// Delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
});

export default router;
