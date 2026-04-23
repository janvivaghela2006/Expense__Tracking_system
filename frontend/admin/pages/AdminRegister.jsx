import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Upload } from "lucide-react";
import toast from "react-hot-toast";
import login_bg from "../assets/login_bg.jpg";
import axiosConfig from "../../util/axiosConfig";
import API_ENDPOINTS from "../../util/apiEndpoints";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setFormData({ ...formData, profile: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.profile) {
      toast.error("Please fill all fields and select a profile picture");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const profileImageUrl = reader.result;
        const response = await axiosConfig.post(API_ENDPOINTS.ADMIN_REGISTER, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profileImageUrl
        });

        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("admin", "true");

        toast.success("Admin Registered Successfully!");
        navigate("/admin/login");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to register admin");
      }
    };
    reader.readAsDataURL(formData.profile);
  };

  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        {/* <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full login-bg object-cover filter blur-sm" /> */}
      <img 
        src={login_bg} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover blur-sm" 
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white p-10 rounded-2xl shadow-lg w-[380px] flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center">Create An Account</h2>
        <p className="text-center text-gray-500 text-sm">
          Start tracking your spending by joining with us.
        </p>

        {/* Profile Upload */}
        <div className="flex justify-center my-2">
          <label className="relative cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <Upload size={24} className="text-purple-600" />
              )}
            </div>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Full Name */}
        <input
          type="text"
          name="name"
          placeholder="e.g; John Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="e.g; fullname@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="e.g; ********"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
        >
          SIGN UP
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
