import React, { useEffect, useState } from "react";
import { getTransferHistory } from "../../services/fileService";

const TransferHistory = () => {
  const [history, setHistory] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const result = await getTransferHistory();
      console.log("getTransferHistory", result);
      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      const kb = bytes / 1024;
      return `${kb.toFixed(2)} KB`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
        return "🎵";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📎";
    }
  };

  const renderFileCard = (file, type) => (
    <div
      key={file._id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl flex-shrink-0 mt-1">
            {getFileIcon(file.originalname || file.filename)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {file.originalname || file.filename}
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <span className="font-medium mr-2">
                  {type === "sent" ? "To:" : "From:"}
                </span>
                <span className="text-gray-500">
                  {type === "sent"
                    ? `User ID: ${file.receiver}`
                    : `User ID: ${file.sender}`}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="font-medium mr-2">Size:</span>
                <span className="text-gray-500">
                  {formatFileSize(file.size)}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <span className="font-medium mr-2">Date:</span>
                <span className="text-gray-500">
                  {formatDate(file.uploadedAt)}
                </span>
              </p>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
            type === "sent"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {type === "sent" ? "📤 Sent" : "📥 Received"}
        </span>
      </div>
    </div>
  );

  const renderEmptyState = (type) => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">{type === "sent" ? "📤" : "📥"}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {type} files
      </h3>
      <p className="text-gray-500">
        {type === "sent"
          ? "You haven't sent any files yet."
          : "You haven't received any files yet."}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Transfer History
          </h1>
          <p className="text-gray-600">
            Track your file transfers and downloads
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">⚠️</span>
              <span className="font-semibold">Error</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sent Files Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <span className="text-xl">📤</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Sent Files
                  </h2>
                  <p className="text-sm text-gray-500">
                    {history.sent.length} file
                    {history.sent.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {history.sent.length === 0 ? (
                renderEmptyState("sent")
              ) : (
                <div className="space-y-4">
                  {history.sent.map((file) => renderFileCard(file, "sent"))}
                </div>
              )}
            </div>

            {/* Received Files Section */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <span className="text-xl">📥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Received Files
                  </h2>
                  <p className="text-sm text-gray-500">
                    {history.received.length} file
                    {history.received.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {history.received.length === 0 ? (
                renderEmptyState("received")
              ) : (
                <div className="space-y-4">
                  {history.received.map((file) =>
                    renderFileCard(file, "received")
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferHistory;
