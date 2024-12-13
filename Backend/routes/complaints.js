const express = require("express");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Function to validate token
const validateToken = (token) => {
  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return decoded data if the token is valid
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
};

// Fetch all complaints
router.get("/", async (req, res) => {
  // Step 1: Extract token from the Authorization header
  const token = req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access. No token provided." });
  }

  // Step 2: Validate the token and extract the user data (username, id, etc.)
  const decodedToken = validateToken(token);

  // Step 3: Check if the token is valid (decodedToken should not be null)
  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized access. Invalid or expired token." });
  }

  // Log the decoded user data (username, id, etc.) for debugging
  console.log("Decoded Token:", decodedToken);

  try {
    // Step 4: Proceed with database query if token is valid
    const pool = await connectToDB();

    const result = await pool.request().query("SELECT * FROM tbl_Complaints");

    // Return the list of complaints if the token is valid
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Fetch complaint by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .query("SELECT * FROM tbl_Complaints WHERE Id = @Id");

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    }, res);
});

// Create a new complaint
router.post("/", (req, res) => {
    const { MainCategory, SubCategory, Description, Status, AssignedToAdminId, Customer_code, Branch_code } = req.body;

    if (!MainCategory || !SubCategory || !Description || !Status || !Customer_code || !Branch_code) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    handleDBRequest(async (pool) => {
        await pool.request()
            .input("MainCategory", sql.NVarChar, MainCategory)
            .input("SubCategory", sql.NVarChar, SubCategory)
            .input("Description", sql.NVarChar, Description)
            .input("Status", sql.NVarChar, Status)
            .input("AssignedToAdminId", sql.Int, AssignedToAdminId)
            .input("Customer_code", sql.NVarChar, Customer_code)
            .input("Branch_code", sql.NVarChar, Branch_code)
            .query(`
                INSERT INTO tbl_Complaints 
                (MainCategory, SubCategory, Description, Status, AssignedToAdminId, Customer_code, Branch_code, CreatedAt) 
                VALUES (@MainCategory, @SubCategory, @Description, @Status, @AssignedToAdminId, @Customer_code, @Branch_code, GETDATE())
            `);

        res.status(201).json({ message: "Complaint created successfully" });
    }, res);
});

// Update a complaint
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { MainCategory, SubCategory, Description, Status, Remarks } = req.body;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .input("MainCategory", sql.NVarChar, MainCategory)
            .input("SubCategory", sql.NVarChar, SubCategory)
            .input("Description", sql.NVarChar, Description)
            .input("Status", sql.NVarChar, Status)
            .input("Remarks", sql.NVarChar, Remarks)
            .query(`
                UPDATE tbl_Complaints 
                SET MainCategory = @MainCategory, 
                    SubCategory = @SubCategory, 
                    Description = @Description, 
                    Status = @Status, 
                    Remarks = @Remarks, 
                    ResolvedAt = CASE WHEN @Status = 'Resolved' THEN GETDATE() ELSE NULL END 
                WHERE Id = @Id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Complaint updated successfully" });
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    }, res);
});

// Update complaint status
router.put("/status/:id", (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;
    const parsedId = parseInt(id, 10);

    const validStatuses = ["Pending", "Resolved", "In Progress", "Rejected"];

    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
    }

    if (!validStatuses.includes(Status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("Id", sql.Int, parsedId)
            .input("Status", sql.NVarChar, Status)
            .query(`
                UPDATE tbl_Complaints 
                SET Status = @Status, 
                    ResolvedAt = CASE WHEN @Status = 'Resolved' THEN GETDATE() ELSE NULL END 
                WHERE Id = @Id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: `Complaint status updated to ${Status}` });
        } else {
            res.status(404).json({ message: "Complaint not found" });
        }
    }, res);
});

module.exports = router;
