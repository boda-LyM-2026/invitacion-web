import { useId, type ReactElement } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

type Icono = (props: { className?: string }) => ReactElement;

function ChurchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 22V8l-6-6-6 6v14" />
      <path d="M2 22h20" />
      <path d="M12 2v2" />
      <path d="M12 10v7" />
      <path d="M9 12h6" />
      <circle cx="12" cy="6" r="1" />
    </svg>
  );
}

function ChampagneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 22h8" />
      <path d="M12 12v10" />
      <path d="M14 2v3" />
      <path d="M6 6h12l-1.5 " />
      <path d="M6 6c0 3 2 5 5 6" />
      <path d="M18 6c0 3-2 5-5 6" />
    </svg>
  );
}

function CenaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
<path d="M0.9 4v3M2.3 4v3" />
      <path d="M0.9 7c0 1.6.7 2.7 1.4 2.7s1.4-1.1 1.4-5.6" />
      <path d="M1.6 9.7V20" />
      <circle cx="12" cy="13" r="8.5" />
      <circle cx="12" cy="13" r="5" />
      <path d="M23.2 4V20" />
      <path d="M23.2 4c-1 1.2-1.5 2.6-1.5 4.2V10h1.5" />
    </svg>
  );
}

function CakeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1.5 21h21" />
      <path d="M3.5 21V14h17v7" />
      <path d="M7 14V6.5h10V14" />
      <path d="M3.5 14.9s2.1-.9 2.1-.9 4.3 1.8 4.3 1.8 4.2-1.8 4.2-1.8 4.2 1.8 4.2 1.8 2.2-1.8 2.2-1.8" />
      <path d="M7 7.4s2-.9 2-.9 3 1.8 3 1.8 3-1.8 3-1.8 2 .9 2 .9" />
      <path d="M10.4 7.6v-4M13.6 7.6v-4" />
    </svg>
  );
}

function SparkleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z" />
    </svg>
  );
}

const PROGRAMA = [
  { hora: "2:00 p.m.", actividad: "Ceremonia", Icon: ChurchIcon },
  { hora: "5:00 p.m.", actividad: "Cóctel de bienvenida", Icon: ChampagneIcon },
  { hora: "7:30 p.m.", actividad: "Cena", Icon: CenaIcon },
  { hora: "9:30 p.m.", actividad: "Torta", Icon: CakeIcon },
  { hora: "0:30 a.m.", actividad: "Finalización", Icon: SparkleIcon },
];

const TRAZO_CORAZON =
  "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z";

/**
 * Punto central del roadmap: círculo relleno con el corazón recortado en
 * vacío, de modo que se ve el fondo de la sección a través de él.
 */
function PuntoCorazon({ indice }: { indice: number }) {
  // Los ids del <mask>/<defs> deben ser únicos: hay cinco puntos en pantalla.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <motion.span
      className="relative z-10 h-6 w-6 shrink-0 rounded-full shadow-glow-gold ring-1 ring-alabaster/40"
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.35 + indice * 0.12, type: "spring", stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.15 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <defs>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E7DBCB" />
            <stop offset="100%" stopColor="#DDD0B8" />
          </linearGradient>
          <mask id={`mask-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <circle cx="12" cy="12" r="12" fill="white" />
            <path d={TRAZO_CORAZON} fill="black" transform="translate(5.4 5.4) scale(0.55)" />
          </mask>
        </defs>
        <circle cx="12" cy="12" r="11.5" fill={`url(#grad-${uid})`} mask={`url(#mask-${uid})`} />
      </svg>
    </motion.span>
  );
}

/**
 * Icono del programa, sin badge: alineado a la línea y alternando de lado.
 * `justify-self` es imprescindible: sin él el div se estira a la columna
 * entera y el `scale` del hover lo desplazaría hacia un lado.
 */
function IconoPrograma({ Icon, pegadoALaDerecha }: { Icon: Icono; pegadoALaDerecha: boolean }) {
  return (
    <motion.div
      className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center ${
        pegadoALaDerecha ? "justify-self-start" : "justify-self-end"
      }`}
      whileHover={{ scale: 1.1 }}
    >
      <Icon className="h-[60px] w-[60px] text-champagne" />
    </motion.div>
  );
}

/**
 * Tramo de la línea del roadmap. Se dibuja por tramos (mitad superior y
 * mitad inferior de cada fila) en vez de como una línea continua: así nunca
 * pasa por detrás de un corazón, que debe dejar ver el fondo de la sección.
 * Cada tramo llega hasta el centro del punto: con `items-center` y el padding
 * simétrico de la fila, `h-1/2` cae justo en el medio del corazón.
 */
function SegmentoLinea({
  indice,
  origen,
  degradado,
}: {
  indice: number;
  origen: "top" | "bottom";
  degradado?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 w-px ${
        origen === "top" ? "top-0 h-1/2" : "bottom-0 h-1/2"
      } ${degradado ?? "bg-champagne/40"}`}
      initial={{ scaleY: 0, x: "-50%" }}
      whileInView={{ scaleY: 1, x: "-50%" }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + indice * 0.12, duration: 0.6, ease: "easeOut" }}
      style={{ transformOrigin: "top" }}
    />
  );
}

/** Bloque textual con la hora y la actividad, alineado según el lado. */
function TextoPrograma({
  hora,
  actividad,
  pegadoALaDerecha,
}: {
  hora: string;
  actividad: string;
  pegadoALaDerecha: boolean;
}) {
  return (
    <div className={`min-w-0 ${pegadoALaDerecha ? "text-left" : "text-right"}`}>
      <p className="font-body text-xs uppercase tracking-cinematic text-champagne/70">{hora}</p>
      <p className="mt-1 font-display text-xl font-light leading-snug text-alabaster">
        {actividad}
      </p>
    </div>
  );
}

export function Timeline() {
  return (
    <section className="section-cinematic relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mesa-fondo-jardin-1.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-olive/90 via-olive/85 to-cinematic-dark/90" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow text-champagne/70">El programa</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-alabaster sm:text-5xl">
            Cronograma de la noche
          </h2>
          <OliveDivider className="text-champagne/60" />
        </Reveal>

        <Reveal delay={0.2} variant="fade-up" className="relative mx-auto mt-12 max-w-lg">
          <ol>
            {PROGRAMA.map((item, i) => {
              // Los puntos se intercalan: texto a la derecha / izquierda.
              const textoALaIzquierda = i % 2 === 1;
              const esUltimo = i === PROGRAMA.length - 1;

              return (
                <motion.li
                  key={item.hora}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }}
                >
                  <SegmentoLinea
                    indice={i}
                    origen="top"
                    degradado={i === 0 ? "bg-gradient-to-b from-transparent to-champagne/40" : undefined}
                  />
                  <SegmentoLinea
                    indice={i}
                    origen="bottom"
                    degradado={
                      esUltimo ? "bg-gradient-to-b from-champagne/40 to-transparent" : undefined
                    }
                  />

                  {textoALaIzquierda ? (
                    <TextoPrograma
                      hora={item.hora}
                      actividad={item.actividad}
                      pegadoALaDerecha={false}
                    />
                  ) : (
                    <IconoPrograma Icon={item.Icon} pegadoALaDerecha={false} />
                  )}

                  <PuntoCorazon indice={i} />

                  {textoALaIzquierda ? (
                    <IconoPrograma Icon={item.Icon} pegadoALaDerecha />
                  ) : (
                    <TextoPrograma
                      hora={item.hora}
                      actividad={item.actividad}
                      pegadoALaDerecha
                    />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
