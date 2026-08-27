import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

function GoldenSealLM({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer wax circle */}
      <circle cx="40" cy="40" r="38" fill="#8B6914" opacity="0.9" />
      <circle cx="40" cy="40" r="36" fill="#B8860B" />
      <circle
        cx="40"
        cy="40"
        r="34"
        fill="url(#goldGradient)"
        stroke="#6B4C12"
        strokeWidth="0.5"
      />
      {/* Inner decorative ring */}
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="none"
        stroke="#6B4C12"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle
        cx="40"
        cy="40"
        r="26"
        fill="none"
        stroke="#F5D060"
        strokeWidth="0.3"
        opacity="0.7"
      />
      {/* L */}
      <text
        x="26"
        y="46"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="22"
        fontWeight="300"
        fontStyle="italic"
        fill="#3D2B1F"
        opacity="0.85"
      >
        L
      </text>
      {/* Ampersand */}
      <text
        x="36"
        y="40"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="11"
        fontWeight="300"
        fill="#3D2B1F"
        opacity="0.6"
      >
        &amp;
      </text>
      {/* M */}
      <text
        x="43"
        y="46"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="22"
        fontWeight="300"
        fontStyle="italic"
        fill="#3D2B1F"
        opacity="0.85"
      >
        M
      </text>
      {/* Shine effect */}
      <ellipse
        cx="32"
        cy="30"
        rx="10"
        ry="6"
        fill="white"
        opacity="0.15"
        transform="rotate(-20 32 30)"
      />
      <defs>
        <radialGradient id="goldGradient" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#F5E6A3" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
      </defs>
    </svg>
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
        <div className="absolute inset-0 bg-dark-vignette" />
        <ParticleField count={40} color="rgba(231,219,203,0.4)" />
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
              className="relative h-56 w-80 overflow-hidden sm:h-64 sm:w-96"
              style={{
                borderRadius: "4px",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(231,219,203,0.1)",
              }}
              initial={{ opacity: 0, y: 40, scale: 0.85, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Envelope outer - cream/beige paper */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(145deg, #E8DCC8 0%, #DDD0B8 40%, #D4C4A8 100%)",
                }}
              />

              {/* Subtle paper texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Envelope flap triangle */}
              <motion.div
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: "58%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  zIndex: 20,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(180deg, #CFC0A6 0%, #DDD0B8 100%)",
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: showFlapOpen ? -175 : 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              >
                {/* Flap inner shadow */}
                <div className="absolute inset-0 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.15)]" />
              </motion.div>

              {/* Inner lining - slightly lighter, visible when open */}
              <div
                className="absolute inset-0 rounded-[2px]"
                style={{
                  background: "linear-gradient(180deg, #F5F0E6 0%, #EDE5D5 100%)",
                  zIndex: 2,
                }}
              />

              {/* Inner shadow for depth when closed */}
              <motion.div
                className="absolute inset-0"
                style={{
                  boxShadow: "inset 0 2px 15px rgba(0,0,0,0.08)",
                  zIndex: 3,
                }}
                animate={{ opacity: showFlapOpen ? 0 : 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Letter inside */}
              <motion.div
                className="absolute inset-x-4 top-4 flex flex-col items-center justify-center rounded-sm bg-white px-4 py-8 text-center sm:inset-x-5"
                style={{
                  zIndex: 30,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                initial={{ y: 0, opacity: 0, scale: 0.94 }}
                animate={
                  letterRevealed
                    ? { y: "-55vh", opacity: 1, scale: 3.5 }
                    : showLetter
                      ? { y: "-35%", opacity: 1, scale: 1.02 }
                      : { y: 0, opacity: 0, scale: 0.94 }
                }
                transition={{
                  duration: letterRevealed ? 2.2 : 1,
                  ease: letterRevealed ? [0.22, 1, 0.36, 1] : "easeOut",
                }}
              >
                <motion.p
                  className="eyebrow text-ink-muted/60"
                  animate={{ opacity: letterRevealed ? 1 : 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Con todo nuestro amor, los esperamos
                </motion.p>
                <motion.h1
                  className="mt-3 font-display text-3xl font-light italic text-olive-900 sm:text-4xl"
                  animate={{
                    opacity: showLetter ? 1 : 0,
                    letterSpacing: letterRevealed ? "0.02em" : "0.12em",
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {novios}
                </motion.h1>
              </motion.div>

              {/* Golden LM Seal */}
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
                            scale: 2,
                            rotate: 20,
                            transition: { duration: 0.8, ease: "easeIn" },
                          }
                        : {
                            rotate: [0, -5, 5, -3, 0],
                            scale: [1, 1.05, 1, 1.03, 1],
                          }
                    }
                    transition={
                      fase === "sello"
                        ? { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
                        : undefined
                    }
                  >
                    <GoldenSealLM size={76} />
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
