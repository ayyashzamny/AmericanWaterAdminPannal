const express = require("express");
const sql = require("mssql");
const connectToDB = require("../config/db");

const router = express.Router();

// Helper function to handle database queries
const handleDBRequest = async (callback, res) => {
    try {
        const pool = await connectToDB();
        await callback(pool);
    } catch (error) {
        console.error("Database operation error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Fetch all requests
// router.get("/", (req, res) => {
//     handleDBRequest(async (pool) => {
//         const result = await pool.request().query("SELECT * FROM CustomerRequestHeader");
//         res.status(200).json(result.recordset);
//     }, res);
// });

// Fetch all requests
router.get("/", (req, res) => {
    handleDBRequest(async (pool) => {
        const result = await pool.request().query(`
            SELECT *
            FROM CustomerRequestHeader r, CustomerReqStatus c, RequestCategories rc
            WHERE r.TicketStatus = c.ReqStatusID
            AND rc.MCatID = r.MainCatID
            AND rc.SCatID = r.SubCatID
            AND rc.SCat3ID = r.SubCat3ID
            ORDER BY r.TicketNo;
            `);
        res.status(200).json(result.recordset);
    }, res);
});


//get all the request status
router.get("/status", (req, res) => {
    handleDBRequest(async (pool) => {
        const result = await pool.request().query("SELECT * FROM CustomerReqStatus");
        res.status(200).json(result.recordset);
    }, res);
});

// Fetch request by TicketNo
router.get("/:ticketNo", (req, res) => {
    const { ticketNo } = req.params;

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("TicketNo", sql.NVarChar, ticketNo)
            .query("SELECT * FROM CustomerRequestHeader WHERE TicketNo = @TicketNo");

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    }, res);
});

// Create a new request
router.post("/", (req, res) => {
    const { CusID, CustomerCode, BranchCode, MainCatID, SubCatID, SubCat3ID, RequesBody, TicketStatus, Remarks } = req.body;

    if (!CusID || !CustomerCode || !BranchCode || !MainCatID || !SubCatID || !RequesBody || !TicketStatus) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    handleDBRequest(async (pool) => {
        await pool.request()
            .input("CusID", sql.Int, CusID)
            .input("CustomerCode", sql.NVarChar, CustomerCode)
            .input("BranchCode", sql.NVarChar, BranchCode)
            .input("MainCatID", sql.Int, MainCatID)
            .input("SubCatID", sql.Int, SubCatID)
            .input("SubCat3ID", sql.Int, SubCat3ID)
            .input("RequesBody", sql.NVarChar, RequesBody)
            .input("TicketStatus", sql.NVarChar, TicketStatus)
            .input("Remarks", sql.NVarChar, Remarks)
            .query(`
                INSERT INTO CustomerRequestHeader 
                (CusID, CustomerCode, BranchCode, MainCatID, SubCatID, SubCat3ID, RequesBody, RecordedDate, TicketStatus, Remarks) 
                VALUES (@CusID, @CustomerCode, @BranchCode, @MainCatID, @SubCatID, @SubCat3ID, @RequesBody, GETDATE(), @TicketStatus, @Remarks)
            `);

        res.status(201).json({ message: "Request created successfully" });
    }, res);
});

// Update a request
router.put("/:ticketNo", (req, res) => {
    const { ticketNo } = req.params;
    const { MainCatID, SubCatID, SubCat3ID, RequesBody, TicketStatus, Remarks } = req.body;

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("TicketNo", sql.NVarChar, ticketNo)
            .input("MainCatID", sql.Int, MainCatID)
            .input("SubCatID", sql.Int, SubCatID)
            .input("SubCat3ID", sql.Int, SubCat3ID)
            .input("RequesBody", sql.NVarChar, RequesBody)
            .input("TicketStatus", sql.NVarChar, TicketStatus)
            .input("Remarks", sql.NVarChar, Remarks)
            .query(`
                UPDATE CustomerRequestHeader 
                SET MainCatID = @MainCatID, 
                    SubCatID = @SubCatID, 
                    SubCat3ID = @SubCat3ID, 
                    RequesBody = @RequesBody, 
                    TicketStatus = @TicketStatus, 
                    Remarks = @Remarks, 
                    CompletedDate = CASE WHEN @TicketStatus = 'Completed' THEN GETDATE() ELSE NULL END 
                WHERE TicketNo = @TicketNo
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Request updated successfully" });
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    }, res);
});

// Delete a request
router.delete("/:ticketNo", (req, res) => {
    const { ticketNo } = req.params;

    handleDBRequest(async (pool) => {
        const result = await pool.request()
            .input("TicketNo", sql.NVarChar, ticketNo)
            .query("DELETE FROM CustomerRequestHeader WHERE TicketNo = @TicketNo");

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: "Request deleted successfully" });
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    }, res);
});

module.exports = router;
