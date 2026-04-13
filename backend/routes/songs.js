const express = require("express");
const router = express.Router();
const db = require("../config/db");


// Get all songs (tracks)
router.get("/", (req, res) => {
  const sql = `
    SELECT t.track_id, t.title AS song_title, t.duration, t.song_url,
           a.name AS artist_name,
           al.title AS album_title,
           g.genre_name
    FROM Tracks t
    LEFT JOIN Albums al ON t.album_id = al.album_id
    LEFT JOIN Artists a ON al.artist_id = a.artist_id
    LEFT JOIN Genres g ON t.genre_id = g.genre_id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

module.exports = router;