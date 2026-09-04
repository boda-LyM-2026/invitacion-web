import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ParticleField } from "@/components/shared/ParticleField";
import { NOMBRE_NOVIOS, FECHA_BODA_TEXTO } from "@/config/wedding";
import {
  asegurarCanal,
  esIntroAudioActivo,
  setIntroAudio,
  tocarCrack,
  tocarPapel,
  tocarTimbre,
} from "@/lib/audioIntro";

interface IntroSequenceProps {
  onFinished: () => void;
  novios?: string;
}

type Fase =
  | "oscuridad"
  | "sobre"
  | "sello"
  | "crack"
  | "apertura"
  | "revelacion"
  | "salida";

/**
 * Duración total de cada fase (ms). Las animaciones de Framer Motion derivan
 * sus duraciones de esta única fuente para que nunca se desincronicen del
 * avanzador de fases. Ritmo compacto: ~10s totales.
 */
const DURACIONES: Record<Fase, number> = {
  oscuridad: 800,
  sobre: 1600,
  sello: 1500,
  crack: 900,
  apertura: 1800,
  revelacion: 2500,
  salida: 1000,
};

const ORDEN: Fase[] = [
  "oscuridad",
  "sobre",
  "sello",
  "crack",
  "apertura",
  "revelacion",
  "salida",
];

const sec = (v: number) => Math.round(v) / 1000;
const ABIERTO = (f: Fase) => f === "apertura" || f === "revelacion";

/* ------------------------------------------------------------------ */
/* Decoración del sello (reutilizable entre mitades y estado entero)   */
/* ------------------------------------------------------------------ */

