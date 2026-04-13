"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("1");
  const [genreId, setGenreId] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("song", file);
    formData.append("song_title", title);
    formData.append("album_id", albumId);
    formData.append("genre_id", genreId);
    
    // Create a temporary audio element to read the duration automatically
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    
    audio.onloadedmetadata = async () => {
      formData.append("duration", Math.round(audio.duration).toString());
      
      try {
        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData, // The browser handles the Content-Type header boundary automatically
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || "Upload failed");

        setMessage("Song uploaded successfully!");
        setTitle("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        setTimeout(() => {
          router.push("/app");
        }, 1500);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="flex h-screen bg-black text-slate-100 font-sans overflow-hidden">
      {/* Sidebar (Matching the main app) */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col z-10 hidden md:flex">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 mb-10">
          Music Explorer
        </h1>
        <nav className="flex-1 space-y-4">
          <a href="/app" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
            <span>🎵</span> All Local Songs
          </a>
          <button className="flex items-center gap-3 text-violet-400 font-semibold transition-colors" suppressHydrationWarning>
            <span>⬆️</span> Upload Music
          </button>
        </nav>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/80 p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500 mb-2">
              Upload Track
            </h2>
            <p className="text-zinc-400 text-sm">Add a new song to your local database</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">{error}</div>}
          {message && <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-center text-sm">{message}</div>}

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Song Title</label>
              <input
                type="text"
                required
                suppressHydrationWarning
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
                placeholder="Name of the song"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Album ID</label>
                <input
                  type="number"
                  required
                  suppressHydrationWarning
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Genre ID</label>
                <input
                  type="number"
                  required
                  suppressHydrationWarning
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-colors"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Audio File</label>
              <input
                type="file"
                required
                suppressHydrationWarning
                accept="audio/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 bg-black/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-fuchsia-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-500/10 file:text-violet-400 hover:file:bg-violet-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !title || !file}
              suppressHydrationWarning
              className="w-full py-4 text-black bg-gradient-to-r from-fuchsia-400 to-violet-500 hover:from-fuchsia-300 hover:to-violet-400 font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Uploading..." : "Upload Music"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <button onClick={() => router.push('/app')} className="text-zinc-500 hover:text-violet-400 text-sm transition-colors" suppressHydrationWarning>
               ← Back to Library
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

