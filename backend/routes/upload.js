const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload song API
router.post("/", upload.single("song"), (req, res) => {
  const { song_title, artist_id, album_id, genre_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const song_url = `http://localhost:5000/uploads/${req.file.filename}`;

  const sql = `
    INSERT INTO Tracks (title, album_id, genre_id, duration, song_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [song_title, album_id, genre_id, req.body.duration || 0, song_url],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Song uploaded successfully",
        song_url,
      });
    }
  );
});

module.exports = router;