import { motion, AnimatePresence } from "framer-motion";
import type { TrackDetails as TrackDetailsType } from "@/types";

interface TrackDetailsProps {
  details: TrackDetailsType | null;
  onClose: () => void;
}

export default function TrackDetails({ details, onClose }: TrackDetailsProps) {
  if (!details) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed right-0 top-0 w-80 h-full z-30
          bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-950/99
          backdrop-blur-xl
          border-l border-slate-700/50
          shadow-2xl shadow-black/50
          overflow-hidden pb-28"
      >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content container with scroll */}
        <div className="relative h-full overflow-y-auto p-5 scrollbar-hide">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                ♪
              </span>
              Track Details
            </h2>
            <motion.button 
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center
                bg-slate-800/80 hover:bg-red-500/20
                text-slate-400 hover:text-red-400
                rounded-lg border border-slate-700/50 hover:border-red-500/30
                transition-all duration-200"
              aria-label="Close details"
            >
              ✕
            </motion.button>
          </div>

          {/* Album Art */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative mb-5 rounded-2xl overflow-hidden shadow-xl shadow-black/30 group"
          >
            <img 
              src={details.image} 
              alt={`${details.song} album cover`} 
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-bold text-base text-white drop-shadow-lg">{details.song}</p>
              <p className="text-sm text-slate-300 drop-shadow">{details.artist}</p>
            </div>
          </motion.div>

          {/* Similar Songs Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Similar Songs
            </h3>
            <div className="space-y-2">
              {details.similar && details.similar.length > 0 ? (
                details.similar.map((s, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + idx * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-3 p-3
                      bg-slate-800/50 hover:bg-slate-800/80
                      rounded-xl
                      border border-slate-700/30 hover:border-emerald-500/30
                      cursor-pointer
                      transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                      🎵
                    </div>
                    <span className="text-sm text-slate-200 group-hover:text-emerald-300 transition-colors flex-1 truncate">
                      {s}
                    </span>
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                ))
              ) : (
                <div className="text-sm text-slate-500 text-center py-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700/50">
                  No similar songs found
                </div>
              )}
            </div>
          </motion.div>

          {/* Lyrics Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Lyrics
            </h3>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80 pointer-events-none z-10 rounded-xl" />
              <div className="text-sm leading-relaxed text-slate-300
                bg-gradient-to-br from-slate-800/60 to-slate-900/60
                p-4 rounded-xl
                border border-slate-700/30
                max-h-80 overflow-y-auto
                whitespace-pre-line
                scrollbar-hide"
              >
                {details.lyrics || (
                  <div className="text-slate-500 text-center py-8">
                    <span className="text-2xl mb-2 block">📝</span>
                    Lyrics not available
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom padding for scroll */}
          <div className="h-8" />
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
