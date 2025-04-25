import { useState } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";


export default function PasswordReset() {

    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || "");
  
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // Handle OTP request
    const requestOtp = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/employees/request-otp", { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to request OTP");
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const verifyOtp = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/employees/verify-otp", { email, otp });
            setMessage(res.data.message);
            setStep(3);
            
        } catch (err) {
            setMessage(err.response?.data?.error || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset
    const resetPassword = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/employees/reset-password", { email, newPassword });
            toast.success("Password Reset Successfully!"); //  Show success message
            navigate("/login"); //  Redirect to login page
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Request OTP</h2>
                        <input
                            type="email"
                            className="border p-2 w-full mb-3"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={requestOtp}
                            className="bg-blue-500 text-white px-4 py-2 w-full"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Request OTP"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                        <input
                            type="text"
                            className="border p-2 w-full mb-3"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={verifyOtp}
                            className="bg-blue-500 text-white px-4 py-2 w-full"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <input
                            type="password"
                            className="border p-2 w-full mb-3"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            onClick={resetPassword}
                            className="bg-green-500 text-white px-4 py-2 w-full"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                {message && <p className="mt-4 text-green-500">{message}</p>}
            </div>
        </div>
    );
}
