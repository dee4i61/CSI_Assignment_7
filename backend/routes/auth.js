const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
