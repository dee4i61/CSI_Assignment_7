import api from "./api";

// Upload File
export const uploadFile = async (file, receiverId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", receiverId);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, message: "Upload failed" };
  }
};

// Get Transfer History
export const getTransferHistory = async () => {
  try {
    const response = await api.get("/files/history");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return { success: false, message: "Failed to fetch transfer history" };
  }
};

// Download File
export const downloadFile = async (fileId, originalName) => {
  try {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", originalName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    console.error("Download error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to download file",
    };
  }
};
