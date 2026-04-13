"use client";

import { useEffect, useState, useRef } from "react";

interface SpotifyPlayerProps {
  token: string;
  onDeviceReady?: (deviceId: string) => void;
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (data: any) => void) => void;
  removeListener: (event: string, callback?: (data: any) => void) => void;
  getCurrentState: () => Promise<any>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => SpotifyPlayer;
    };
  }
}

export default function SpotifyWebPlayer({ token, onDeviceReady }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isPaused, setIsPaused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Smart Music Explorer",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }: any) => {
        console.log("✅ Spotify Web Player Ready with Device ID:", device_id);
        setDeviceId(device_id);
        setIsReady(true);
        
        // Automatically transfer playback to this device
        fetch('http://127.0.0.1:4000/api/playback/transfer', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id })
        }).then(() => {
          console.log("✅ Playback transferred to Web Player");
        }).catch(err => {
          console.log("ℹ️ Could not auto-transfer playback:", err.message);
        });

        if (onDeviceReady) {
          onDeviceReady(device_id);
        }
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);

        spotifyPlayer.getCurrentState().then((playerState) => {
          setIsActive(!!playerState);
        });
      });

      spotifyPlayer.connect();
    };

    return () => {
      player?.disconnect();
    };
  }, [token]);

  // Update position every second when playing
  useEffect(() => {
    if (!isPaused && isActive) {
      const interval = setInterval(() => {
        setPosition((prev) => Math.min(prev + 1000, duration));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, isActive, duration]);

  const handlePlayPause = () => {
    player?.togglePlay();
  };

  const handleNext = () => {
    player?.nextTrack();
  };

  const handlePrevious = () => {
    player?.previousTrack();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    setPosition(newPosition);
    player?.seek(newPosition);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isActive || !currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50
        bg-gradient-to-r from-slate-900/95 via-slate-900/98 to-slate-900/95
        backdrop-blur-xl
        border-t border-slate-700/50
        shadow-2xl shadow-black/50
        p-4 sm:p-5"
      >
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-xs sm:text-sm">
          {isReady ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-50"></div>
                </div>
                <p className="text-emerald-400 font-medium text-sm">🎵 Spotify Web Player Ready</p>
              </div>
              <p className="text-xs text-slate-500">
                Device: <span className="font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded">Smart Music Explorer</span>
              </p>
              <p className="text-xs mt-2 text-slate-500">Click the play button on any track to start listening</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-10 h-10 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30"></div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-300 font-medium">Initializing Spotify Player...</p>
              <p className="text-xs mt-1 text-slate-500">This may take a few seconds</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50
      bg-gradient-to-r from-slate-900/95 via-slate-950/98 to-slate-900/95
      backdrop-blur-xl
      border-t border-slate-700/50
      shadow-2xl shadow-black/50
      p-3 sm:p-4"
    >
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Album Art & Track Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full min-w-0">
            <div className="relative group">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shadow-lg shadow-black/30 
                  transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm sm:text-base text-slate-100 truncate">
                {currentTrack.name}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 truncate">
                {currentTrack.artists.map((a: any) => a.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 w-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handlePrevious}
                className="p-2 sm:p-2.5 
                  text-slate-400 hover:text-slate-100
                  hover:bg-slate-800/80 
                  rounded-full transition-all duration-200
                  hover:scale-110 active:scale-95"
                title="Previous"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="p-3 sm:p-4 
                  bg-gradient-to-br from-emerald-400 to-emerald-600 
                  hover:from-emerald-300 hover:to-emerald-500
                  rounded-full 
                  shadow-lg shadow-emerald-500/30
                  hover:shadow-xl hover:shadow-emerald-500/40
                  transition-all duration-200
                  hover:scale-105 active:scale-95"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 sm:p-2.5 
                  text-slate-400 hover:text-slate-100
                  hover:bg-slate-800/80 
                  rounded-full transition-all duration-200
                  hover:scale-110 active:scale-95"
                title="Next"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-3 w-full max-w-md">
              <span className="text-[10px] sm:text-xs text-slate-500 w-10 text-right font-mono">
                {formatTime(position)}
              </span>
              <div className="flex-1 relative group">
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-150"
                    style={{ width: `${(position / duration) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={position}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Custom thumb on hover */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ left: `calc(${(position / duration) * 100}% - 6px)` }}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 w-10 font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume & Extra Controls */}
          <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">
                <span className="hidden lg:inline">Device: </span>
                <span className="text-emerald-400 font-medium">Web Player</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
