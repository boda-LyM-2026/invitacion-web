import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  src?: string;
  className?: string;
}

export function AudioPlayer({ src = "/audio/background-music.mp3", className = "" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Si el archivo no existe (no subido en deploy) el reproductor no aparece.
  const [indisponible, setIndisponible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => setIndisponible(true);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const iniciarMusica = () => {
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    window.addEventListener("iniciar-musica-boda", iniciarMusica);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener("iniciar-musica-boda", iniciarMusica);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      localStorage.setItem("wedding-audio-playing", "false");
    } else {
      audio.play().catch(() => {});
      localStorage.setItem("wedding-audio-playing", "true");
    }
    setIsPlaying(!isPlaying);
  };

  if (indisponible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[80] ${className}`}>
      <audio ref={audioRef} src={src} loop preload="none" />

      <motion.div
        className="relative flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >


        {/* Control buttons */}
        <div className="flex items-center gap-1 rounded-full bg-cinematic-dark/80 p-0.3 shadow-cinematic backdrop-blur-md">
          {/* Play/Pause */}
          <motion.button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-olive/80 text-alabaster transition-colors hover:bg-olive"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}

            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Sound waves animation */}
        {isPlaying && (
          <motion.div
            className="absolute -left-8 flex items-end gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full bg-olive/60"
                animate={{
                  height: [4, 12, 4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
