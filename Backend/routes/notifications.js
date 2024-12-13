const express = require("express");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Fetch all notifications
router.get("/", async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM PushNotifications");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch a single notification by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .query("SELECT id, title, description, imageUrl, url, createdDate FROM PushNotifications WHERE id = @Id");

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        console.error("Error fetching notification by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new notification
router.post("/", async (req, res) => {
    const { title, description, imageUrl, url } = req.body;

    // Input validation
    if (!title || !description || !imageUrl || !url) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const pool = await connectToDB();
        await pool.request()
            .input("Title", sql.NVarChar, title)
            .input("Description", sql.NVarChar, description)
            .input("ImageUrl", sql.NVarChar, imageUrl)
            .input("Url", sql.NVarChar, url)
            .query(`
                INSERT INTO PushNotifications (title, description, imageUrl, url, createdDate)
                VALUES (@Title, @Description, @ImageUrl, @Url, GETDATE())
            `);

        res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a notification by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, url } = req.body;

    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    // Input validation
    if (!title || !description || !imageUrl || !url) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .input("Title", sql.NVarChar, title)
            .input("Description", sql.NVarChar, description)
            .input("ImageUrl", sql.NVarChar, imageUrl)
            .input("Url", sql.NVarChar, url)
            .query(`
                UPDATE PushNotifications
                SET title = @Title, description = @Description, imageUrl = @ImageUrl, url = @Url
                WHERE id = @Id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Notification updated successfully" });
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a notification by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .query("DELETE FROM PushNotifications WHERE id = @Id");

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Notification deleted successfully" });
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
