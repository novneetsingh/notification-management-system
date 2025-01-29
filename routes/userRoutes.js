const express = require("express");
const router = express.Router();

// importing middleware
const { auth } = require("../middleware/auth");

// Importing user controller
const {
  signup,
  login,
  updateProfile,
  createNotifications,
} = require("../controllers/userController");

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Update profile route
router.put("/update-profile", auth, updateProfile);

// Create notifications route
router.post("/create-notifications", auth, createNotifications);

module.exports = router;
