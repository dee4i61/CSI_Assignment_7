import React, { useState } from "react";
import {
  Upload,
  Download,
  Users,
  Activity,
  FileText,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
} from "lucide-react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      title: "Total Transfers",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Activity,
      color: "blue",
    },
    {
      title: "Files Uploaded",
      value: "456",
      change: "+8%",
      changeType: "positive",
      icon: Upload,
      color: "green",
    },
    {
      title: "Files Downloaded",
      value: "789",
      change: "+15%",
      changeType: "positive",
      icon: Download,
      color: "purple",
    },
    {
      title: "Active Users",
      value: "23",
      change: "+3%",
      changeType: "positive",
      icon: Users,
      color: "orange",
    },
  ];

  const recentTransfers = [
    {
      id: 1,
      filename: "project_presentation.pdf",
      size: "2.4 MB",
      recipient: "john@example.com",
      status: "completed",
      timestamp: "2 min ago",
      type: "upload",
    },
    {
      id: 2,
      filename: "design_mockups.zip",
      size: "15.8 MB",
      recipient: "sarah@example.com",
      status: "in_progress",
      timestamp: "5 min ago",
      type: "upload",
      progress: 67,
    },
    {
      id: 3,
      filename: "report_final.docx",
      size: "1.2 MB",
      recipient: "mike@example.com",
      status: "failed",
      timestamp: "8 min ago",
      type: "download",
    },
    {
      id: 4,
      filename: "video_tutorial.mp4",
      size: "45.6 MB",
      recipient: "team@example.com",
      status: "completed",
      timestamp: "15 min ago",
      type: "upload",
    },
  ];

  const activeConnections = [
    {
      id: 1,
      user: "John Smith",
      email: "john@example.com",
      status: "online",
      lastSeen: "Active now",
      avatar: "JS",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      email: "sarah@example.com",
      status: "online",
      lastSeen: "Active now",
      avatar: "SJ",
    },
    {
      id: 3,
      user: "Mike Davis",
      email: "mike@example.com",
      status: "away",
      lastSeen: "5 min ago",
      avatar: "MD",
    },
  ];

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
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Calendar size={16} className="inline mr-2" />
            Export Report
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
                <div className="flex items-center mt-2">
                  {stat.changeType === "positive" ? (
                    <TrendingUp size={14} className="text-green-500 mr-1" />
                  ) : (
                    <TrendingUp
                      size={14}
                      className="text-red-500 mr-1 rotate-180"
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last period
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transfers */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transfers
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransfers.map((transfer) => (
              <div
                key={transfer.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        transfer.type === "upload"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {transfer.type === "upload" ? (
                        <ArrowUpRight size={16} className="text-green-600" />
                      ) : (
                        <ArrowDownRight size={16} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transfer.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transfer.size} • {transfer.recipient}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transfer.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            transfer.status
                          )}`}
                        >
                          {transfer.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {transfer.timestamp}
                      </p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                {transfer.status === "in_progress" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{transfer.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${transfer.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Connections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Connections
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center space-x-3"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {connection.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        connection.status === "online"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {connection.user}
                    </p>
                    <p className="text-sm text-gray-500">{connection.email}</p>
                    <p className="text-xs text-gray-400">
                      {connection.lastSeen}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">System Status</h4>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transfer Speed</span>
              <span className="text-sm font-medium text-green-600">Fast</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Security</span>
              <span className="text-sm font-medium text-green-600">Secure</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Storage Usage</h4>
            <Shield size={20} className="text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Used</span>
              <span className="text-sm font-medium text-gray-900">2.1 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-medium text-gray-900">2.9 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "42%" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Network Status</h4>
            <Zap size={20} className="text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upload Speed</span>
              <span className="text-sm font-medium text-gray-900">
                15.2 Mbps
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Download Speed</span>
              <span className="text-sm font-medium text-gray-900">
                22.8 Mbps
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Latency</span>
              <span className="text-sm font-medium text-gray-900">12ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Ready to transfer files?</h3>
            <p className="text-blue-100">
              Start sharing files securely with your team or clients.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <Upload size={18} />
              <span>Upload Files</span>
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors flex items-center space-x-2">
              <Globe size={18} />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
