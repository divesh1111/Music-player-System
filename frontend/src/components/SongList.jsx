import { useEffect, useState } from "react";
import axios from "axios";
import { Music, Search, Download } from "lucide-react";

function SongList() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/songs")
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  const filteredSongs = songs.filter((song) =>
    (song.song_title || "").toLowerCase().includes(search.toLowerCase()) ||
    (song.artist_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (song.album_title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#a1a1aa" }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search for songs, artists, or albums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "50px", fontSize: "1.1rem", borderRadius: "12px", height: "60px", background: "rgba(255,255,255,0.05)" }}
        />
      </div>

      <div className="songs-grid">
        {filteredSongs.length === 0 ? (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#a1a1aa", fontSize: "1.2rem", padding: "40px" }}>
            No tracks found matching your search.
          </p>
        ) : (
          filteredSongs.map((song) => (
            <div key={song.track_id} className="glass-card">
              <div className="song-header">
                <div className="song-art">
                  <Music size={28} color="#71717a" />
                </div>
                <div className="song-info">
                  <h3>{song.song_title}</h3>
                  <p>{song.artist_name || "Unknown Artist"} • {song.album_title || "Unknown Album"}</p>
                </div>
              </div>
              
              <div className="meta-tags">
                <span className="meta-tag">{song.genre_name || "Unknown Genre"}</span>
                {song.duration > 0 && <span className="meta-tag">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>}
              </div>

              {song.song_url ? (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <audio controls>
                    <source src={song.song_url} type="audio/mpeg" />
                  </audio>
                  <a
                    href={song.song_url}
                    download={song.song_title || "track"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              ) : (
                <div style={{ marginTop: "20px", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", textAlign: "center", color: "#71717a", fontSize: "0.9rem" }}>
                  No audio file uploaded for this track
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SongList;