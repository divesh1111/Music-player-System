import { motion } from "framer-motion";
import type { SpotifyTrack } from "@/types";

interface TrackCardProps {
  track: SpotifyTrack;
  onClick: () => void;
  isPlaying?: boolean;
  index?: number;
}

export default function TrackCard({ track, onClick, isPlaying, index = 0 }: TrackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group relative overflow-hidden
        bg-gradient-to-br from-slate-800/80 to-slate-900/90
        p-4 rounded-2xl
        border border-slate-700/50
        shadow-lg shadow-black/20
        cursor-pointer
        transition-all duration-300 ease-out
        hover:border-emerald-500/40
        hover:shadow-xl hover:shadow-emerald-500/10
        ${isPlaying ? 'ring-2 ring-emerald-500/50 border-emerald-500/50' : ''}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Album art container */}
      <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg">
        <img
          src={track.album.images?.[0]?.url}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          alt={`${track.album.name} cover`}
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40"
          >
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </div>
        
        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-500/90 px-2 py-1 rounded-full">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
      
      {/* Track info */}
      <div className="relative z-10 space-y-1">
        <p className="font-semibold text-sm text-slate-100 truncate group-hover:text-emerald-300 transition-colors">
          {track.name}
        </p>
        <p className="text-xs text-slate-400 truncate group-hover:text-slate-300 transition-colors">
          {track.artists.map((a: any) => a.name).join(", ")}
        </p>
      </div>
      
      {/* Subtle corner accent */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
