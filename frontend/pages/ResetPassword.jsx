import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import API_ENDPOINTS from "../util/apiEndpoints";

const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem("resetEmail");
        const token = localStorage.getItem("resetToken");

        if (!email || !token) {
            navigate("/forgot-password");
        } else {
            setResetEmail(email);
        }
    }, [navigate]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        // basic validation
        if(!newPassword.trim()) {
            setError("Please enter your new password!");
            setIsLoading(false);
            return;
        }
        if(newPassword.length < 6) {
            setError("Password must be at least 6 characters long!");
            setIsLoading(false);
            return;
        }
        if(!confirmPassword.trim()) {
            setError("Please confirm your password!");
            setIsLoading(false);
            return;
        }
        if(newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }
        setError("");

        try {
            const token = localStorage.getItem("resetToken");
            await axiosConfig.post(API_ENDPOINTS.RESET_PASSWORD, {
                email: resetEmail,
                token,
                newPassword
            });

            localStorage.removeItem("resetToken");
            localStorage.removeItem("resetEmail");

            setPasswordReset(true);
            toast.success("Password reset successfully!");

        } catch(error) {
            console.error('Something went wrong', error);
            setError(error.response?.data?.message || error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if(passwordReset) {
        return (
            <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full login-bg object-cover filter blur-sm" />

                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-black mb-2">Password Reset Successful!</h3>
                            <p className="text-sm text-slate-700 mb-8">
                                Your password has been reset successfully. You can now login with your new password.
                            </p>

                            <button 
                                onClick={() => navigate("/login")}
                                className="w-full py-3 text-lg font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full login-bg object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">Reset Password</h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Enter your new password below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            label="New Password"
                            placeholder="e.g; ••••••••"
                            type="password"
                        />

                        <Input 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            label="Confirm Password"
                            placeholder="e.g; ••••••••"
                            type="password"
                        />

                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button 
                            disabled={isLoading} 
                            className={`w-full py-3 text-lg font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`} 
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Resetting...
                                </>
                            ) : ("RESET PASSWORD")}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            <Link to="/login" className="inline-flex items-center gap-2 font-medium text-purple-600 underline hover:text-purple-700 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
