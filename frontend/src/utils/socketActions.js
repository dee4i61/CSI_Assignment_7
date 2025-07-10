import socket from "./socket";

export const sendFileViaSocket = (fileId, receiverId) => {
  if (!fileId || !receiverId) {
    console.warn("❌ Missing fileId or receiverId for socket send");
    return;
  }

  socket.emit("send_file", {
    fileId,
    receiverId,
  });
};
