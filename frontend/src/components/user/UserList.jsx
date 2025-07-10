import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Users
        </h1>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-600 text-lg">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {user._id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {user.username || "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {user.email || "No email"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
