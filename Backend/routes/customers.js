const express = require("express");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Fetch all notifications
router.get("/", async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM CustomerRegistrationHeader");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
