import Leave from "../../models/HR/LeaveModel.js";
import { isAdmin , isEmployee } from "./UserControllers.js";
import Counter from "../../models/HR/counterModel.js";


export async function requestLeave(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Please log in and try again" });
    } else if (req.user.role == "User") {
        return res.status(401).json({ message: "You are not authorized to do it" });
    }

    try {

        const counter = await Counter.findByIdAndUpdate(
            { _id: "leaveId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newId = `L${String(counter.seq).padStart(3, "0")}`;

        const newLeave = new Leave({
            id: newId,
            email: req.user.email,
            name: `${req.user.firstName} ${req.user.lastName}`,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: req.body.reason,
            status: "Pending",
          });

        await newLeave.save();
        res.json({ message: "Leave request submitted successfully", leave: newLeave });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit leave request" });
    }
}

export function getLeaveRequests(req, res) {
    if (!req.user) {
         res.status(401).json({ 
            message: "Please log in and try again" 
        })
        return;
    }

    else if(isAdmin(req)){
       
        Leave.find().then((leaves)=>{
            res.json(leaves);
        }).catch(()=>{
            res.json({
                message : "Leaves not found"
            })
        })
    }

    else if (isEmployee(req)) {
        // Fetch leave requests for the logged-in employee
        const email = req.user.email;  // Get the authenticated user's email
        Leave.find({ email: email }).then((leaveDetail) => {
            if (!leaveDetail || leaveDetail.length === 0) {
                return res.json({ message: "No leave requests found" });
            }
            res.json(leaveDetail);  // Return the leave requests for the employee
        }).catch(() => {
            res.status(500).json({
                message: "Failed to fetch leave requests"
            });
        });
    }
}

export function deleteLeaveRequest(req, res) {
    if (!req.user) {

        res.status(401).json({ 
            message: "Please log in and try again"
        });
        return ;
    }
   
    else if(isAdmin (req)){
            const id = req.params.id;
   
            Leave.deleteOne({id : id }).then(()=>{
               res.json({
                   message : "Leave deleted successfully"
               })
            }).catch(()=>{
               res.status(500).json({
                   message : "Failed to delete leave request" 
               })
            })
    }
    else {
        res.json({
            message : " You can not delete leave"
        })
        return;
    }
}

export function approveLeaveRequest(req, res) {

    if (!req.user || req.user.role !== "Admin") {

        res.status(403).json({ 
            message: "You are not authorized to approve leave requests" 
        })
        return;
    }
    const leaveId = req.params.id;

    Leave.findOneAndUpdate({id : leaveId}, { status: "Approved" }).then(() => 
        res.json({
             message: "Leave request approved successfully" 
            })

        ).catch(() => 
            res.status(500).json({ 
                message: "Failed to approve leave request" 
            })
        );
}

export function rejectLeaveRequest(req, res) {

    if (!req.user || req.user.role !== "Admin") {

        res.status(403).json({ 
            message: "You are not authorized to reject leave requests" 
        })
        return;
    }

    const leaveId = req.params.id;

    Leave.findOneAndUpdate({id : leaveId}, { status: "Rejected" }).then(() => 
        res.json({ 
            message: "Leave request rejected successfully" 
        })
     ).catch(() => 
        res.status(500).json({ 
            message: "Failed to reject leave request" 
        })
    );
}

export async function updateLeaveRequest(req,res){
    if (!req.user) {
        res.status(401).json({ 
           message: "Please log in and try again" 
       })
       return;
   }

    else if(isEmployee(req)){

        const leaveId = req.params.id;
        const data = req.body;

        try {
            const foundLeave = await Leave.findOne({id : leaveId})

            if (foundLeave == null){
                res.json({
                    message : "Leave not found"
                })
            }
            else if(foundLeave.email == req.user.email){
                    
                await Leave.updateOne({id : leaveId},{$set: { reason: data.reason, startDate: data.startDate, endDate: data.endDate}})
                    
                    res.json({
                        message : "Your leaving details are updated"
                    })
            
            }
            else{
                res.json({
                    message : "You are not authorized to update this leave request"
                })
            }
            
        } catch (error) {
            res.json({
                message : "Leave update is failed"
            })
            
        }
    }
    else{
        res.json({
            message : "You are not authorized to perform this action"
        })
    }
}