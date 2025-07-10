import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { loginUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { setUser, logoutUser } from "../../redux/slices/userSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Redux state
  const {
    user,
    error: reduxError,
    loading: reduxLoading,
  } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear Redux error when user starts typing
    if (reduxError) dispatch(setError(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    try {
      const result = await loginUser(formData);

      dispatch(setUser(result.user || result));

      setSuccess("Login successful! Welcome back.");
      console.log("User logged in", result.user);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      // dispatch(setError(err.message || "Login failed. Please try again."));
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Main login card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 transition-transform duration-300 hover:scale-110">
              <User className="text-blue-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Error/Success messages */}
          {reduxError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {reduxError}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400 hover:border-gray-400"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white placeholder-gray-400 hover:border-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={reduxLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
            >
              {reduxLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
