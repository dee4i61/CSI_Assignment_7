const connectedUsers = new Map();
const File = require("./models/File");

function registerUser(userId, socketId) {
  connectedUsers.set(userId, socketId);
}

function unregisterUser(socketId) {
  for (const [userId, id] of connectedUsers.entries()) {
    if (id === socketId) {
      connectedUsers.delete(userId);
      console.log(`❌ Disconnected user: ${userId}`);
      break;
    }
  }
}

function getSocketIdByUserId(userId) {
  return connectedUsers.get(userId);
}

function getOnlineUsers() {
  return Array.from(connectedUsers.keys());
}

async function sendFileToUser({ io, senderSocket, fileId, receiverId }) {
  const senderId = senderSocket.userId;

  try {
    const receiverSocketId = getSocketIdByUserId(receiverId);
    console.log("Receiver socket ID:", receiverSocketId);

    if (!receiverSocketId) {
      console.warn("⚠️ Receiver is not connected.");
      senderSocket.emit("notification", {
        type: "error",
        message: "Receiver not connected",
      });
      return;
    }

    const file = await File.findById(fileId);
    if (!file) {
      console.warn("⚠️ File not found");
      senderSocket.emit("notification", {
        type: "error",
        message: "File not found",
      });
      return;
    }

    // Notify receiver
    io.to(receiverSocketId).emit("notification", {
      type: "file_received",
      message: `📥 File received from user ${senderId}`,
      fileId: file._id,
      fileName: file.originalname,
    });

    senderSocket.emit("notification", {
      type: "file_sent",
      message: `📤 File sent to user ${receiverId}`,
      fileId: file._id,
      fileName: file.originalname,
    });
  } catch (err) {
    console.error("❌ Error sending file via socket:", err.message);
    senderSocket.emit("notification", {
      type: "error",
      message: "Something went wrong during file transfer",
    });
  }
}

module.exports = {
  registerUser,
  unregisterUser,
  sendFileToUser,
  getSocketIdByUserId,
  getOnlineUsers,
};
