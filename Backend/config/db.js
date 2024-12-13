const sql = require("mssql");
require("dotenv").config();

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Use this if connecting to Azure SQL
        trustServerCertificate: true, // Set to true for local development
    },
};

// Initialize a shared connection pool
let poolPromise;

const connectToDB = async () => {
    if (!poolPromise) {
        try {
            poolPromise = sql.connect(dbConfig);
            await poolPromise; // Ensures connection is ready
            console.log("Connected to the database.......");
        } catch (error) {
            console.error("Database connection failed:", error.message);
            throw new Error("Failed to connect to the database"); // Explicitly throw an error
        }
    }
    return poolPromise;
};

// Export the connection function
module.exports = connectToDB;
