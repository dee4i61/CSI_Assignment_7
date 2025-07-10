import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { registerUser } from "../../services/authService";
import { useEffect } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await registerUser(formData);
      setSuccess(true);
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {/* <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-xl border border-blue-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Redirecting to login...
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
          >
            Register Another Account
          </button>
        </div> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border border-blue-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        <div className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-medium"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full bg-gray-50 border ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                } rounded-lg px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-50 border ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                } rounded-lg px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-50 border ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                } rounded-lg px-10 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all pr-10`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Login
            </button>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="w-12 h-1 bg-blue-200 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="w-12 h-1 bg-blue-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
