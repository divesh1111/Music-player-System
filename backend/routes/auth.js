const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "SUPER_SECRET_KEY_123";

// Ensure the Users table exists automatically
db.run(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// 1. Register API
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Hash the password securely before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO Users (username, password) VALUES (?, ?)";
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Username already exists" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ message: "User registered successfully!", user_id: this.lastID });
    });
  } catch (err) {
    res.status(500).json({ error: "Error hashing password" });
  }
});

// 2. Login API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM Users WHERE username = ?";
  db.get(sql, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database Error" });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    
    res.json({
      message: "Login successful!",
      token,
      user: { id: user.id, username: user.username },
    });
  });
});

// Example of a Protected Route MiddleWare
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    res.json({ message: "Authenticated", user: decoded });
  });
});

module.exports = router;