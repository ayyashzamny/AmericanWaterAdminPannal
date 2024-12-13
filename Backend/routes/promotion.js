const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectToDB = require("../config/db");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit for files
}).single("ImagePath");

// Fetch all records
router.get("/", async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM PromotionImages");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch a single record by ID
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
            .query("SELECT * FROM PromotionImages WHERE Id = @Id");

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        console.error("Error fetching record by ID:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new record
router.post("/", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: `Multer Error: ${err.message}` });
            } else {
                return res.status(500).json({ error: "Unknown error during file upload" });
            }
        }
        next(); // Proceed to the next middleware
    });
}, async (req, res) => {
    const { Title, Description, StartDate, EndDate } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const pool = await connectToDB();
        await pool.request()
            .input("Title", sql.NVarChar, Title)
            .input("Description", sql.NVarChar, Description)
            .input("StartDate", sql.Date, StartDate)
            .input("EndDate", sql.Date, EndDate)
            .input("ImagePath", sql.NVarChar, imagePath)
            .input("CreatedAt", sql.DateTime, new Date())
            .input("UpdatedAt", sql.DateTime, new Date())
            .query(`
                INSERT INTO PromotionImages (Title, Description, StartDate, EndDate, ImagePath, CreatedAt, UpdatedAt)
                VALUES (@Title, @Description, @StartDate, @EndDate, @ImagePath, @CreatedAt, @UpdatedAt)
            `);

        res.status(201).json({ message: "Record created successfully" });
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a record by ID
router.put("/:id", upload, async (req, res) => {
    const { id } = req.params;
    const { Title, Description, StartDate, EndDate } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input("Id", sql.Int, parseInt(id, 10))
            .input("Title", sql.NVarChar, Title)
            .input("Description", sql.NVarChar, Description)
            .input("StartDate", sql.DateTime, StartDate)
            .input("EndDate", sql.DateTime, EndDate)
            .input("ImagePath", sql.NVarChar, imagePath)
            .query(`
                UPDATE PromotionImages
                SET Title = @Title, Description = @Description, StartDate = @StartDate, EndDate = @EndDate,
                    ImagePath = COALESCE(@ImagePath, ImagePath), UpdatedAt = GETDATE()
                WHERE Id = @Id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Record updated successfully" });
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a record by ID and its corresponding image file
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await connectToDB();

        // Fetch the record first to get the image path
        const result = await pool.request()
            .input("Id", sql.Int, parseInt(id, 10))
            .query("SELECT ImagePath FROM PromotionImages WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Extract the image path from the result
        const imagePath = result.recordset[0].ImagePath;

        // Proceed with deleting the record from the database
        const deleteResult = await pool.request()
            .input("Id", sql.Int, parseInt(id, 10))
            .query("DELETE FROM PromotionImages WHERE Id = @Id");

        if (deleteResult.rowsAffected[0] > 0) {
            // If an image exists and it is a valid file, delete it from the server
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);  // Delete the file from the server
            }

            res.status(200).json({ message: "Record and image deleted successfully" });
        } else {
            res.status(404).json({ message: "Record not found" });
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
