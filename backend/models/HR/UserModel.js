import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({

    id : {
        type: String,
        required: true,
        unique: true // Ensures no duplicate id
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
    },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    birthday: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                return age >= 18 && age <= 65;
            },
            message: "Employee must be between 18 and 65 years old"
        }
    },
    age : {
        type :Number,
        
    },
    
    phone: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        required: true,
        default: "User"
    },
    employeeType: {
        type: String,
        required: true,
        default : "Temporary"
    },
    salary: {
        type: Number,
        required: true,
        min: 0 // Ensures salary is not negative
    },
    
    status: {
        type: String,
        required: true,
        default: "Available"
    },

    otp: {
        default:0,
        type: String,
    },

    otpExpires: {
        default:"0",
        type: Date,
    },

    profilepicture: {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKaiKiPcLJj7ufrj6M2KaPwyCT4lDSFA5oog&s"

    },
});

const User = mongoose.model("employees", userSchema);

export default User;