const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const dotenv = require('dotenv');
const connectToDB = require('../config/db');

dotenv.config(); // Load environment variables

const router = express.Router();

// Register Endpoint
router.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const pool = await connectToDB();

    // Check if username already exists
    const existingUser = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query('SELECT id FROM AdminPannalLogin WHERE username = @Username');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate JWT token
    const payload = { username, email, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Insert new user into the database and store the JWT token
    await pool.request()
      .input('Username', sql.NVarChar, username)
      .input('Password', sql.NVarChar, hashedPassword)
      .input('Email', sql.NVarChar, email)
      .input('Role', sql.NVarChar, role)
      .input('Token', sql.NVarChar, token)
      .query(`
        INSERT INTO AdminPannalLogin (username, password, email, role, access_token, created_at, updated_at)
        VALUES (@Username, @Password, @Email, @Role, @Token, GETDATE(), GETDATE())
      `);

    res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
