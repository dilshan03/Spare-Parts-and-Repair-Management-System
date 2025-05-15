import mongoose from "mongoose";

const jobCardSchema = new mongoose.Schema({
  // Reference to the Repair
  repairId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Repair", 
    required: true 
  },
 
  // Assigned Mechanic 
  assignedMechanic: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "employees", 
    required: true 
  },

  // List of jobs in this job card
  jobs: [{
    jobName: { type: String, required: true },
    jobDescription: { type: String },
    jobStatus: { 
      type: String, 
      enum: ["Pending", "In Progress", "Completed"], 
      default: "Pending" 
    },
    jobCost: { type: Number, default: 0 }
  }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

const JobCard = mongoose.model("JobCard", jobCardSchema);
export default JobCard;