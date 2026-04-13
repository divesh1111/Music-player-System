"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

interface Track {
  track_id: number;
  song_title: string;
  duration: number;
  song_url: string | null;
  artist_name: string | null;
  album_title: string | null;
  genre_name: string | null;
}

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const userData = localStorage.getItem("user_data");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      router.push("/login");
      return;
    }

    // Fetch songs from local backend
    fetch(`${API_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
      })
      .catch((err) => console.error("Error fetching songs:", err))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePlayPause = (track: Track) => {
    if (!track.song_url) {
      alert("This track does not have an audio file yet!");
      return;
    }

    if (currentTrack?.track_id === track.track_id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // Wait for React to update the <audio> tag with the new src prop.
      // The autoPlay attribute handles playback automatically.
    }
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.track_id === currentTrack.track_id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    if (nextTrack.song_url) handlePlayPause(nextTrack);
  };

  const playPrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.track_id === currentTrack.track_id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    if (prevTrack.song_url) handlePlayPause(prevTrack);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading database...</div>;
  }

  return (
    <div className="flex h-screen bg-black text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col z-10">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-10">
          Music Explorer
        </h1>
        <nav className="flex-1 space-y-4">
          <button className="flex items-center gap-3 text-violet-400 font-semibold transition-colors">
            <span>🎵</span> All Local Songs
          </button>
          <a href="/upload" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
            <span>⬆️</span> Upload Music
          </a>
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-400 mb-4">User: <span className="text-white font-semibold">{user?.username}</span></p>
          <button
            onClick={() => {
              localStorage.removeItem("user_token");
              localStorage.removeItem("user_data");
              router.push("/login");
            }}
            className="w-full py-2 bg-zinc-900 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-lg text-sm transition-colors border border-zinc-800 hover:border-red-500/30 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Background gradient effect */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-8 pb-32 relative z-10">
          <h2 className="text-3xl font-bold mb-2">Your Local Library</h2>
          <p className="text-zinc-400 mb-8 text-sm">Streaming directly from SQLite Database</p>
          
          {tracks.length === 0 ? (
             <div className="text-zinc-500 text-center mt-20">
             No tracks found in the database. <br/>
           </div>
          ) : (
            <div className="bg-zinc-900/30 rounded-xl overflow-hidden border border-zinc-800/50">
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50">
                <div className="w-8">#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>Album</div>
              </div>

              <div className="divide-y divide-zinc-800/30">
                {tracks.map((track, idx) => {
                  const isActive = currentTrack?.track_id === track.track_id;
                  const canPlay = !!track.song_url;
                  
                  return (
                    <div
                      key={track.track_id}
                      onClick={() => handlePlayPause(track)}
                      className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-4 items-center transition-all duration-200 ${
                        isActive ? "bg-violet-500/10 text-violet-400" : canPlay ? "hover:bg-zinc-800/50 cursor-pointer" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="w-8 text-zinc-500 text-sm">
                        {isActive && isPlaying ? (
                           <div className="w-4 h-4 text-violet-400 flex items-center justify-center">▶</div>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${isActive ? "text-violet-400" : "text-white"}`}>
                          {track.song_title}
                        </div>
                        <div className="text-xs text-zinc-500">{track.genre_name || "Unknown Genre"}</div>
                      </div>
                      <div className="text-sm text-zinc-400">{track.artist_name || "Unknown Artist"}</div>
                      <div className="text-sm text-zinc-400">{track.album_title || "Unknown Album"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Player Bar */}
        {currentTrack && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between z-50">
            {/* Track Info */}
            <div className="flex items-center w-1/3">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-md flex items-center justify-center text-2xl mr-4 shadow-lg">
                🎵
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden">{currentTrack.song_title}</h4>
                <p className="text-xs text-zinc-400 whitespace-nowrap text-ellipsis overflow-hidden">{currentTrack.artist_name || "Unknown Artist"}</p>
              </div>
            </div>

            {/* Core Controls */}
            <div className="flex flex-col items-center justify-center w-1/3 max-w-[400px]">
              <div className="flex items-center gap-8">
                <button onClick={playPrev} className="text-zinc-400 hover:text-white transition">⏮</button>
                <button
                  onClick={() => handlePlayPause(currentTrack)}
                  className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button onClick={playNext} className="text-zinc-400 hover:text-white transition">⏭</button>
              </div>
              <audio 
                ref={audioRef} 
                src={currentTrack.song_url || undefined} 
                autoPlay 
                onEnded={playNext}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Extra Controls */}
            <div className="w-1/3 flex justify-end">
              <div className="text-xs text-violet-500/80 border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 rounded-full font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
                Local Database
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

