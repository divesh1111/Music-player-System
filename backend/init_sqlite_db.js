const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "music_library.db");
const db = new sqlite3.Database(dbPath);

const initSql = `
-- Artists Table
CREATE TABLE IF NOT EXISTS Artists (
    artist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT
);

-- Genres Table
CREATE TABLE IF NOT EXISTS Genres (
    genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_name TEXT NOT NULL
);

-- Albums Table
CREATE TABLE IF NOT EXISTS Albums (
    album_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist_id INTEGER,
    release_year INTEGER,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id)
);

-- Tracks Table
CREATE TABLE IF NOT EXISTS Tracks (
    track_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    album_id INTEGER,
    genre_id INTEGER,
    duration INTEGER,
    song_url TEXT,
    FOREIGN KEY (album_id) REFERENCES Albums(album_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS Playlists (
    playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Playlist Tracks (Many-to-Many)
CREATE TABLE IF NOT EXISTS Playlist_Tracks (
    playlist_id INTEGER,
    track_id INTEGER,
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id),
    FOREIGN KEY (track_id) REFERENCES Tracks(track_id)
);

-- Seed Data using INSERT OR IGNORE to prevent duplicates
INSERT OR IGNORE INTO Artists (artist_id, name, country) VALUES
(1, 'Arijit Singh', 'India'),
(2, 'Taylor Swift', 'USA');

INSERT OR IGNORE INTO Genres (genre_id, genre_name) VALUES
(1, 'Pop'),
(2, 'Rock'),
(3, 'Romantic');

INSERT OR IGNORE INTO Albums (album_id, title, artist_id, release_year) VALUES
(1, 'Album A', 1, 2020),
(2, 'Album B', 2, 2021);

INSERT OR IGNORE INTO Tracks (track_id, title, album_id, genre_id, duration) VALUES
(1, 'Song 1', 1, 3, 210),
(2, 'Song 2', 2, 1, 180);

INSERT OR IGNORE INTO Playlists (playlist_id, name) VALUES
(1, 'My Favorites');

INSERT OR IGNORE INTO Playlist_Tracks (playlist_id, track_id) VALUES
(1, 1),
(1, 2);
`;

console.log("Initializing SQLite database...");

db.serialize(() => {
  db.exec(initSql, (err) => {
    if (err) {
      console.error("Error creating tables or inserting data:", err.message);
    } else {
      console.log("Database initialized successfully with SQLite!");
    }
    db.close();
  });
});
