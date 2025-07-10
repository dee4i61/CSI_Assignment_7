import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

export default socket;
