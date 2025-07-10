import api from "./api"; // Your axios instance

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post(`/auth/login`, userData, {
      withCredentials: true,
    });
    console.log("response.data", response);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get(`/auth/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post(
      `/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};
