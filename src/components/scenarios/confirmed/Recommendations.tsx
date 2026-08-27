import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

function ShirtIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
      <path d="M9 12h6" />
    </svg>
  );
}

function HandshakeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 17a1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1Z" />
      <path d="M17 17a1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1Z" />
      <path d="M14 17a1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1Z" />
      <path d="M7 17a1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1Z" />
      <path d="M17 7V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v3" />
      <path d="M7 10v7" />
      <path d="m14 13 3-3 3 3" />
      <path d="M4 10v7" />
    </svg>
  );
}

function WarningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const GRUPOS = [
  {
    titulo: "Código de vestimenta",
    Icon: ShirtIcon,
    items: ["Formal / cocktail elegante", "Tonos tierra, verdes y neutros", "Evitar blanco, champagne y verde pistacho"],
  },
  {
    titulo: "Código de conducta",
    Icon: HandshakeIcon,
    items: ["Evento libre de humo dentro del salón", "Celulares en silencio durante la ceremonia", "Cuidemos la decoración y el mobiliario"],
  },
  {
    titulo: "Restricciones",
    Icon: WarningIcon,
    items: ["Evento solo para adultos, salvo indicación", "No se permite ingresar con mascotas", "Estacionamiento disponible con valet parking"],
  },
];

export function Recommendations() {
  return (
    <section className="section-cinematic relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mesa-fondo-jardin-2.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cinematic-dark/90 via-olive/85 to-cinematic-dark/90" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow text-champagne/70">Para tener en cuenta</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-alabaster sm:text-5xl">
            Recomendaciones
          </h2>
          <OliveDivider className="text-champagne/60" />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {GRUPOS.map((grupo, i) => (
            <Reveal key={grupo.titulo} delay={i * 0.15} variant="fade-up">
              <motion.div
                className="glass-card h-full p-6"
                whileHover={{ y: -5, boxShadow: "0 20px 60px -20px rgba(10,10,10,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <grupo.Icon className="h-6 w-6 text-champagne" />
                  <h3 className="font-display text-xl font-light text-alabaster">
                    {grupo.titulo}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {grupo.items.map((item, j) => (
                    <motion.li
                      key={item}
                      className="flex items-start gap-3 font-body text-sm text-alabaster/80"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 + j * 0.1 }}
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-champagne/60" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
