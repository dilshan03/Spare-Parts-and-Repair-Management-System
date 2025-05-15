import Salary from "../../models/HR/SalaryModel.js";
import User from "../../models/HR/UserModel.js";
import { isAdmin , isEmployee } from "./UserControllers.js";

// Generate salary (Admin Only)
export async function generateSalary(req, res) {
    try {
        // Check if user is admin
        if (!isAdmin(req)) {
            console.log(isAdmin(req))

                res.status(403).json({ 
                message: "Access denied. Admins only." 

            })
            return ;
        }


        const  employeeId = req.body.employeeId;
        const otHours = req.body.otHours;
        const doubleOtHours  = req.body.doubleOtHours;

        // Find employee
        const employee = await User.findOne({id : employeeId});
        
        if (!employee) {
                res.status(404).json({ 
                message: "Employee not found" 
            })
            return ;
        }

        const basicSalary = employee.salary; // Fetch salary from employee profile
        const monthlyWorkHours = 208; // Assuming 8 hours/day, 26 days/month
        const hourlyRate = basicSalary / monthlyWorkHours;

        // Calculate OT Payment
        const otPay = parseFloat(((otHours * hourlyRate * 1.5) + (doubleOtHours * hourlyRate * 2)).toFixed(2));

        // Calculate EPF & ETF
        const epfEmployee = parseFloat((basicSalary * 0.08).toFixed(2));
        const epfEmployer = parseFloat((basicSalary * 0.12).toFixed(2));
        const etfEmployer = parseFloat((basicSalary * 0.03).toFixed(2));

        // Calculate Net Salary
        const grossSalary = basicSalary + otPay;
        const netSalary = parseFloat((grossSalary - epfEmployee).toFixed(2));

        // Save salary details
        const salary = new Salary({
            employeeId,
            basicSalary,
            otHours,
            doubleOtHours,
            epfEmployee,
            epfEmployer,
            etfEmployer,
            otPay,
            netSalary
        });

        await salary.save();
        res.json({ 
            message: "Salary generated successfully" 
        });

    } catch (error) {
        res.status(500).json({ 
            error,
            message: "Failed to generate salary" 
        });
    }
}

// Get all salary details (Admin Only)
export async function getAllSalaries(req, res) {
    try {
        if (await isAdmin(req)) {
            const salaries = await Salary.find();
            res.json(salaries);

        } else if (await isEmployee(req)) {
            const id = req.user?.employeeId;
            if (!id) {
                return res.status(400).json({ message: "Employee ID missing" });
            }

            const salaries = await Salary.find({ employeeId: id });

            if (!salaries.length) {
                return res.status(404).json({ message: "No salary records found" });
            }

            res.json(salaries);

        } else {
            res.status(403).json({
                message: "You are not authorized to access salary data."
            });
        }
    } catch (error) {
        console.error("Error fetching salaries:", error);
        res.status(500).json({ 
            message: "Failed to fetch salary data",
            error: error.message
        });
    }
}

