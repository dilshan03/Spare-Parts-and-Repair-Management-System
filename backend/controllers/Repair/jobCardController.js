import JobCard from "../../models/Repair/JobCard.js";
import Repair from "../../models/Repair/Repair.js";
import User from "../../models/HR/UserModel.js";

//create job card
export const createJobCard = async (req, res) => {
  const { repairId, assignedMechanic, jobs } = req.body;

  try {
    console.log("Request Body:", req.body); // Log the request body

    // Validate required fields
    if (!repairId || !assignedMechanic || !jobs) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the repair exists
    const repair = await Repair.findById(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // Check if the assigned mechanic exists
    const mechanic = await User.findById(assignedMechanic);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    // Validate the jobs array
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ message: "Jobs must be a non-empty array" });
    }

    // Create the JobCard
    const jobCard = new JobCard({
      repairId,
      assignedMechanic,
      jobs,
    });

    // Save the JobCard
    await jobCard.save();

    // Add the JobCard to the Repair's jobCards array
    repair.jobCards.push(jobCard._id);
    await repair.save();

    res.status(201).json({ message: "JobCard created successfully", jobCard });
  } catch (error) {
    console.error("Error creating JobCard:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get all job cards
export const getAllJobCards = async (req, res) => {
  try {
    // Fetch all job cards and populate related fields (repairId and assignedMechanic)
    const jobCards = await JobCard.find()
      .populate({
        path: "repairId",
        populate: {
          path: "requestFormId", // this is inside the repair document
        },
      })
      .populate("assignedMechanic");
      // .populate("requestFormId");
      console.log(jobCards)

    res.status(200).json(jobCards);
  } catch (error) {
    console.error("Error fetching job cards:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get job card by ID
export const getJobCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobCard = await JobCard.findById(id)
    .populate({
      path: "repairId",
      populate: {
        path: "requestFormId", // this is inside the repair document
      },
    })
    .populate('assignedMechanic');
    
    if (!jobCard) {
      return res.status(404).json({ message: 'Job card not found' });
    }
    
    res.status(200).json(jobCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 

// // Update Job Card
// export const updateJobCard = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       assignedMechanic,
//       jobs,
//       completedAt,
//     } = req.body;

//     const updatedJobCard = await JobCard.findByIdAndUpdate(
//       id,
//       {
//         ...(assignedMechanic && { assignedMechanic }),
//         ...(jobs && { jobs }),
//         ...(completedAt && { completedAt }),
//       },
//       { new: true }
//     ).populate("repairId").populate("assignedMechanic");

//     if (!updatedJobCard) {
//       return res.status(404).json({ message: "Job Card not found" });
//     }

//     res.status(200).json(updatedJobCard);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// Update Job Card - Modified to handle jobs array updates
export const updateJobCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobs, assignedMechanic, completedAt } = req.body;

    // Find the existing job card
    const jobCard = await JobCard.findById(id);
    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    // Update fields if they exist in the request
    if (jobs) jobCard.jobs = jobs;
    if (assignedMechanic) jobCard.assignedMechanic = assignedMechanic;
    if (completedAt) jobCard.completedAt = completedAt;

    // Save the updated job card
    const updatedJobCard = await jobCard.save();

    // Populate the referenced fields
    await updatedJobCard.populate([
      {
        path: "repairId",
        populate: {
          path: "requestFormId",
        },
      },
      { path: "assignedMechanic" },
    ]);

    res.status(200).json(updatedJobCard);
  } catch (error) {
    console.error("Error updating job card:", error);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};