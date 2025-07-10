import api from "./api";

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch dashboard stats:", error);
    throw error;
  }
};
