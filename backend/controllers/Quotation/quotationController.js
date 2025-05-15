import Quotation from '../../models/Quotation/Quotation.js';  // Make sure the .js extension is added
import { generatePDF } from '../../utils/pdfGenerator.js';  // Use import statement
import nodemailer from 'nodemailer';

// Create Quotation
export const createQuotation = async (req, res) => {
  try {
    const { customerName, customerEmail, vehicleNumber, items, repairs, discount } = req.body;

    // Calculate total amount
    const itemsTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const repairsTotal = repairs.reduce((sum, repair) => sum + repair.price, 0);
    const totalAmount = itemsTotal + repairsTotal - discount;

    // Create new quotation
    const quotation = new Quotation({
      customerName,
      customerEmail,
      vehicleNumber,
      items,
      repairs,
      discount,
      totalAmount,
      status: 'pending', // Set initial status to 'pending'
    });

    // Save to database
    await quotation.save();

    // Return the created quotation
    res.status(201).json(quotation);
  } catch (err) {
    console.error('Error creating quotation:', err); // Log the error
    res.status(400).json({ error: err.message });
  }
};

// Get all quotations
export const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.status(200).json(quotations);
  } catch (err) {
    console.error('Error fetching quotations:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Get a specific quotation by ID
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    res.status(200).json(quotation);
  } catch (err) {
    console.error('Error fetching quotation by ID:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Delete a quotation by ID
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    console.error('Error deleting quotation:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Send Quotation Email
export const sendQuotationEmail = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(quotation);

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: quotation.customerEmail,
      subject: 'Your Quotation',
      text: 'Please find your quotation attached.',
      attachments: [
        {
          filename: 'quotation.pdf',
          content: pdfBuffer,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// Update status of a quotation (Pending -> Accepted/Rejected)
export const updateQuotationStatus = async (req, res) => {
  const { id } = req.params; // Get the quotation ID from the URL parameters
  const { status } = req.body; // Get the status from the request body

  // Validate that the status is either "Accepted" or "Rejected"
  if (!['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Status must be "Accepted" or "Rejected".' });
  }

  try {
    // Find the quotation by ID and update its status
    const updatedQuotation = await Quotation.findByIdAndUpdate(
      id,
      { status }, // Set the new status
      { new: true } // Return the updated document
    );

    // If quotation is not found, return an error
    if (!updatedQuotation) {
      return res.status(404).json({ message: 'Quotation not found.' });
    }

    // Return the updated quotation
    res.status(200).json(updatedQuotation);
  } catch (err) {
    console.error('Error updating quotation status:', err); // Log the error
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};
