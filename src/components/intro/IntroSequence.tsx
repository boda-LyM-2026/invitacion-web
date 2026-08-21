import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WaxSeal } from "@/components/shared/WaxSeal";

interface IntroSequenceProps {
  onFinished: () => void;
  novios?: string;
}

type Escena = "carta" | "titulo" | "sello" | "apertura" | "salida";

const DURACIONES: Record<Escena, number> = {
  carta: 900,
  titulo: 1700,
  sello: 1300,
  apertura: 1400,
  salida: 600,
};

/**
 * RF-04. Secuencia: carta cerrada -> "Lenan & Mauricio" -> sello que se
 * rompe -> apertura de la carta -> transición al Hero. Se puede saltar
 * (tap/click) para accesibilidad y para invitados que vuelven a entrar.
 */
export function IntroSequence({ onFinished, novios = "Lenan & Mauricio" }: IntroSequenceProps) {
  const [escena, setEscena] = useState<Escena>("carta");
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      onFinished();
      return;
    }

    const orden: Escena[] = ["carta", "titulo", "sello", "apertura", "salida"];
    const idx = orden.indexOf(escena);
    if (idx === orden.length - 1) {
      const t = window.setTimeout(onFinished, DURACIONES[escena]);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setEscena(orden[idx + 1]), DURACIONES[escena]);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escena]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-olive-fade"
      role="button"
      tabIndex={0}
      aria-label="Toca para continuar a la invitación"
      onClick={onFinished}
      onKeyDown={(e) => e.key === "Enter" && onFinished()}
    >
      {/* Textura ambiental */}
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay">
        <div className="absolute -left-10 top-10 h-40 w-40 animate-drift rounded-full bg-champagne blur-3xl" />
        <div className="absolute bottom-10 right-0 h-48 w-48 animate-drift rounded-full bg-alabaster blur-3xl [animation-delay:2s]" />
      </div>

      <AnimatePresence mode="wait">
        {escena === "carta" && (
          <motion.div
            key="carta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-40 w-56 rounded-sm bg-champagne shadow-soft sm:h-48 sm:w-64"
          >
            <div className="absolute inset-3 rounded-sm border border-olive/20" />
          </motion.div>
        )}

        {escena === "titulo" && (
          <motion.div
            key="titulo"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.08em" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="px-6 text-center"
          >
            <p className="eyebrow mb-4 text-alabaster/80">Nos casamos</p>
            <h1 className="font-display text-4xl italic text-alabaster sm:text-5xl">{novios}</h1>
          </motion.div>
        )}

        {escena === "sello" && (
          <motion.div
            key="sello"
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <WaxSeal size={112} />
          </motion.div>
        )}

        {escena === "apertura" && (
          <motion.div key="apertura" className="relative h-52 w-72 sm:h-64 sm:w-80" style={{ perspective: 1200 }}>
            <motion.div
              className="absolute inset-0 origin-top rounded-sm bg-champagne shadow-soft"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -130 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-full rounded-sm bg-alabaster"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="flex h-full items-center justify-center px-6 text-center font-display italic text-olive-900">
                Con todo nuestro amor, los esperamos
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {escena !== "salida" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFinished();
          }}
          className="absolute bottom-8 font-body text-xs uppercase tracking-widest2 text-alabaster/70 underline-offset-4 hover:underline"
        >
          Omitir
        </button>
      )}
    </div>
  );
}
