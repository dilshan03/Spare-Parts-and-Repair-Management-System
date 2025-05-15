import Appointment from '../../models/Appointment.js';
import nodemailer from 'nodemailer';

// Function to send appointment confirmation email
const sendConfirmationEmail = (email, name, date, slot) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'esandidesilva20@gmail.com', // Replace with your email
      pass: 'rxgp pxum dppn zhjw'   // Replace with your email password
    }
  });

  const mailOptions = {
    from: 'esandidesilva20@gmail.com',
    to: email,
    subject: 'Appointment Confirmation',
    text: `Dear ${name},\nYour appointment for ${date} at ${slot} has been confirmed.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Create an appointment
const createAppointment = async (req, res) => {
  const { name, email, phone, vehicleNumber, date, slot } = req.body;

  // Validate that the selected date is not in the past and is within a week
  const today = new Date();
  const selectedDate = new Date(date);
  if (selectedDate < today) {
    return res.status(400).json({ message: 'Date cannot be in the past.' });
  }
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);
  if (selectedDate > weekFromNow) {
    return res.status(400).json({ message: 'Date must be within a week.' });
  }

  // Check if the selected slot is available
  const existingAppointment = await Appointment.findOne({ date: selectedDate, slot });
  if (existingAppointment) {
    return res.status(400).json({ message: 'Slot is already booked.' });
  }

  const appointment = new Appointment({
    name,
    email,
    phone,
    vehicleNumber,
    date: selectedDate,
    slot,
  });

  try {
    await appointment.save();
    sendConfirmationEmail(email, name, date, slot);
    return res.status(201).json({ message: 'Appointment booked successfully!' });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating appointment.', error: err });
  }
};

export { createAppointment };
