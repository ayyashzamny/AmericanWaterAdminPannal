const express = require("express");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Fetch all complaints
router.get("/", async (req, res) => {
  try {
    // Step 1: Connect to the database
    const pool = await connectToDB();

    // Step 2: Query the database for complaints
    const result = await pool.request().query("SELECT * FROM tbl_Complaints");

    // Step 3: Return the list of complaints
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch complaint by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
  }

  try {
    // Step 1: Connect to the database
    const pool = await connectToDB();

    // Step 2: Query the database for a specific complaint by ID
    const result = await pool.request()
      .input("Id", sql.Int, parsedId)
      .query("SELECT * FROM tbl_Complaints WHERE Id = @Id");

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (error) {
    console.error("Error fetching complaint by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update complaint status
router.put("/status/:id", async (req, res) => {
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

  try {
    // Step 1: Connect to the database
    const pool = await connectToDB();

    // Step 2: Update the complaint status in the database
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
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Create a new complaint
// router.post("/", (req, res) => {
//     const { MainCategory, SubCategory, Description, Status, AssignedToAdminId, Customer_code, Branch_code } = req.body;

//     if (!MainCategory || !SubCategory || !Description || !Status || !Customer_code || !Branch_code) {
//         return res.status(400).json({ error: "Missing required fields." });
//     }

//     handleDBRequest(async (pool) => {
//         await pool.request()
//             .input("MainCategory", sql.NVarChar, MainCategory)
//             .input("SubCategory", sql.NVarChar, SubCategory)
//             .input("Description", sql.NVarChar, Description)
//             .input("Status", sql.NVarChar, Status)
//             .input("AssignedToAdminId", sql.Int, AssignedToAdminId)
//             .input("Customer_code", sql.NVarChar, Customer_code)
//             .input("Branch_code", sql.NVarChar, Branch_code)
//             .query(`
//                 INSERT INTO tbl_Complaints 
//                 (MainCategory, SubCategory, Description, Status, AssignedToAdminId, Customer_code, Branch_code, CreatedAt) 
//                 VALUES (@MainCategory, @SubCategory, @Description, @Status, @AssignedToAdminId, @Customer_code, @Branch_code, GETDATE())
//             `);

//         res.status(201).json({ message: "Complaint created successfully" });
//     }, res);
// });

// Update a complaint
// router.put("/:id", (req, res) => {
//     const { id } = req.params;
//     const { MainCategory, SubCategory, Description, Status, Remarks } = req.body;
//     const parsedId = parseInt(id, 10);

//     if (isNaN(parsedId) || parsedId <= 0) {
//         return res.status(400).json({ error: "Invalid ID. Must be a positive integer." });
//     }

//     handleDBRequest(async (pool) => {
//         const result = await pool.request()
//             .input("Id", sql.Int, parsedId)
//             .input("MainCategory", sql.NVarChar, MainCategory)
//             .input("SubCategory", sql.NVarChar, SubCategory)
//             .input("Description", sql.NVarChar, Description)
//             .input("Status", sql.NVarChar, Status)
//             .input("Remarks", sql.NVarChar, Remarks)
//             .query(`
//                 UPDATE tbl_Complaints 
//                 SET MainCategory = @MainCategory, 
//                     SubCategory = @SubCategory, 
//                     Description = @Description, 
//                     Status = @Status, 
//                     Remarks = @Remarks, 
//                     ResolvedAt = CASE WHEN @Status = 'Resolved' THEN GETDATE() ELSE NULL END 
//                 WHERE Id = @Id
//             `);

//         if (result.rowsAffected[0] > 0) {
//             res.status(200).json({ message: "Complaint updated successfully" });
//         } else {
//             res.status(404).json({ message: "Complaint not found" });
//         }
//     }, res);
// });



module.exports = router;
