const File = require("../models/File");
const path = require("path");
const fs = require("fs");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      sender: req.user.id,
      receiver: req.body.receiverId,
    });

    await newFile.save();

    // Emit real-time notification
    const io = req.app.get("io");
    io.to(req.body.receiverId).emit("file:received", {
      file: {
        originalname: req.file.originalname,
        sender: req.user.id,
        filename: req.file.filename,
        timestamp: newFile.createdAt,
      },
    });

    res.status(201).json({ message: "File uploaded", file: newFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload error" });
  }
};

exports.getTransferHistory = async (req, res) => {
  try {
    const sent = await File.find({ sender: req.user.id });
    const received = await File.find({ receiver: req.user.id });
    res.json({ sent, received });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching history" });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    if (
      file.sender.toString() !== req.user.id &&
      file.receiver.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const filePath = path.join(process.cwd(), "/utils/uploads", file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server" });
    }

    res.download(filePath, file.originalname, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file" });
      } else {
      }
    });
  } catch (error) {
    console.error("Caught unexpected error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
};
