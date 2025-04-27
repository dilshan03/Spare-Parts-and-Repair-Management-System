import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminAddEmployee() {
  const [empId, setEmpId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState(""); 
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [employeeType, setType] = useState("Temporary");
  const [salary, setSalary] = useState(0);
  const [status, setStatus] = useState("Available");
  const [profilepicture, setPicture] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
  
    // Employee ID
    if (!/^EMP\d{4}$/.test(empId)) {
      tempErrors.empId = "Employee ID must start with 'EMP' followed by 4 digits.";
    }
  
    // Birthday
    if (!birthday) {
      tempErrors.birthday = "Birthday is required.";
    }
  
    // Email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      tempErrors.email = "Invalid email format.";
    }
  
    // Phone Number
    if (!/^\d{10}$/.test(phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    }
  
    // Name Fields (Only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
  
    if (!firstName || !nameRegex.test(firstName)) {
      tempErrors.firstName = "First name can only contain letters and spaces.";
    }
  
    if (!lastName || !nameRegex.test(lastName)) {
      tempErrors.lastName = "Last name can only contain letters and spaces.";
    }
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  async function handleAddEmp() {
    if (!validate()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login and retry");
      return;
    }

    const age = calculateAge(birthday); 

    try {
      const result = await axios.post("http://localhost:5000/api/employees",
        {
          id: empId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          address: address,
          birthday: birthday,
          age: age, 
          phone: phone,
          role: role,
          employeeType: employeeType,
          salary: salary,
          status: status,
          profilepicture: profilepicture
        }, {
          headers: {
            Authorization: "Bearer " + token
          }
        });

      toast.success("Employee added successfully");
      navigate("/admin/employees/details");

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wide relative mb-6">
        Add Employee
      </h1>

      <div className='w-[400px] flex flex-col justify-center items-center p-4 rounded-lg'>
        <input onChange={e => setEmpId(e.target.value)} value={empId} type="text" placeholder='Employee ID' className='p-2 m-2 w-full border rounded' />
        {errors.empId && <p className='text-red-500'>{errors.empId}</p>}

        <input onChange={(event) => setFirstName(event.target.value)} value={firstName} type="text" placeholder='First Name' className='p-2 m-2 w-full border rounded' />
        {errors.firstName && <p className='text-red-500'>{errors.firstName}</p>}

        <input onChange={(event) => setLastName(event.target.value)} value={lastName} type="text" placeholder='Last Name' className='p-2 m-2 w-full border rounded' />
        {errors.lastName && <p className='text-red-500'>{errors.lastName}</p>}

        <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email' className='p-2 m-2 w-full border rounded' />
        {errors.email && <p className='text-red-500'>{errors.email}</p>}

        <input onChange={(event) => setPassword(event.target.value)} value={password} type="password" placeholder='Password' className='p-2 m-2 w-full border rounded' />

        <input onChange={(event) => setAddress(event.target.value)} value={address} type="text" placeholder='Address' className='p-2 m-2 w-full border rounded' />

        <input onChange={e => setBirthday(e.target.value)} value={birthday} type="date" placeholder='Birthday' className='p-2 m-2 w-full border rounded' />
        {errors.birthday && <p className='text-red-500'>{errors.birthday}</p>}

        <input onChange={e => setPhone(e.target.value)} value={phone} type="text" placeholder='Phone Number' className='p-2 m-2 w-full border rounded' />
        {errors.phone && <p className='text-red-500'>{errors.phone}</p>}

        <select value={role} onChange={(event) => setRole(event.target.value)} className='p-2 m-2 w-full border rounded'>
          <option value="">Select Role</option>
          <option value="Painter">Painter</option>
          <option value="Technician">Technician</option>
          <option value="Designer">Designer</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Admin">Admin</option>
        </select>

        <select value={employeeType} onChange={(event) => setType(event.target.value)} className='p-2 m-2 w-full border rounded'>
          <option value="Temporary">Temporary</option>
          <option value="Permanent">Permanent</option>
        </select>

        <input onChange={(event) => setSalary(event.target.value)} value={salary} type="number" placeholder='Salary' className='p-2 m-2 w-full border rounded' />

        <select value={status} onChange={(event) => setStatus(event.target.value)} className='p-2 m-2 w-full border rounded'>
          <option value="Not-Available">Not-Available</option>
          <option value="Available">Available</option>
        </select>

        <input onChange={(event) => setPicture(event.target.value)} value={profilepicture} type="text" placeholder='Profile Picture URL' className='p-2 m-2 w-full border rounded' />

        <button onClick={handleAddEmp} className='p-2 m-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600'>
          Add Employee
        </button>

        <button onClick={() => navigate("/admin/employees/details")} className='p-2 m-2 w-full bg-red-500 text-white rounded hover:bg-red-600'>
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
}
