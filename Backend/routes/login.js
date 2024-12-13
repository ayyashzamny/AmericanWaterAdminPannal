const express = require("express");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const connectToDB = require("../config/db");

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// JWT Secret Key from the .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Login Endpoint
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const pool = await connectToDB();

        // Query to find the user by username
        const result = await pool.request()
            .input("Username", sql.NVarChar, username)
            .query("SELECT id, username, password, email, role FROM AdminPannalLogin WHERE username = @Username");

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const user = result.recordset[0];

        // Compare the provided password with the hashed password in the database using bcrypt
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response with the JWT token
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
