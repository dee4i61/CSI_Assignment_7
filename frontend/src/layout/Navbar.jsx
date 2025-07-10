import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Upload,
  Download,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../services/authService";
import { useNotifications } from "../components/file/NotificationContext";

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store - check if user exists and has required properties
  const user = useSelector((state) => state.user);
  const isLoggedIn = user && (user.username || user.id || user.email); // Check if user actually exists

  // Refs for dropdown containers
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const { notifications, clearNotifications } = useNotifications();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if clicked outside
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }

      // Close notification dropdown if clicked outside
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    // Add event listener when any dropdown is open
    if (isProfileOpen || isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isNotificationOpen]);

  const handleLogout = async () => {
    try {
      // Close any open dropdowns first
      setIsProfileOpen(false);
      setIsNotificationOpen(false);

      await logoutUser();
      // Dispatch logout action to clear user from Redux store
      dispatch({ type: "LOGOUT_USER" });

      // Clear any notifications
      if (clearNotifications) {
        clearNotifications();
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div onClick={() => navigate("/")} className="cursor-pointer">
                <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  FileTransfer
                </h1>
                <p className="text-xs text-gray-500">Secure File Sharing</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Only show user-specific content when logged in */}
            {isLoggedIn ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative" ref={notificationDropdownRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative hover:scale-105"
                  >
                    <Bell size={18} />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        <button
                          onClick={clearNotifications}
                          className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-gray-500 text-center">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((notification, idx) => (
                            <div
                              key={idx}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500"
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.type === "success"
                                      ? "bg-green-500"
                                      : notification.type === "error"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 font-medium">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role || "User"}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200 hover:translate-x-1"
                      >
                        <User size={16} className="text-gray-500" />
                        <span className="font-medium">Profile</span>
                      </button>
                      <div className="py-2 border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-all duration-200 hover:translate-x-1"
                        >
                          <LogOut size={16} />
                          <span className="font-medium">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Login/Signup buttons - Show when user is NOT logged in
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
