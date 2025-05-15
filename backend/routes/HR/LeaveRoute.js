import express from "express";
import { requestLeave, getLeaveRequests, deleteLeaveRequest,updateLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from "../../controllers/HR/LeaveController.js";

const leaveRouter = express.Router();

leaveRouter.post("/", requestLeave);
leaveRouter.get("/", getLeaveRequests);
leaveRouter.delete("/:id", deleteLeaveRequest);
leaveRouter.put("/:id", updateLeaveRequest);
leaveRouter.put("/approve/:id", approveLeaveRequest);
leaveRouter.put("/reject/:id", rejectLeaveRequest);

export default leaveRouter;
