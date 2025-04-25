

import Repair from "../../models/Repair/Repair.js";
import RepairRequestFormModel from "../../models/Repair/RepairRequestForm.js"; // Adjust the path as needed
import nodemailer from "nodemailer"; 


// Create repairs for all repair request forms
export const createRepairsForAllRequestForms = async (req, res) => {
  try {
    // Fetch all repair request forms
    const repairRequestForms = await RepairRequestFormModel.find();

    // Create repairs for each repair request form
    const createdRepairs = [];
    for (const form of repairRequestForms) {
      // Check if a repair already exists for this form
      const existingRepair = await Repair.findOne({ requestFormId: form._id });

      // If no repair exists, create a new one
      if (!existingRepair) {
        const newRepair = new Repair({
          requestFormId: form._id,
          repairCompleteStatus: "Pending", // Default status
          paymentStatus: "Pending", // Default status
        });

        await newRepair.save();
        createdRepairs.push(newRepair);
      }
    }

    res.status(201).json(createdRepairs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Create a new repair
export const createRepair = async (req, res) => {
  try {
    const { requestFormId } = req.body;

    // Validate required fields
    if (!requestFormId) {
      return res.status(400).json({ message: "Request Form ID is required" });
    }

    // Check if the RepairRequestForm exists
    const requestForm = await RepairRequestFormModel.findById(requestFormId);
    if (!requestForm) {
      return res.status(404).json({ message: "Repair Request Form not found" });
    }

    // Create a new Repair document
    const newRepair = new Repair({
      requestFormId,
      repairCompleteStatus: "Pending", // Default status
      paymentStatus: "Pending", // Default status
    });

    // Save the new Repair document
    await newRepair.save();

    res.status(201).json(newRepair);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all repairs
export const getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find().populate("requestFormId");
    console.log(repairs)
    res.status(200).json(repairs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a repair by ID
export const getRepairById = async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id).populate("requestFormId");
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }
    res.status(200).json(repair);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a repair by ID
export const updateRepair = async (req, res) => {
  try {
    const { repairCompleteStatus, paymentStatus, completedAt } = req.body;

    const repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    if (repairCompleteStatus) {
      repair.repairCompleteStatus = repairCompleteStatus;
      // Update completedAt when status changes to Completed
      if (repairCompleteStatus === "Completed") {
        repair.completedAt = completedAt || new Date();
      } else {
        repair.completedAt = null; // Reset if not completed
      }
    }
    if (paymentStatus) repair.paymentStatus = paymentStatus;

    await repair.save();
    res.status(200).json(repair);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a repair by ID
export const deleteRepair = async (req, res) => {
  try {
    const repair = await Repair.findByIdAndDelete(req.params.id);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }
    res.status(200).json({ message: "Repair deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//send email to customer when repair is completed
export const sendRepairCompletedEmail = async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id).populate("requestFormId");

    if (!repair || !repair.requestFormId?.customerEmail) {
      return res.status(404).json({ message: "Customer email not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: repair.requestFormId.customerEmail,
      subject: "Repair Completed",
      text: `Hello ${repair.requestFormId.customerNameR},

Your vehicle repair has been successfully completed. You can now collect your vehicle.

Thank you for choosing us!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};