const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
