import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

// ✅ Log when connected
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

// ❌ Log if connection fails
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

// 🔌 Log if disconnected
socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

export default socket;
