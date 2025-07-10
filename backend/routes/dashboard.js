const express = require("express");
const router = express.Router();
const File = require("../models/File");
const User = require("../models/User");
const { getOnlineUsers } = require("../socketService");

router.get("/stats", async (req, res) => {
  try {
    const files = await File.find()
      .populate("sender receiver", "username email")
      .sort({ uploadedAt: -1 });

    const totalTransfers = files.filter(
      (file) => file.sender && file.receiver
    ).length;
    const filesUploaded = files.filter(
      (file) => file.sender && !file.receiver
    ).length;
    const filesDownloaded = totalTransfers;
    const activeUsers = getOnlineUsers()?.length || 0;
    const recentTransfers = files.slice(0, 5);

    res.json({
      totalTransfers,
      filesUploaded,
      filesDownloaded,
      activeUsers,
      recentTransfers,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
});

module.exports = router;
