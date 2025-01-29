const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file

// Import routes
const userRoutes = require("./routes/userRoutes");

// Define port number
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // Parse JSON requests

// Connect to database and cloudinary
require("./config/database").dbconnect(); // Connect to database

// run cron job and schedule notifications
require("./utils/notificationScheduler").startNotificationScheduler();

// Route setup
app.use("/users", userRoutes); // User routes

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello Hi Bye</h1>"); // Simple response for root route
});

// Activate server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT); // Log server activation
});
