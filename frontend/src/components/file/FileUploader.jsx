import React, { useState, useEffect } from "react";
import { uploadFile, getTransferHistory } from "../../services/fileService";
import { getAllUsers } from "../../services/userService";
import { useSelector } from "react-redux";
import { sendFileViaSocket } from "../../utils/socketActions"; // ✅ import socket action

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const senderId = useSelector((state) => state?.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.message || "Failed to fetch users");
        }
        setFetchingUsers(false);
      } catch (error) {
        setError("Failed to fetch users");
        setFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleReceiverChange = (e) => {
    setReceiverId(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !receiverId) {
      setError("Please select a file and a recipient");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadFile(file, receiverId);
      setLoading(false);

      if (!result || !result.success || !result.data?.file?._id) {
        const errMsg = result?.message || "Upload failed or file ID missing";
        setError(errMsg);
        return;
      }

      const fileId = result.data.file._id;
      console.log("✅ File ID from upload:", fileId);

      // ✅ Use socket utility function
      sendFileViaSocket(fileId, receiverId);

      setSuccess("File uploaded and sent successfully!");
      setFile(null);
      setReceiverId("");

      await getTransferHistory();
    } catch (err) {
      console.error("❌ Upload error:", err);
      setLoading(false);
      setError("Upload error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload File
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Send to
            </label>
            {fetchingUsers ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <select
                value={receiverId}
                onChange={handleReceiverChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || fetchingUsers}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Upload & Send File"}
          </button>
        </div>

        {!fetchingUsers && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            {users.length} user{users.length !== 1 ? "s" : ""} available to
            receive files
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
