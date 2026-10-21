import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { OliveDivider } from "./OliveDivider";
import { NOMBRE_NOVIOS, FECHA_BODA_TEXTO } from "@/config/wedding";

interface HeroProps {
  nombreInvitado?: string;
}

interface FotoNovios {
  base: string;
  anchos: number[];
}

const FOTOS_NOVIOS: FotoNovios[] = [
  { base: "/images/novios/novios-1", anchos: [640, 960, 1280] },
  { base: "/images/novios/novios-2", anchos: [640, 960, 1280, 1920] },
  { base: "/images/novios/novios-3", anchos: [640, 960, 1280] },
];

function construirSrcSet({ base, anchos }: FotoNovios): string {
  return anchos.map((ancho) => `${base}-${ancho}.webp ${ancho}w`).join(", ");
}

/** Milisegundos que cada foto permanece visible antes de empezar a desvanecerse. */
const DURACION_FOTO_MS = 5000;
/** Duración del fundido cruzado entre fotos (la siguiente entra mientras la actual sale). */
const DURACION_FADE_MS = 1500;

export function Hero({ nombreInvitado }: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const [fotoActiva, setFotoActiva] = useState(0);
  const [primeraLista, setPrimeraLista] = useState(false);
  const [motionReducido, setMotionReducido] = useState(false);
  const cargadas = useRef<Set<number>>(new Set());

  const marcarCargada = useCallback((indice: number) => {
    if (cargadas.current.has(indice)) return;
    cargadas.current.add(indice);
    if (indice === 0) setPrimeraLista(true);
  }, []);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (consulta.matches) {
      setMotionReducido(true);
      return;
    }
    const intervalo = window.setInterval(() => {
      setFotoActiva((prev) => {
        const siguiente = (prev + 1) % FOTOS_NOVIOS.length;
        return cargadas.current.has(siguiente) ? siguiente : prev;
      });
    }, DURACION_FOTO_MS);
    return () => window.clearInterval(intervalo);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cinematic-black text-alabaster">
      {/* Parallax background image */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {FOTOS_NOVIOS.map((foto, i) => {
          if (i > 0 && (!primeraLista || motionReducido)) return null;
          return (
            <img
              key={foto.base}
              ref={(el) => {
                if (el?.complete) marcarCargada(i);
              }}
              src={`${foto.base}-960.webp`}
              srcSet={construirSrcSet(foto)}
              sizes="100vw"
              alt={i === 0 ? "Lenan y Mauricio" : ""}
              aria-hidden={i !== 0}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              onLoad={() => marcarCargada(i)}
              onError={() => marcarCargada(i)}
              className="absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out"
              style={{
                opacity: i === fotoActiva && primeraLista ? 1 : 0,
                transitionDuration: `${DURACION_FADE_MS}ms`,
              }}
            />
          );
        })}
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-cinematic-black/40 to-cinematic-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-cinematic-black/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-olive-vignette" />

      {/* Lens flare effect */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(231,219,203,0.15) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-6 text-center"
        style={{ opacity }}
      >
        {/* Personalized greeting */}
        {nombreInvitado && (
          <motion.p
            className="eyebrow mb-4 text-champagne/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Con cariño, para {nombreInvitado}
          </motion.p>
        )}

        {/* Eyebrow */}
        <motion.p
          className="eyebrow mb-6 text-champagne/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Nos casamos
        </motion.p>

        {/* Main title: sin overflow-hidden — en mobile el slide recortaba
            las letras a mitad de camino (los glifos itálicos exceden la
            caja de línea). Nace invisible y aparece al llegar a su
            posición. */}
        <motion.h1
          className="font-display text-6xl font-light italic leading-tight sm:text-7xl md:text-8xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {NOMBRE_NOVIOS}
        </motion.h1>

        {/* Date */}
        <motion.p
          className="mt-6 font-body text-sm uppercase tracking-cinematic text-champagne/80"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.25em" }}
          transition={{ delay: 1.3, duration: 1.2 }}
        >
          {FECHA_BODA_TEXTO}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <OliveDivider className="mt-8 text-champagne/60" />
        </motion.div>

        {/* Quote */}
        <motion.p
          className="mx-auto mt-6 max-w-xs font-display text-lg italic text-champagne/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 1 }}
        >
          &ldquo;Dos historias que decidieron convertirse en una sola.&rdquo;
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-body text-[0.6rem] uppercase tracking-widest2 text-champagne/50">
            Descubre más
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-champagne/50"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
