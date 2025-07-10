const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "username email _id"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};
