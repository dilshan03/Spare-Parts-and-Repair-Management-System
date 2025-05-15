import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminEditEmployee() {

  const location = useLocation();

  const [empId, setEmpId] = useState(location.state.id);
  const [firstName, setFirstNmae] = useState(location.state.firstName);
  const [lastName, setProdusetLastName] = useState(location.state.lastName);
  const [email, setEmail] = useState(location.state.email);
  const [address, setAddress] = useState(location.state.address);
  const [birthday, setBirthday] = useState(location.state.birthday);
  const [age, setAge] = useState(location.state.age);
  const [phone, setPhone] = useState(location.state.phone);
  const [role, setRole] = useState(location.state.role);
  const [employeeType, setType] = useState(location.state.employeeType);
  const [salary, setSalary] = useState(location.state.salary);
  const [status, setStatus] = useState(location.state.status);
  const [profilepicture, setPicture] = useState(location.state.profilepicture);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!/^EMP\d{4}$/.test(empId)) tempErrors.empId = "Employee ID must start with 'EMP' followed by 4 digits.";
    // Birthday
    if (!birthday) {
      tempErrors.birthday = "Birthday is required.";
    }
  
    if (!/^\S+@\S+\.\S+$/.test(email)) tempErrors.email = "Invalid email format.";
    if (!(age >= 18 && age <= 65)) tempErrors.age = "Age must be between 18 and 65.";
    if (!/^\d{10}$/.test(phone)) tempErrors.phone = "Phone number must be exactly 10 digits.";
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

  

  //const { id } = useParams(); // Get Employee ID from URL
  const navigate = useNavigate();
  async function handleUpadateEmp(){
    
      if (!validate()) return;
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login and retry");
        return;
      }

    

    if(token){
      
      try {

        const result = await axios.put("http://localhost:5000/api/employees/" + empId,
          {
            firstName : firstName,
            lastName : lastName,
            email : email,
            address : address,
            birthday: birthday,
            age : age,
            phone : phone,
            role : role,
            employeeType : employeeType,
            salary : salary,
            profilepicture:profilepicture

          },{
            headers : {
    
              Authorization : "Bearer " + token
    
            }
          })
          toast.success("Employee Upadated successfully")
          navigate("/admin/employees/details")
        
      } catch (error) {

        toast.error(error.response.data.error)
      }
      
      

    }else{
      toast.error("Please login and retry")
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wide relative mb-6">Update Employee</h1>
  
      <div className='w-[400px] flex flex-col justify-center items-center p-4 rounded-lg'>
        <input value={empId} disabled className='p-2 m-2 w-full border rounded' />
        {errors.empId && <p className="text-red-500">{errors.empId}</p>}
  
        <input
          onChange={(event) => setFirstNmae(event.target.value)}
          value={firstName}
          type="text"
          placeholder='First Name'
          className='p-2 m-2 w-full border rounded'
        />
  
        <input
          onChange={(event) => setProdusetLastName(event.target.value)}
          value={lastName}
          type="text"
          placeholder='Last Name'
          className='p-2 m-2 w-full border rounded'
        />
  
        <input value={email} onChange={e => setEmail(e.target.value)} className='p-2 m-2 w-full border rounded' />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
  
        <input
          onChange={(event) => setAddress(event.target.value)}
          value={address}
          type="text"
          placeholder='Address'
          className='p-2 m-2 w-full border rounded'
        />

        <div className='w-[400px] flex flex-col justify-center items-center p-4 rounded-lg'>
        <input value={birthday} disabled className='p-2 m-2 w-full border rounded' />
        {errors.birthday && <p className="text-red-500">{errors.birthday}</p>}
        </div>
                  
        <div className='w-[400px] flex flex-col justify-center items-center p-4 rounded-lg'>
        <input value={age} className='p-2 m-2 w-full border rounded' />
        {errors.age && <p className="text-red-500">{errors.age}</p>}
        </div>
                  
        <input value={phone} onChange={e => setPhone(e.target.value)} className='p-2 m-2 w-full border rounded' />
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
  
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className='p-2 m-2 w-full border rounded'
        >
          <option value="Painter">Painter</option>
          <option value="Technician">Technician</option>
          <option value="Designer">Designer</option>
          <option value="Mechanic">Mechanic</option>
          <option value="Admin">Admin</option>
        </select>
  
        <select
          value={employeeType}
          onChange={(event) => setType(event.target.value)}
          className='p-2 m-2 w-full border rounded'
        >
          <option value="Permanent">Permanent</option>
          <option value="Temporary">Temporary</option>
        </select>
  
        <input
          onChange={(event) => setSalary(event.target.value)}
          value={salary}
          type="number"
          placeholder='Salary'
          className='p-2 m-2 w-full border rounded'
        />
  
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className='p-2 m-2 w-full border rounded'
        >
          <option value="Available">Available</option>
          <option value="Not-Available">Not-Available</option>
        </select>
  
        <input
          onChange={(event) => setPicture(event.target.value)}
          value={profilepicture}
          type="text"
          placeholder='Profile Picture URL'
          className='p-2 m-2 w-full border rounded'
        />
  
        <button onClick={handleUpadateEmp} className='p-2 m-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600'>
          Update Employee
        </button>
  
        <button onClick={() => navigate("/admin/employees/details")} className='p-2 m-2 w-full bg-red-500 text-white rounded hover:bg-red-600'>
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
  
}
