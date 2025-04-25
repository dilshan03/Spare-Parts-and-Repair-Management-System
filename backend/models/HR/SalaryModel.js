import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    
    employeeId: { 
        type: String, 
        required: true 
    },

    basicSalary: { 
        type: Number, 
        required: true, 
        min: 0 
    },

    otHours: { 
        type: Number, 
        default: 0 
    },

    doubleOtHours: { 
        type: Number, 
        default: 0 
    },

    epfEmployee: { 
        type: Number,
        required: true 
    },

    epfEmployer: { 
        type: Number,
        required: true 
    },

    etfEmployer: { 
        type: Number,
        required: true 
    },

    otPay: { 
        type: Number 
    },

    netSalary: { 
        type: Number,
        required: true  
    },

    generatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
