import { useState } from "react";
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
    <section className="section-shell bg-alabaster">
      <Reveal className="text-center">
        <p className="eyebrow">El lugar</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Hacienda Los Olivos</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <Reveal delay={0.1} className="relative overflow-hidden rounded-[28px] shadow-card">
        <img
          src={FOTOS[activa]}
          alt={`Hacienda Los Olivos, vista ${activa + 1}`}
          className="h-64 w-full object-cover transition-opacity duration-500 sm:h-80"
        />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {FOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-all ${
                i === activa ? "w-5 bg-pistachio-400" : "bg-alabaster/70"
              }`}
            />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-6 text-center">
        <p className="font-body text-sm text-ink/80">{DIRECCION}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DIRECCION)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost mt-4 inline-flex"
        >
          Abrir en Google Maps
        </a>
      </Reveal>

      <Reveal delay={0.25} className="mt-6 overflow-hidden rounded-[28px] shadow-card">
        <iframe
          title="Ubicación del evento"
          src={MAPS_EMBED_SRC}
          className="h-56 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
    </section>
  );
}