function SealArtwork({ size = 76 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
      <text
        x="26"
        y="46"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="300"
        fontStyle="italic"
        fill="#3D2B1F"
        opacity="0.85"
      >
        L
      </text>
      <text
        x="36"
        y="40"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="11"
        fontWeight="300"
        fill="#3D2B1F"
        opacity="0.6"
      >
        &amp;
      </text>
      <text
        x="43"
        y="46"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="300"
        fontStyle="italic"
        fill="#3D2B1F"
        opacity="0.85"
      >
        M
      </text>
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

/* ------------------------------------------------------------------ */
/* Sello con brillo itinerante (destello que recorre la cera)          */
/* ------------------------------------------------------------------ */

function SealWithShine({ size = 76 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <SealArtwork size={size} />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, transparent 35%, rgba(255,246,214,0.85) 50%, transparent 65%, transparent 100%)",
          mixBlendMode: "overlay",
        }}
        animate={{ x: ["-140%", "140%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Micro-fisuras radiales que anticipan la ruptura (fase "sello")      */
/* ------------------------------------------------------------------ */

const GRIETAS: string[] = [
  "M40 40 L22 24",
  "M40 40 L60 30",
  "M40 40 L52 62",
  "M40 40 L30 60",
  "M40 40 L40 16",
  "M40 40 L64 48",
  "M40 40 L16 46",
];

function SealCracks({ size = 76 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      {GRIETAS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="#3D2B1F"
          strokeWidth="0.7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 0.9, delay: 0.12 + i * 0.09, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Nombres revelados letra a letra (micro-tipografia en el clímax)     */
/* ------------------------------------------------------------------ */

function ScriptReveal({ text, className, delay, play }: { text: string; className?: string; delay?: number; play: boolean }) {
  const letters = text.split("");
  return (
    <span className={className && " " + className}>
      {letters.map((ch, i) => (
        <motion.span
          key={`${play}-${i}`}
          className="inline-block will-change-[transform,opacity]"
          initial={{ opacity: 0, y: 0.5, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: (delay ?? 0) + i * 0.045, duration: 0.5, ease: "easeOut" }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Ráfaga de partículas (polvo/impacto al abrir el sello)              */
/* ------------------------------------------------------------------ */

const SPARK_COLORS = ["#F5E6A3", "#E7DBCB", "#DAA520", "#F9F9EF"];

function BurstBurst({ index }: { index: number }) {
  const angle = (index / 14) * Math.PI * 2;
  const dist = 40 + (index % 5) * 12;
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist - 20;
  const size = 2 + (index % 3);
  return (
    <motion.span
      className="absolute"
      style={{
        top: "50%",
        left: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        background: SPARK_COLORS[index % SPARK_COLORS.length],
        boxShadow: "0 0 6px rgba(245,230,163,0.8)",
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 0], x, y, scale: 1 }}
      transition={{ duration: 0.85, ease: "easeOut", delay: index * 0.012 }}
    />
  );
}

function SealBurst() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 15 }, (_, i) => (
        <BurstBurst key={i} index={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Papel de la carta: pergamino, grano, borde deckle y sombra interior */
/* ------------------------------------------------------------------ */

function PapelCarta() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      width="100%"
      height="100%"
      viewBox="0 0 100 62"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="granoCarta">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id="pergaminoCarta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDFBF4" />
          <stop offset="55%" stopColor="#F5EFE0" />
          <stop offset="100%" stopColor="#EAE0C8" />
        </linearGradient>
      </defs>
      <rect width="100" height="62" rx="5" fill="url(#pergaminoCarta)" />
      <rect width="100" height="62" rx="5" filter="url(#granoCarta)" opacity="0.14" />
      {/* Borde deckle (irregular, dibujado a mano) */}
      <path
        d="M3 4 L97 3 L98 30 L96 58 L5 59 L2 30 Z"
        fill="none"
        stroke="#CDBB95"
        strokeWidth="1.1"
        opacity="0.5"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function IntroSequence({ onFinished, novios = NOMBRE_NOVIOS }: IntroSequenceProps) {
  const [fase, setFase] = useState<Fase>("oscuridad");
  const [saliendo, setSaliendo] = useState(false);
  const [sonidoOn, setSonidoOn] = useState<boolean>(() => esIntroAudioActivo());
  const faseRef = useRef<Fase>("oscuridad");
  const timeoutRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const finishRef = useRef(onFinished);
  useEffect(() => {
    finishRef.current = onFinished;
  }, [onFinished]);

  // Canal de audio de la intro (se silencia con el botón / pref guardado).
  useEffect(() => {
    asegurarCanal();
  }, []);

  // Omitir la intro por completo si el usuario prefiere movimiento reducido.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      finishRef.current();
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) finishRef.current();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Avanzador de fases.
  useEffect(() => {
    if (saliendo) return;
    const idx = ORDEN.indexOf(fase);
    faseRef.current = fase;

    if (idx === ORDEN.length - 1) {
      timeoutRef.current = window.setTimeout(() => setSaliendo(true), DURACIONES[fase]);
    } else {
      timeoutRef.current = window.setTimeout(() => setFase(ORDEN[idx + 1]), DURACIONES[fase]);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [fase, saliendo]);

  // Efectos de sonido atados a los hitos visuales.
  useEffect(() => {
    if (fase === "crack") tocarCrack();
    else if (fase === "apertura") tocarPapel();
    else if (fase === "revelacion") tocarTimbre();
  }, [fase]);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  function handleSkip() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (ORDEN.indexOf(faseRef.current) >= ORDEN.length - 1) return;
    setSaliendo(true);
  }

  const showEnvelope = fase !== "oscuridad" && fase !== "salida";

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-hidden outline-none"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #17150f 38%, #241f12 100%)",
      }}
      role="region"
      aria-label="Introducción a la invitación"
      tabIndex={-1}
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleSkip();
        }
      }}
      initial={{ opacity: 1 }}
      animate={saliendo ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: sec(DURACIONES.salida), ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (saliendo) finishRef.current();
      }}
    >
      {/* ---------------- Fondo ---------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-dark-vignette" />
        <ParticleField count={30} color="rgba(231,219,203,0.35)" />

        {/* Glow cálido central */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,196,168,0.16) 0%, transparent 68%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.45, 0.28] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Aurora oliva a la izquierda */}
        <motion.div
          className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(130,134,97,0.22) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ x: [0, 30, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Aurora dorada a la derecha */}
        <motion.div
          className="absolute -right-24 bottom-1/4 h-[420px] w-[420px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,196,168,0.2) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ x: [0, -30, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Destellos (bokeh) flotando en el aire */}
        {[
          { top: "16%", left: "22%", s: 3, d: 0 },
          { top: "24%", left: "78%", s: 2, d: 1.4 },
          { top: "38%", left: "12%", s: 4, d: 2.6 },
          { top: "62%", left: "86%", s: 2, d: 0.8 },
          { top: "72%", left: "20%", s: 3, d: 3.4 },
          { top: "12%", left: "55%", s: 2, d: 2 },
        ].map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              top: b.top,
              left: b.left,
              width: b.s,
              height: b.s,
              background: "radial-gradient(circle, #F5E6A3, transparent 80%)",
              boxShadow: "0 0 8px rgba(245,230,163,0.7)",
            }}
            animate={{ y: [0, -22, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: b.d }}
          />
        ))}

        {/* Mesa/superficie inferior con reflejo */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Spotlight que se concentra en el sobre al abrir, y se abre en la
          revelación para "encender" la carta gigante. */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[12] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(247,238,210,0.16) 0%, rgba(247,238,210,0.05) 42%, transparent 70%)",
          filter: "blur(18px)",
        }}
        animate={{
          opacity: ABIERTO(fase) ? 0.95 : fase === "crack" ? 0.75 : 0.45,
          scale: fase === "revelacion" ? 1.7 : fase === "apertura" ? 1.45 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Oscurecimiento del fondo durante crack/apertura: la luz se enfoca
          en el sobre y la carta queda brillante (está por encima, z-30). */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[15] bg-cinematic-black"
        animate={{ opacity: fase === "apertura" ? 0.6 : fase === "crack" ? 0.5 : 0 }}
        transition={{ duration: sec(DURACIONES.crack) + 0.2, ease: "easeInOut" }}
      />

      {/* ---------------- Texto superior (letra a letra) ---------------- */}
      <motion.p
        className="eyebrow absolute top-[10%] z-10 flex text-champagne/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: fase !== "oscuridad" ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      >
        {"Nos casamos".split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            animate={
              fase !== "oscuridad"
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: -14, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: "easeOut" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </motion.p>

      {/* ---------------- Sobre 3D ---------------- */}
      <AnimatePresence>
        {showEnvelope && (
          <motion.div
            key="sobre"
            className="relative z-30"
            style={{ perspective: 1400, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Movimiento orgánico: el sobre "respira" (flota) y se balancea
                suavemente mientras está posado; se aplana al revelar. */}
            <motion.div
              className="relative will-change-transform"
              animate={
                fase === "crack" || fase === "sello"
                  ? {
                      y: [0, -9, 0],
                      rotateY: [0, 5, 0, -5, 0],
                      rotateX: [0, 1.5, 0],
                    }
                  : fase === "apertura"
                    ? { y: [0, -6, 0], rotateY: [0, 3, 0, -2, 0] }
                    : { y: 0, rotateY: 0, rotateX: 0 }
              }
              transition={
                fase === "crack" || fase === "sello" || fase === "apertura"
                  ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.5, ease: "easeOut" }
              }
              style={{ transformStyle: "preserve-3d" }}
            >
            {/* Sombra proyectada bajo el sobre */}
            <motion.div
              className="absolute -bottom-10 left-1/2 h-10 w-[120%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl"
              animate={{
                scaleX: ABIERTO(fase) ? 1.25 : [1, 1.1, 1],
                opacity: ABIERTO(fase) ? 0.5 : [0.35, 0.25, 0.35],
              }}
              transition={
                ABIERTO(fase)
                  ? { duration: sec(DURACIONES.apertura), ease: "easeOut" }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
            />

            {/* Carta (detrás de solapas, se eleva al abrir) */}
            <motion.div
              className="absolute inset-x-4 top-2 z-[5] h-44 overflow-hidden rounded-[3px] sm:h-48"
              style={{
                backfaceVisibility: "hidden",
                boxShadow:
                  "0 6px 22px rgba(0,0,0,0.28), inset 0 0 46px rgba(120,95,40,0.10)",
              }}
              animate={
                fase === "revelacion"
                  ? { y: "-98px", scale: 1.1, filter: ["blur(2px)", "blur(0px)"] }
                  : fase === "apertura"
                    ? { y: "-36px", scale: 1.04, filter: "blur(0px)" }
                    : { y: 0, scale: 0.92, filter: "blur(0px)" }
              }
              transition={
                fase === "revelacion"
                  ? {
                      y: { duration: sec(DURACIONES.revelacion), ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: sec(DURACIONES.revelacion), ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 1.0, ease: "easeOut" },
                    }
                  : fase === "apertura"
                    ? {
                        y: { duration: sec(DURACIONES.apertura) / 2, ease: "easeOut" },
                        scale: { duration: sec(DURACIONES.apertura) / 2, ease: "easeOut" },
                      }
                    : { duration: sec(DURACIONES.apertura) / 2, ease: "easeOut" }
              }
            >
              <PapelCarta />

              {/* Contenido de la carta */}
              <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 py-6 text-center">
                {/* Mensaje de cabecera: se revela con un barrido ascendente en el
                    clímax (retrasado para que el foco esté en los nombres). */}
                <motion.p
                  className="eyebrow text-ink-muted/70"
                  animate={{
                    opacity: fase === "revelacion" ? 1 : 0,
                    y: fase === "revelacion" ? 0 : 10,
                  }}
                  transition={{ delay: sec(DURACIONES.revelacion) * 0.45, duration: 0.6 }}
                >
                  Con todo nuestro amor, los esperamos
                </motion.p>

                {/* Nombres revelados letra a letra en el clímax */}
                <h1 className="mt-3 font-display text-3xl font-light italic text-olive-900 sm:text-4xl">
                  <ScriptReveal
                    text={novios}
                    play={fase === "revelacion"}
                    delay={fase === "revelacion" ? 0.3 : undefined}
                  />
                </h1>

                {/* Fecha como micro-cierre */}
                <motion.p
                  className="mt-3 font-body text-[0.5rem] uppercase tracking-[0.22em] text-ink-muted/60"
                  animate={{
                    opacity: fase === "revelacion" ? 1 : 0,
                    y: fase === "revelacion" ? 0 : 6,
                  }}
                  transition={{ delay: sec(DURACIONES.revelacion) * 0.75, duration: 0.6 }}
                >
                  {FECHA_BODA_TEXTO}
                </motion.p>
              </div>

              {/* Sombra que el flap superior proyecta sobre la carta; se
                  disipa cuando el flap se abre y la carta sale. */}
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/2 bg-gradient-to-b from-black/35 to-transparent"
                animate={{ opacity: ABIERTO(fase) ? 0.12 : fase === "crack" ? 0.45 : 0.6 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>

            {/* ============ Geometría del sobre ============ */}
            <motion.div
              className="relative z-[5] h-56 w-80 sm:h-64 sm:w-96"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ opacity: fase === "revelacion" ? 0 : 1, scale: fase === "revelacion" ? 0.9 : 1 }}
              transition={{ duration: sec(DURACIONES.revelacion) * 0.65, ease: "easeInOut" }}
            >
              {/* Panel trasero */}
              <div
                className="absolute inset-0 rounded-[4px]"
                style={{
                  background: "linear-gradient(150deg, #E8DCC8 0%, #D9CBB0 100%)",
                }}
              />
              {/* Grosor del papel (canto inferior) */}
              <div
                className="absolute inset-x-0 bottom-0 h-[3px] rounded-b-[4px]"
                style={{ background: "#C9B795" }}
              />

              {/* Textura sutil del papel */}
              <div
                className="absolute inset-0 rounded-[4px] opacity-[0.035]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Solapa izquierda (con canto interior) */}
              <div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  background:
                    "linear-gradient(90deg, #C9B895 0%, transparent 100%)",
                  clipPath: "polygon(0 100%, 100% 28%, 100% 72%, 0 0)",
                  boxShadow: "inset -2px 0 2px rgba(0,0,0,0.10), inset 2px 0 2px rgba(255,255,255,0.45)",
                  zIndex: 6,
                }}
              />

              {/* Solapa derecha (con canto interior) */}
              <div
                className="absolute inset-y-0 right-0 w-1/2"
                style={{
                  background:
                    "linear-gradient(270deg, #C9B895 0%, transparent 100%)",
                  clipPath: "polygon(100% 100%, 0 28%, 0 72%, 100% 0)",
                  boxShadow: "inset 2px 0 2px rgba(0,0,0,0.10), inset -2px 0 2px rgba(255,255,255,0.45)",
                  zIndex: 6,
                }}
              />

              {/* Solapa frontal/inferior (frente del sobre) */}
              <motion.div
                className="absolute inset-x-0 bottom-0 origin-top"
                style={{
                  height: "55%",
                  clipPath: "polygon(0 0, 100% 0, 87% 100%, 13% 100%)",
                  background: "linear-gradient(180deg, #E8DCC8 0%, #DDD0B8 60%, #D2C2A4 100%)",
                  zIndex: 7,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  boxShadow: "inset 0 6px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Pliegue del doblez: donde la portada se une al sobre */}
                <div
                  className="absolute inset-x-0 top-0"
                  style={{
                    height: "14px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.10), transparent)",
                    borderBottom: "1px solid rgba(255,255,255,0.45)",
                  }}
                />
              </motion.div>

              {/* Flap superior (se abre en 3D hacia atrás) */}
              <motion.div
                className="absolute inset-x-0 top-0 origin-top"
                style={{
                  height: "58%",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  zIndex: 20,
                  transformStyle: "preserve-3d",
                  background: "linear-gradient(180deg, #D9CBB0 0%, #CDBD9E 100%)",
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: ABIERTO(fase) ? -178 : 0 }}
                transition={{
                  duration: sec(DURACIONES.apertura) / 2,
                  ease: [0.6, 0.05, 0.28, 1],
                }}
              >
                <div className="absolute inset-0 shadow-[inset_0_-6px_14px_rgba(0,0,0,0.18)]" />
                <div className="absolute inset-0 opacity-30" style={{
                  background: "radial-gradient(60% 60% at 50% 8%, rgba(212,196,168,0.7), transparent 70%)",
                }} />
              </motion.div>

              {/* Sello de cera sobre el flap: aparece junto con el sobre (fase
                  "sobre"), se "asienta" una sola vez en "sello" (gesto único,
                  no bucle) y se raja con fisuras visibles antes de romperse. */}
              {(fase === "sobre" || fase === "sello") ? (
                <div className="absolute left-1/2 top-[38%] z-[25] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                    initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                    animate={
                      fase === "sello"
                        ? { opacity: 1, rotate: [0, -4, 3, -1.5, 0], scale: [1, 1.02, 1.04, 1.01, 1] }
                        : { opacity: 1, rotate: 0, scale: 1 }
                    }
                    transition={
                      fase === "sello"
                        ? { duration: 1.4, ease: "easeOut" }
                        : { duration: 0.7, ease: "easeOut" }
                    }
                  >
                    <SealWithShine size={76} />
                    {/* Micro-fisuras que anticipan la ruptura */}
                    {fase === "sello" && (
                      <div className="absolute inset-0">
                        <SealCracks size={76} />
                      </div>
                    )}
                  </motion.div>
                </div>
              ) : null}

              {/* Cuando el sello se raja (fase "crack"): dos mitades ASIMÉTRICAS
                  que se separan, caen y SE QUEDAN sobre el sobre; la ráfaga de
                  partículas acompaña el golpe. Al abrir el flap (apertura) el
                  grupo entero se desvanece con el sobre. */}
              <AnimatePresence>
                {fase === "crack" && (
                  <motion.div
                    key="cerafragmentos"
                    className="absolute left-1/2 top-[38%] z-[26] -translate-x-1/2 -translate-y-1/2"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <div className="relative h-[76px] w-[76px]">
                      <SealBurst />
                      <motion.div
                        className="absolute inset-0 will-change-transform"
                        style={{
                          clipPath:
                            "polygon(0 0, 56% 0, 45% 20%, 52% 44%, 41% 68%, 34% 100%, 0 100%)",
                        }}
                        initial={{ x: 0, y: 0, rotate: 0 }}
                        animate={{ x: -34, y: 24, rotate: -16 }}
                        transition={{ duration: sec(DURACIONES.crack), ease: [0.4, 0, 0.6, 1] }}
                      >
                        <SealArtwork size={76} />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 will-change-transform"
                        style={{
                          clipPath:
                            "polygon(56% 0, 100% 0, 100% 100%, 34% 100%, 41% 68%, 52% 44%, 45% 20%)",
                        }}
                        initial={{ x: 0, y: 0, rotate: 0 }}
                        animate={{ x: 36, y: 21, rotate: 14 }}
                        transition={{ duration: sec(DURACIONES.crack), ease: [0.4, 0, 0.6, 1] }}
                      >
                        <SealArtwork size={76} />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Luz de borde (highlight superior para dar profundidad) */}
              <div className="pointer-events-none absolute inset-0 rounded-[4px] border-t border-white/20" />
            </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Vineta al revelar (oscurece el fondo, no la carta) ---------------- */}
      <AnimatePresence>
        {fase === "revelacion" && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-20 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: sec(DURACIONES.revelacion) * 0.7, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ---------------- Skip button ---------------- */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute bottom-8 z-50 font-body text-xs uppercase tracking-widest2 text-alabaster/50 underline-offset-4 transition-colors hover:text-alabaster/80 hover:underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        Omitir
      </motion.button>

      {/* ---------------- Sonido on/off ---------------- */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setSonidoOn((prev) => {
            const siguiente = !prev;
            setIntroAudio(siguiente);
            return siguiente;
          });
        }}
        aria-pressed={sonidoOn}
        aria-label={sonidoOn ? "Silenciar sonido de la intro" : "Activar sonido de la intro"}
        className="absolute right-6 top-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-cinematic-dark/60 text-champagne/60 backdrop-blur-md transition-colors hover:text-champagne"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {sonidoOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </motion.button>

      {/* Línea decorativa inferior */}
      <motion.div
        className="absolute bottom-16 left-1/2 z-10 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1, duration: 2, ease: "easeOut" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}