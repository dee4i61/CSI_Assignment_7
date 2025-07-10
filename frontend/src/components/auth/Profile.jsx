import { useState, useEffect } from "react";
import { getProfile } from "../../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setUser(profileData.user);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-red-200 animate-pulse">
          <p className="text-red-600 text-lg font-medium text-center">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            User Profile
          </h2>
          <p className="text-gray-500 mt-2">Your personal details</p>
        </div>
        <div className="grid gap-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {user.username || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {user.email || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Joined
              </label>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
