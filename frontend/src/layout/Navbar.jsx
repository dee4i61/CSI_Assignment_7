import React, { useState, useEffect } from "react";
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
import { getProfile, logoutUser } from "../services/authService";

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setUser(profileData.user);
      } catch (err) {
        setError(err.message || "Failed to load profile");
        setUser(null); // Ensure user is null if profile fetch fails
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null); // Clear user state on logout
      navigate("/login");
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  };

  const notifications = [
    {
      id: 1,
      message: "File transfer to John completed",
      time: "2 min ago",
      type: "success",
    },
    {
      id: 2,
      message: "New file received from Sarah",
      time: "5 min ago",
      type: "info",
    },
    {
      id: 3,
      message: "Transfer failed - network error",
      time: "10 min ago",
      type: "error",
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div onClick={() => navigate("/")}>
                <h1 className="text-xl font-bold text-gray-900">
                  FileTransfer
                </h1>
                <p className="text-xs text-gray-500">Secure File Sharing</p>
              </div>
            </div>
          </div>

          {/* Right side - Actions and Profile/Login */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Upload size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Download size={18} />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
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
                            <p className="text-sm text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown or Login/Signup */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role || "User"}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </button>
                    </div>

                    <div className="py-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
