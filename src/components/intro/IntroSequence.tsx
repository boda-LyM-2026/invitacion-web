import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WaxSeal } from "@/components/shared/WaxSeal";
import { ParticleField } from "@/components/shared/ParticleField";

interface IntroSequenceProps {
  onFinished: () => void;
  novios?: string;
}

type Fase = "oscuridad" | "sobre" | "sello" | "apertura" | "revelacion" | "salida";

const DURACIONES: Record<Fase, number> = {
  oscuridad: 1200,
  sobre: 2000,
  sello: 1800,
  apertura: 2200,
  revelacion: 3000,
  salida: 1500,
};

const ORDEN: Fase[] = ["oscuridad", "sobre", "sello", "apertura", "revelacion", "salida"];

function OliveSprig({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 80 80"
      className={`pointer-events-none absolute h-20 w-20 text-champagne/20 sm:h-24 sm:w-24 ${className}`}
      fill="none"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: [0, -15, 0],
      }}
      transition={{
        opacity: { duration: 1.5, delay },
        scale: { duration: 1.5, delay },
        rotate: { duration: 1.5, delay },
        y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <path
        d="M40 6 C 34 20, 46 28, 40 42 C 34 56, 46 64, 40 76"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[18, 32, 48, 62].map((y, i) => (
        <motion.path
          key={y}
          d={i % 2 === 0 ? `M40 ${y} q -12 -5 -16 2` : `M40 ${y} q 12 -5 16 2`}
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.3 + i * 0.1 }}
        />
      ))}
    </motion.svg>
  );
}

export function IntroSequence({ onFinished, novios = "Lenan & Mauricio" }: IntroSequenceProps) {
  const [fase, setFase] = useState<Fase>("oscuridad");
  const [saliendo, setSaliendo] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      onFinished();
      return;
    }

    if (saliendo) return;

    const idx = ORDEN.indexOf(fase);
    if (idx === ORDEN.length - 1) {
      timeoutRef.current = window.setTimeout(() => setSaliendo(true), DURACIONES[fase]);
    } else {
      timeoutRef.current = window.setTimeout(() => setFase(ORDEN[idx + 1]), DURACIONES[fase]);
    }
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [fase, saliendo, prefersReducedMotion, onFinished]);

  function handleSkip() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setSaliendo(true);
  }

  if (prefersReducedMotion) return null;

  const showEnvelope = fase === "sobre" || fase === "sello" || fase === "apertura";
  const showSeal = fase === "sello" || fase === "apertura";
  const sealBreaking = fase === "apertura";
  const showFlapOpen = fase === "apertura" || fase === "revelacion";
  const showLetter = fase === "apertura" || fase === "revelacion";
  const letterRevealed = fase === "revelacion";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 40%, #2d2d2d 100%)",
      }}
      role="button"
      tabIndex={0}
      aria-label="Toca para continuar a la invitación"
      onClick={handleSkip}
      onKeyDown={(e) => e.key === "Enter" && handleSkip()}
      animate={saliendo ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (saliendo) onFinished();
      }}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Vignette */}
        <div className="absolute inset-0 bg-dark-vignette" />
        {/* Floating particles */}
        <ParticleField count={40} color="rgba(231,219,203,0.4)" />
        {/* Ambient glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(130,134,97,0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Olive sprigs */}
        <OliveSprig className="left-[6%] top-[12%]" delay={0.5} />
        <OliveSprig className="right-[8%] top-[18%] rotate-[130deg]" delay={1.0} />
        <OliveSprig className="bottom-[14%] left-[12%] rotate-[220deg]" delay={0.8} />
        <OliveSprig className="bottom-[10%] right-[6%] rotate-[60deg]" delay={1.3} />
      </div>

      {/* Top text */}
      <motion.p
        className="eyebrow absolute top-[12%] text-champagne/60"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: fase !== "oscuridad" ? 1 : 0, y: fase !== "oscuridad" ? 0 : -20 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Nos casamos
      </motion.p>

      {/* Main content container */}
      <div className="relative" style={{ perspective: 1600 }}>
        {/* Envelope body */}
        <AnimatePresence>
          {showEnvelope && (
            <motion.div
              className="relative h-52 w-72 overflow-hidden rounded-sm sm:h-60 sm:w-80"
              style={{
                background: "linear-gradient(135deg, #E7DBCB 0%, #DDD0B8 50%, #D4C4A8 100%)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              initial={{ opacity: 0, y: 40, scale: 0.85, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Envelope texture lines */}
              <svg viewBox="0 0 256 176" className="absolute inset-0 h-full w-full text-olive/10" preserveAspectRatio="none">
                <path d="M0 0 L128 96 L256 0" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M0 176 L96 88" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M256 176 L160 88" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>

              {/* Inner shadow for depth */}
              <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]" />

              {/* Letter inside */}
              <motion.div
                className="absolute inset-x-4 top-3 flex flex-col items-center justify-center rounded-sm bg-alabaster px-4 py-6 text-center shadow-lg sm:inset-x-5"
                style={{ zIndex: 30 }}
                initial={{ y: 0, opacity: 0, scale: 0.94 }}
                animate={
                  letterRevealed
                    ? { y: "-50vh", opacity: 1, scale: 3 }
                    : showLetter
                      ? { y: "-40%", opacity: 1, scale: 1.05 }
                      : { y: 0, opacity: 0, scale: 0.94 }
                }
                transition={{
                  duration: letterRevealed ? 2 : 1,
                  ease: letterRevealed ? [0.22, 1, 0.36, 1] : "easeOut",
                }}
              >
                <motion.p
                  className="eyebrow text-pistachio-500"
                  animate={{ opacity: letterRevealed ? 1 : 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Con todo nuestro amor, los esperamos
                </motion.p>
                <motion.h1
                  className="font-display text-3xl font-light italic text-olive-900 sm:text-4xl"
                  animate={{
                    opacity: showLetter ? 1 : 0,
                    letterSpacing: letterRevealed ? "0.02em" : "0.15em",
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {novios}
                </motion.h1>
              </motion.div>

              {/* Envelope flap */}
              <motion.div
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: "62%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  zIndex: 20,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(180deg, #D4C4A8 0%, #E7DBCB 100%)",
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: showFlapOpen ? -175 : 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />

              {/* Wax seal */}
              <AnimatePresence>
                {showSeal && (
                  <motion.div
                    className="absolute left-1/2 top-[38%] -translate-x-1/2"
                    style={{ zIndex: 25 }}
                    initial={{ opacity: 1, scale: 1, rotate: 0 }}
                    animate={
                      sealBreaking
                        ? {
                            opacity: 0,
                            scale: 1.8,
                            rotate: 15,
                            transition: { duration: 0.6, ease: "easeIn" },
                          }
                        : {
                            rotate: [0, -8, 8, -5, 0],
                            scale: [1, 1.1, 1, 1.05, 1],
                          }
                    }
                    transition={
                      fase === "sello"
                        ? { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
                        : undefined
                    }
                  >
                    <WaxSeal size={72} animated={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute bottom-8 font-body text-xs uppercase tracking-widest2 text-alabaster/50 underline-offset-4 transition-colors hover:text-alabaster/80 hover:underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        Omitir
      </motion.button>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-16 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1, duration: 2, ease: "easeOut" }}
      />
    </motion.div>
  );
}
