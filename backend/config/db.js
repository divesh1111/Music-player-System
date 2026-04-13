const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../music_library.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to SQLite Database");
  }
});

module.exports = db;