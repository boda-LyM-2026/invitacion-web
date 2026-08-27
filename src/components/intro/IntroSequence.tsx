import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WaxSeal } from "@/components/shared/WaxSeal";

interface IntroSequenceProps {
  onFinished: () => void;
  novios?: string;
}

type Fase = "sobre" | "sello" | "apertura" | "titulo";

const DURACIONES: Record<Fase, number> = {
  sobre: 1100,
  sello: 1200,
  apertura: 1300,
  titulo: 2000,
};

const ORDEN: Fase[] = ["sobre", "sello", "apertura", "titulo"];
const DURACION_SALIDA = 0.8;

/** Ramita decorativa de fondo: mismo lenguaje visual que OliveDivider, pero suelta y flotante. */
function RamitaFlotante({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      className={`pointer-events-none absolute h-16 w-16 text-champagne/25 sm:h-20 sm:w-20 ${className}`}
      fill="none"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [0, 4, 0] }}
      transition={{
        opacity: { duration: 1.2, delay },
        scale: { duration: 1.2, delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <path
        d="M30 4 C 26 16, 34 22, 30 32 C 26 42, 34 48, 30 56"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {[14, 26, 38, 48].map((y, i) => (
        <path
          key={y}
          d={i % 2 === 0 ? `M30 ${y} q -9 -4 -13 2` : `M30 ${y} q 9 -4 13 2`}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ))}
    </motion.svg>
  );
}

/**
 * RF-04. Un mismo sobre persiste durante toda la secuencia y va cambiando
 * de estado (no son escenas que se reemplazan de golpe): cerrado -> el
 * sello se agrieta y se rompe -> la solapa se abre -> la carta sale del
 * sobre y crece hasta revelar los nombres -> fundido hacia la invitación.
 */
export function IntroSequence({ onFinished, novios = "Lenan & Mauricio" }: IntroSequenceProps) {
  const [fase, setFase] = useState<Fase>("sobre");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, saliendo]);

  function handleSkip() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setSaliendo(true);
  }

  if (prefersReducedMotion) return null;

  const solapaAbierta = fase === "apertura" || fase === "titulo";
  const sellosRoto = fase === "apertura" || fase === "titulo";
  const cartaAsomada = fase === "apertura";
  const cartaRevelada = fase === "titulo";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-olive-fade"
      role="button"
      tabIndex={0}
      aria-label="Toca para continuar a la invitación"
      onClick={handleSkip}
      onKeyDown={(e) => e.key === "Enter" && handleSkip()}
      animate={saliendo ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: DURACION_SALIDA, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (saliendo) onFinished();
      }}
    >
      {/* Fondo: viñeta + ramitas de olivo flotando + resplandor suave */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(62,71,50,0.55)_100%)]" />
        <div className="absolute -left-6 top-10 h-40 w-40 animate-drift rounded-full bg-champagne/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-48 w-48 animate-drift rounded-full bg-alabaster/20 blur-3xl [animation-delay:2s]" />
        <RamitaFlotante className="left-[8%] top-[14%]" delay={0.2} />
        <RamitaFlotante className="right-[10%] top-[20%] rotate-[130deg]" delay={0.8} />
        <RamitaFlotante className="bottom-[16%] left-[14%] rotate-[220deg]" delay={0.5} />
        <RamitaFlotante className="bottom-[12%] right-[8%] rotate-[60deg]" delay={1.1} />
      </div>

      <p className="eyebrow absolute top-[14%] text-champagne/80">Nos casamos</p>

      {/* El sobre: contenedor con perspectiva 3D para que la solapa "gire" de verdad */}
      <div className="relative h-48 w-64 sm:h-56 sm:w-80" style={{ perspective: 1400 }}>
        {/* Cuerpo del sobre */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-sm bg-champagne shadow-soft"
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Líneas de pliegue del sobre, para que se lea como sobre y no como caja */}
          <svg viewBox="0 0 256 176" className="absolute inset-0 h-full w-full text-olive/15" preserveAspectRatio="none">
            <path d="M0 0 L128 96 L256 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M0 176 L96 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M256 176 L160 88" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </motion.div>

        {/* Carta: sale de adentro del sobre y crece para revelar los nombres */}
        <motion.div
          className="absolute inset-x-3 top-2 flex flex-col items-center justify-center rounded-sm bg-alabaster px-4 py-6 text-center shadow-card sm:inset-x-4"
          style={{ zIndex: 30 }}
          initial={{ y: 0, opacity: 0, scale: 0.94 }}
          animate={
            cartaRevelada
              ? { y: "-46vh", opacity: 1, scale: 2.6 }
              : cartaAsomada
                ? { y: "-38%", opacity: 1, scale: 1 }
                : { y: 0, opacity: 0, scale: 0.94 }
          }
          transition={{ duration: cartaRevelada ? 1.6 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="eyebrow text-pistachio-600"
            animate={{ opacity: cartaRevelada ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Con todo nuestro amor, los esperamos
          </motion.p>
          <motion.h1
            className="font-display text-2xl italic text-olive-900 sm:text-3xl"
            animate={{ opacity: cartaAsomada || cartaRevelada ? 1 : 0, letterSpacing: cartaRevelada ? "0.02em" : "0.3em" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {novios}
          </motion.h1>
        </motion.div>

        {/* Solapa del sobre: triángulo real que gira sobre su borde superior */}
        <motion.div
          className="absolute inset-x-0 top-0 origin-top bg-champagne-300 shadow-soft"
          style={{
            height: "62%",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            zIndex: 20,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: solapaAbierta ? -175 : 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {/* Sello de cera: se agrieta y se parte al pasar a "sello" */}
        <motion.div
          className="absolute left-1/2 top-[38%] -translate-x-1/2"
          style={{ zIndex: 25 }}
          initial={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={
            sellosRoto
              ? { opacity: 0, scale: 1.5, rotate: 12, transition: { duration: 0.5, ease: "easeIn" } }
              : fase === "sello"
                ? { rotate: [0, -6, 6, -4, 0], scale: [1, 1.08, 1, 1.05, 1] }
                : { opacity: 1, scale: 1, rotate: 0 }
          }
          transition={fase === "sello" && !sellosRoto ? { duration: 0.9, ease: "easeInOut" } : undefined}
        >
          <WaxSeal size={64} />
        </motion.div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute bottom-8 font-body text-xs uppercase tracking-widest2 text-alabaster/70 underline-offset-4 hover:underline"
      >
        Omitir
      </button>
    </motion.div>
  );
}
