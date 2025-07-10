const fs = require("fs");
const path = require("path");
const File = require("./models/File");

const connectedUsers = new Map();

const registerUser = (userId, socketId) => {
  connectedUsers.set(userId, socketId);
};

const unregisterUser = (socketId) => {
  for (const [userId, sId] of connectedUsers.entries()) {
    if (sId === socketId) {
      connectedUsers.delete(userId);
      console.log(`🔴 User ${userId} disconnected`);
      break;
    }
  }
};

const getReceiverSocketId = (receiverId) => {
  return connectedUsers.get(receiverId);
};

const sendFileToUser = async ({ io, fileId, senderId, receiverId, socket }) => {
  try {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (!receiverSocketId) {
      socket.emit("error", { message: "Receiver not connected" });
      return;
    }

    const file = await File.findById(fileId);
    if (!file) {
      socket.emit("error", { message: "File not found" });
      return;
    }

    const filePath = path.join(__dirname, `../uploads/${file.filename}`);
    const fileBuffer = fs.readFileSync(filePath);

    io.to(receiverSocketId).emit("receive_file", {
      fileName: file.originalname,
      fileContent: fileBuffer,
      senderId,
    });

    io.to(receiverSocketId).emit("notification", {
      type: "file_received",
      message: `📥 File from ${senderId}`,
      fileId: file._id,
      fileName: file.originalname,
      timestamp: new Date().toISOString(),
    });

    socket.emit("notification", {
      type: "file_sent",
      message: `📤 File sent to ${receiverId}`,
      fileId: file._id,
      fileName: file.originalname,
      timestamp: new Date().toISOString(),
    });

    socket.emit("transfer_complete", { status: "success" });
    console.log("✅ File sent successfully");
  } catch (err) {
    console.error("❌ File send error:", err.message);
    socket.emit("transfer_failed", { error: err.message });
  }
};

module.exports = {
  connectedUsers,
  registerUser,
  unregisterUser,
  getReceiverSocketId,
  sendFileToUser,
};
