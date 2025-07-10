import React, { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Users,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllTransfers, setShowAllTransfers] = useState(false);

  // Get all files from API
  const fetchAllFiles = async () => {
    try {
      // You'll need to create this service function or modify your existing API
      // For now, I'll assume your API returns all files when we request them
      const response = await getDashboardStats();
      return response.allFiles || response.recentTransfers || [];
    } catch (err) {
      console.error("Failed to fetch all files:", err);
      return [];
    }
  };

  const [allFiles, setAllFiles] = useState([]);

  // Fetch all files when showing all transfers
  useEffect(() => {
    if (showAllTransfers && allFiles.length === 0) {
      fetchAllFiles().then(setAllFiles);
    }
  }, [showAllTransfers]);
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setDashboardData(data);

      // If we already have all files loaded, update them too
      if (showAllTransfers) {
        const allFilesData = await fetchAllFiles();
        setAllFiles(allFilesData);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllClick = () => {
    setShowAllTransfers(!showAllTransfers);
  };

  const getDisplayedTransfers = () => {
    if (!dashboardData?.recentTransfers) return [];

    if (showAllTransfers) {
      // Return all files if available, otherwise fall back to recent transfers
      return allFiles.length > 0 ? allFiles : dashboardData.recentTransfers;
    }

    // Show only recent transfers (first 5)
    return dashboardData.recentTransfers.slice(0, 5);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Create stats array from API data
  const getStats = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Total Transfers",
        value: dashboardData.totalTransfers?.toString() || "0",
        icon: Activity,
        color: "blue",
      },
      {
        title: "Files Uploaded",
        value: dashboardData.filesUploaded?.toString() || "0",
        icon: Upload,
        color: "green",
      },
      {
        title: "Files Downloaded",
        value: dashboardData.filesDownloaded?.toString() || "0",
        icon: Download,
        color: "purple",
      },
      {
        title: "Active Users",
        value: dashboardData.activeUsers?.toString() || "0",
        icon: Users,
        color: "orange",
      },
    ];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "failed":
        return <XCircle size={16} className="text-red-500" />;
      case "in_progress":
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-3">
            <RefreshCw size={24} className="animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your file transfers.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={`inline mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transfers */}
      {dashboardData?.recentTransfers &&
        dashboardData.recentTransfers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showAllTransfers ? "All Transfers" : "Recent Transfers"}
                </h3>
                <button
                  onClick={handleViewAllClick}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showAllTransfers ? "View Recent" : "View All"}
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {getDisplayedTransfers().map((transfer) => (
                <div
                  key={transfer._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <ArrowUpRight size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transfer.filename || "Unknown file"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(transfer.size)}
                          {transfer.sender && (
                            <span>
                              {" "}
                              •{" "}
                              {transfer.sender.email ||
                                transfer.sender.username}
                            </span>
                          )}
                          {transfer.receiver && (
                            <span>
                              {" "}
                              →{" "}
                              {transfer.receiver.email ||
                                transfer.receiver.username}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimestamp(transfer.uploadedAt)}
                        </p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showAllTransfers && getDisplayedTransfers().length === 0 && (
              <div className="px-6 py-8 text-center">
                <Activity size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No additional transfers found</p>
              </div>
            )}
          </div>
        )}

      {/* Empty State for Recent Transfers */}
      {(!dashboardData?.recentTransfers ||
        dashboardData.recentTransfers.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Activity size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Recent Transfers
            </h3>
            <p className="text-gray-600">
              Start uploading files to see your transfer history here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
