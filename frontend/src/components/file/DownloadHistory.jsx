import React, { useEffect, useState } from "react";
import { getTransferHistory, downloadFile } from "../../services/fileService";
import { Download, File } from "lucide-react";

const DownloadHistory = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDownloadableFiles = async () => {
      setLoading(true);
      try {
        const result = await getTransferHistory();
        if (result.success) {
          const allFiles = [
            ...result.data.sent.map((file) => ({ ...file, type: "sent" })),
            ...result.data.received.map((file) => ({
              ...file,
              type: "received",
            })),
          ];
          setFiles(allFiles);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch downloadable files");
      }
      setLoading(false);
    };
    fetchDownloadableFiles();
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

  const handleDownload = async (fileId, originalName) => {
    const result = await downloadFile(fileId, originalName);
    if (!result.success) {
      setError(result.message);
    }
  };

  const renderFileCard = (file) => (
    <div
      key={file._id}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl flex-shrink-0 mt-1">
            {getFileIcon(file.originalname || file.filename)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
              {file.originalname || file.filename}
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <span className="font-medium mr-2">
                  {file.type === "sent" ? "To:" : "From:"}
                </span>
                <span className="text-gray-500">
                  {file.type === "sent"
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
        <div className="flex items-center space-x-3 flex-shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              file.type === "sent"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {file.type === "sent" ? "📤 Sent" : "📥 Received"}
          </span>
          <button
            onClick={() =>
              handleDownload(file._id, file.originalname || file.filename)
            }
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download file"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">📥</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No downloadable files
      </h3>
      <p className="text-gray-500">
        You haven't sent or received any files yet.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <File className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Downloadable Files
          </h1>
          <p className="text-gray-600 text-lg">
            Access all files you can download
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mb-6 text-center animate-pulse">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">⚠️</span>
              <span className="font-semibold">Error</span>
            </div>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {files.length === 0
              ? renderEmptyState()
              : files.map((file) => renderFileCard(file))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadHistory;
