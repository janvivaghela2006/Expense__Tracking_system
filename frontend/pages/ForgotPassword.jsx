import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import API_ENDPOINTS from "../util/apiEndpoints";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        // basic validation
        if(!validateEmail(email)) {
            setError("Please enter your valid email!");
            setIsLoading(false);
            return;
        }
        setError("");

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
            localStorage.setItem("resetToken", response.data.resetToken);
            localStorage.setItem("resetEmail", response.data.email);

            setEmailSent(true);
            toast.success("Password reset link sent to your email!");

        } catch(error) {
            console.error('Something went wrong', error);
            setError(error.response?.data?.message || error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if(emailSent) {
        return (
            <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full login-bg object-cover filter blur-sm" />

                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-black mb-2">Check Your Email</h3>
                            <p className="text-sm text-slate-700 mb-6">
                                We've sent a password reset link to <span className="font-medium">{email}</span>
                            </p>
                            <p className="text-sm text-slate-600 mb-8">
                                Click on the link in your email to reset your password. The link will expire in 1 hour.
                            </p>

                            <button 
                                onClick={() => navigate("/reset-password")}
                                className="w-full py-3 text-lg font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mb-4"
                            >
                                Continue to Reset Password
                            </button>

                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
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
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">Forgot Password?</h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="e.g; your.email@example.com"
                            type="email"
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
                                    Sending...
                                </>
                            ) : ("SEND RESET LINK")}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Remember your password?
                            <Link to="/login" className="font-medium text-purple-600 underline hover:text-purple-700 transition-colors"> Login </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;
