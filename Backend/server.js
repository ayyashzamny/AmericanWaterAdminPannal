const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require("./config/db");
const complaintsRoutes = require("./routes/complaints");
const promotionRoutes = require("./routes/promotion");
const notificationRoutes = require("./routes/notifications");
const SendnotificationRoutes = require("./routes/sendNotifications");
const requestRoutes = require("./routes/requests");
const customerRoutes = require("./routes/customers");
const authRouts = require("./routes/login");
const registerRouts = require("./routes/register");
const cors = require("cors");

dotenv.config(); // Load environment variables from a .env file

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Connect to the database
(async () => {
    try {
        console.log("Connecting to the database...");
        await connectToDB();
        console.log("Database connection successful.");
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1); // Exit the application if DB connection fails
    }
})();

// Routes
app.use("/api/complaints", complaintsRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/FirebasePushNotifications/sendToUser", SendnotificationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRouts);
app.use("/api/regauth", registerRouts);

// Error handler middleware
app.use((err, req, res, next) => {
    console.error("Unexpected error:", err.message);
    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred.",
    });
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
