const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const {
  registerUser,
  unregisterUser,
  sendFileToUser,
} = require("./socketService");

module.exports = (io) => {
  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const parsedCookies = cookie.parse(cookies || "");
    const token = parsedCookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`🟢 User connected: ${userId}`);
    registerUser(userId, socket.id);

    socket.on("send_file", async ({ fileId, receiverId }) => {
      console.log(`📩 'send_file' from ${userId} to ${receiverId}`);
      await sendFileToUser({
        io,
        fileId,
        senderId: userId,
        receiverId,
        socket,
      });
    });

    socket.on("disconnect", () => {
      unregisterUser(socket.id);
    });
  });
};
