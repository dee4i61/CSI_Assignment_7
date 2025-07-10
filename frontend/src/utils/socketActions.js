// utils/socketActions.js
import socket from "./socket";

export const sendFileViaSocket = (fileId, receiverId) => {
  if (!fileId || !receiverId) {
    console.warn("❌ Missing fileId or receiverId for socket send");
    return;
  }

  console.log("📡 Emitting 'send_file' via socket:", { fileId, receiverId });

  socket.emit("send_file", {
    fileId,
    receiverId,
  });
};
