-- Create Database
CREATE DATABASE IF NOT EXISTS MusicLibrary;
USE MusicLibrary;

-- =========================
-- 1. TABLES (SCHEMA)
-- =========================

-- Artists Table
CREATE TABLE Artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50)
);

-- Genres Table
CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(50) NOT NULL
);

-- Albums Table
CREATE TABLE Albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INT,
    release_year YEAR,
    FOREIGN KEY (artist_id) REFERENCES Artists(artist_id)
);

-- Tracks Table
CREATE TABLE Tracks (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    album_id INT,
    genre_id INT,
    duration INT, -- duration in seconds
    FOREIGN KEY (album_id) REFERENCES Albums(album_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

-- Playlists Table
CREATE TABLE Playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Playlist Tracks (Many-to-Many)
CREATE TABLE Playlist_Tracks (
    playlist_id INT,
    track_id INT,
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES Playlists(playlist_id),
    FOREIGN KEY (track_id) REFERENCES Tracks(track_id)
);

-- =========================
-- 2. INSERT DATA (CREATE)
-- =========================

INSERT INTO Artists (name, country) VALUES
('Arijit Singh', 'India'),
('Taylor Swift', 'USA');

INSERT INTO Genres (genre_name) VALUES
('Pop'),
('Rock'),
('Romantic');

INSERT INTO Albums (title, artist_id, release_year) VALUES
('Album A', 1, 2020),
('Album B', 2, 2021);

INSERT INTO Tracks (title, album_id, genre_id, duration) VALUES
('Song 1', 1, 3, 210),
('Song 2', 2, 1, 180);

INSERT INTO Playlists (name) VALUES
('My Favorites');

INSERT INTO Playlist_Tracks (playlist_id, track_id) VALUES
(1, 1),
(1, 2);

-- =========================
-- 3. READ (SELECT QUERIES)
-- =========================

-- Get all songs with artist and genre
SELECT t.title AS Song, a.name AS Artist, g.genre_name AS Genre
FROM Tracks t
JOIN Albums al ON t.album_id = al.album_id
JOIN Artists a ON al.artist_id = a.artist_id
JOIN Genres g ON t.genre_id = g.genre_id;

-- Search by song title
SELECT * FROM Tracks WHERE title LIKE '%Song%';

-- Search by artist
SELECT t.title, a.name
FROM Tracks t
JOIN Albums al ON t.album_id = al.album_id
JOIN Artists a ON al.artist_id = a.artist_id
WHERE a.name = 'Arijit Singh';

-- Search by genre
SELECT t.title, g.genre_name
FROM Tracks t
JOIN Genres g ON t.genre_id = g.genre_id
WHERE g.genre_name = 'Pop';

-- =========================
-- 4. UPDATE
-- =========================

UPDATE Tracks
SET duration = 200
WHERE track_id = 1;

-- =========================
-- 5. DELETE
-- =========================

DELETE FROM Tracks
WHERE track_id = 2;

-- =========================
-- 6. ANALYSIS QUERIES
-- =========================

-- Count songs per genre
SELECT g.genre_name, COUNT(*) AS total_songs
FROM Tracks t
JOIN Genres g ON t.genre_id = g.genre_id
GROUP BY g.genre_name;

-- Most popular artist (based on number of tracks)
SELECT a.name, COUNT(*) AS total_tracks
FROM Tracks t
JOIN Albums al ON t.album_id = al.album_id
JOIN Artists a ON al.artist_id = a.artist_id
GROUP BY a.name
ORDER BY total_tracks DESC;

ALTER TABLE Tracks ADD song_url VARCHAR(255);