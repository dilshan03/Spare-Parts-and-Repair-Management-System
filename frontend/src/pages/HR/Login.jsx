import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        console.log(email, password);

        axios.post("http://localhost:5000/api/employees/login", {
            email: email,
            password: password
            
        })
        .then((res) => {
            console.log(res);
            toast.success("Login Success");
            const user = res.data.user;

            // Store token and set it for future requests
            localStorage.setItem("token", res.data.token);
           
            if (user.role == "Admin") {
                navigate("/admin/");
            } else if(user.role !== "Admin"){
                navigate("/employeeProfile/", { state: user });
            }
        })
        .catch((error) => {
            const serverMessage = error.response?.data?.error || "Login failed";
            const userEmail = error.response?.data?.email;
        
            setError(serverMessage);
            toast.error(serverMessage);
        
            //  If the password is incorrect and we got the email, offer reset option
            if (serverMessage === "Incorrect password" && userEmail) {
                if (confirm("Incorrect password. Do you want to reset your password?")) {
                    navigate("/api/reset-password", { state: { email: userEmail } });
                }
            }
        });
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>

                {/* Display error message */}
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Email</label>
                        <input
                            type="email"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <p
                        className="text-sm text-blue-500 text-center mt-2 cursor-pointer"
                        onClick={() => navigate("/api/reset-password", { state: { email } })}
                    >
                        Forgot Password?
                    </p>


                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white m-2 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
