import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

function DoorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 4h3a2 2 0 0 1 2 2v14" />
      <path d="M2 20h3" />
      <path d="M13 20h9" />
      <path d="M10 12v.01" />
      <path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
    </svg>
  );
}

function ChurchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 22V8l-6-6-6 6v14" />
      <path d="M2 22h20" />
      <path d="M12 2v2" />
      <path d="M12 10v4" />
      <path d="M9 12h6" />
      <circle cx="12" cy="6" r="1" />
    </svg>
  );
}

function ChampagneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 22h8" />
      <path d="M12 12v10" />
      <path d="M10 2v3" />
      <path d="M14 2v3" />
      <path d="M6 6h12l-1.5 6h-9L6 6Z" />
      <path d="M6 6c0 3 2 5 4 6" />
      <path d="M18 6c0 3-2 5-4 6" />
    </svg>
  );
}

function PlateIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 11h18" />
      <path d="M12 7a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
      <path d="M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  );
}

function DanceIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="4" r="2" />
      <path d="M9 10l-2 4" />
      <path d="M15 10l2 4" />
      <path d="M9 10h6" />
      <path d="M10 14l-3 8" />
      <path d="M14 14l3 8" />
    </svg>
  );
}

function SparkleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z" />
    </svg>
  );
}

const PROGRAMA = [
  { hora: "5:30 p.m.", actividad: "Llegada e ingreso", Icon: DoorIcon },
  { hora: "6:00 p.m.", actividad: "Ceremonia civil", Icon: ChurchIcon },
  { hora: "7:00 p.m.", actividad: "Cóctel de bienvenida", Icon: ChampagneIcon },
  { hora: "8:30 p.m.", actividad: "Cena", Icon: PlateIcon },
  { hora: "9:30 p.m.", actividad: "Primer baile y brindis", Icon: DanceIcon },
  { hora: "10:00 p.m.", actividad: "Fiesta", Icon: SparkleIcon },
  { hora: "1:00 a.m.", actividad: "Despedida", Icon: SparkleIcon },
];

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

        <Reveal delay={0.2} variant="fade-up" className="relative mx-auto mt-10 max-w-md">
          <motion.div
            className="absolute bottom-2 left-[60px] top-2 w-px bg-gradient-to-b from-champagne/30 via-champagne/50 to-champagne/30"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          <ol className="space-y-8">
            {PROGRAMA.map((item, i) => (
              <motion.li
                key={item.hora}
                className="relative flex items-center gap-5"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }}
              >
                <span className="w-[52px] shrink-0 text-right font-body text-xs uppercase tracking-wide text-champagne/60">
                  {item.hora}
                </span>

                <motion.div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-alabaster/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(249,249,239,0.2)" }}
                >
                  <item.Icon className="h-5 w-5 text-champagne" />
                </motion.div>

                <span className="font-display text-xl font-light text-alabaster">
                  {item.actividad}
                </span>
              </motion.li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
