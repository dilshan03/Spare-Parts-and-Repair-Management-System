import RepairRequestFormModel from "../models/RepairRequestForm.js"; // Adjust the path as needed

// Create a repair request
export const createRepairRequest = async (req, res) => {
  try {
    const {
      customerNameR,
      contactNumberR,
      emailR,
      addressR,
      vehicleRegiNumberR,
      vehicleMakeR,
      vehicleModelR,
      yearOfManufactureR,
      mileageR,
      vehicleIdentiNumberR,
      serviceTypeR,
      descripIssueR,
      prefDateAndTimeR,
      urgencyLevelR,
      paymentMethodR,
    } = req.body;

    const newRepairRequest = new RepairRequestFormModel({
      customerNameR,
      contactNumberR,
      emailR,
      addressR,
      vehicleRegiNumberR,
      vehicleMakeR,
      vehicleModelR,
      yearOfManufactureR,
      mileageR,
      vehicleIdentiNumberR,
      serviceTypeR,
      descripIssueR,
      prefDateAndTimeR,
      urgencyLevelR,
      paymentMethodR,
      vehiclePhotoR: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : null,
        
    });

    await newRepairRequest.save();
    res.status(201).json({ message: "Repair request created successfully", RepairRequest: newRepairRequest });
  } catch (error) {
    res.status(500).json({ error: "Error creating repair request", details: error.message });
  }
};

// Get all repair requests
export const getAllRepairRequests = async (req, res) => {
  try {
    const repairRequests = await RepairRequestFormModel.find({});
    res.status(200).json(repairRequests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching repair requests", details: error.message });
  }
};

 
export const getRepairRequestById = async (req, res) => {
  try {
    const id = req.params.id;
    const repairRequest = await RepairRequestFormModel.findById(id);
    if (!repairRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    // Convert image buffer to Base64 if exists
    if (repairRequest.vehiclePhotoR?.data) {
      repairRequest.vehiclePhotoR = {
        data: repairRequest.vehiclePhotoR.data.toString("base64"),
        contentType: repairRequest.vehiclePhotoR.contentType,
      };
    }

    res.status(200).json(repairRequest);
  } catch (error) {
    res.status(500).json({ error: "Error fetching repair request", details: error.message });
  }
};

//update request
export const updateRepairRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = {};

    if (req.file) {
      updateFields.vehiclePhotoR = { data: req.file.buffer, contentType: req.file.mimetype };
    }

    const fields = [
      "customerNameR",
      "contactNumberR",
      "emailR",
      "addressR",
      "vehicleRegiNumberR",
      "vehicleMakeR",
      "vehicleModelR",
      "yearOfManufactureR",
      "mileageR",
      "vehicleIdentiNumberR",
      "serviceTypeR",
      "descripIssueR",
      "prefDateAndTimeR",
      "urgencyLevelR",
      "paymentMethodR",
    ];

    fields.forEach((field) => {
      if (req.body[field]) updateFields[field] = req.body[field];
    });

    const updatedRepairRequest = await RepairRequestFormModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedRepairRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }

    res.status(200).json(updatedRepairRequest);
  } catch (error) {
    console.error("Error updating repair request:", error);
    res.status(500).json({ error: "Error updating repair request", details: error.message });
  }
};

// Delete a repair request
export const deleteRepairRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRepairRequest = await RepairRequestFormModel.findByIdAndDelete(id);
    if (!deletedRepairRequest) {
      return res.status(404).json({ message: "Repair request not found" });
    }
    res.status(200).json({ message: "Repair request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting repair request", details: error.message });
  }
};
