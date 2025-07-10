const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getTransferHistory,
  downloadFile,
} = require("../controllers/fileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/multer");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

router.get("/history", authMiddleware, getTransferHistory);

router.get("/download/:fileId", authMiddleware, downloadFile);

module.exports = router;
