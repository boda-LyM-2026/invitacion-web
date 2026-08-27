import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const FOTOS = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop",
];

const DIRECCION = "Hacienda Los Olivos, Km 8 Carretera a Sacaba, Cochabamba, Bolivia";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(DIRECCION)}&output=embed`;

export function LocationSection() {
  const [activa, setActiva] = useState(0);

  return (
    <section className="section-cinematic film-grain">
      {/* Background */}
      <div className="absolute inset-0 bg-alabaster" />
      <div className="absolute inset-0 bg-champagne-glow" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">El lugar</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Hacienda Los Olivos
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        {/* Photo gallery */}
        <Reveal delay={0.2} variant="scale-in" className="relative mt-8 overflow-hidden rounded-[28px] shadow-cinematic">
          <div className="relative h-72 overflow-hidden sm:h-96">
            <AnimatePresence mode="wait">
              <motion.img
                key={activa}
                src={FOTOS[activa]}
                alt={`Hacienda Los Olivos, vista ${activa + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black/40 via-transparent to-transparent" />

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
              {FOTOS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === activa ? "w-8 bg-alabaster" : "w-2.5 bg-alabaster/40"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Address */}
        <Reveal delay={0.3} variant="fade-up" className="mt-8 text-center">
          <p className="font-body text-sm text-ink-light">{DIRECCION}</p>
          <motion.a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DIRECCION)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost mt-6 inline-flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Abrir en Google Maps
          </motion.a>
        </Reveal>

        {/* Map */}
        <Reveal delay={0.4} variant="scale-in" className="mt-8 overflow-hidden rounded-[28px] shadow-cinematic">
          <div className="relative">
            <iframe
              title="Ubicación del evento"
              src={MAPS_EMBED_SRC}
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-olive/10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
