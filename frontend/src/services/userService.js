import api from "./api";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users/");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, message: "Failed to fetch users" };
  }
};
