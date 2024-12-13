const express = require("express");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Fetch all PushNotificationDeliveries
router.get("/", async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM PushNotificationDeliveries");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch a single PushNotificationDelivery by ID
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
            .query("SELECT notification_id, customer_id, fcm_token, status, viewed_at FROM PushNotificationDeliveries WHERE id = @Id");

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Delivery not found" });
        }
    } catch (error) {
        console.error("Error fetching delivery by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new PushNotificationDelivery
router.post("/", async (req, res) => {
    const { notification_id, customer_id, fcm_token, status, viewed_at } = req.body;

    // Input validation
    if (!notification_id || !customer_id || !fcm_token || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const pool = await connectToDB();
        await pool.request()
            .input("NotificationId", sql.Int, notification_id)
            .input("CustomerId", sql.Int, customer_id)
            .input("FcmToken", sql.NVarChar, fcm_token || null)
            .input("Status", sql.NVarChar, status || null)
            .input("ViewedAt", sql.DateTime, viewed_at || null)  // Allow for null 'viewed_at'
            .query(`
                INSERT INTO PushNotificationDeliveries (notification_id, customer_id, fcm_token, status, viewed_at)
                VALUES (@NotificationId, @CustomerId, @FcmToken, @Status, @ViewedAt)
            `);

        res.status(201).json({ message: "PushNotificationDelivery created successfully" });
    } catch (error) {
        console.error("Error creating delivery:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Update a PushNotificationDelivery by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { notification_id, customer_id, fcm_token, status, viewed_at } = req.body;

    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    // Input validation
    if (!notification_id || !customer_id || !fcm_token || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .input("NotificationId", sql.Int, notification_id)
            .input("CustomerId", sql.Int, customer_id)
            .input("FcmToken", sql.NVarChar, fcm_token)
            .input("Status", sql.NVarChar, status)
            .input("ViewedAt", sql.DateTime, viewed_at || null)  // Allow for null 'viewed_at'
            .query(`
                UPDATE PushNotificationDeliveries
                SET notification_id = @NotificationId, customer_id = @CustomerId, fcm_token = @FcmToken, status = @Status, viewed_at = @ViewedAt
                WHERE id = @Id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "PushNotificationDelivery updated successfully" });
        } else {
            res.status(404).json({ message: "Delivery not found" });
        }
    } catch (error) {
        console.error("Error updating delivery:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a PushNotificationDelivery by ID
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
            .query("DELETE FROM PushNotificationDeliveries WHERE id = @Id");

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Delivery deleted successfully" });
        } else {
            res.status(404).json({ message: "Delivery not found" });
        }
    } catch (error) {
        console.error("Error deleting delivery:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
