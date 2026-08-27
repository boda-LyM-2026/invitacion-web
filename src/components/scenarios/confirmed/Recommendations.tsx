import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const GRUPOS = [
  {
    titulo: "Código de vestimenta",
    icono: "👔",
    items: ["Formal / cocktail elegante", "Tonos tierra, verdes y neutros", "Evitar blanco, champagne y verde pistacho"],
  },
  {
    titulo: "Código de conducta",
    icono: "🤝",
    items: ["Evento libre de humo dentro del salón", "Celulares en silencio durante la ceremonia", "Cuidemos la decoración y el mobiliario"],
  },
  {
    titulo: "Restricciones",
    icono: "⚠️",
    items: ["Evento solo para adultos, salvo indicación", "No se permite ingresar con mascotas", "Estacionamiento disponible con valet parking"],
  },
];

export function Recommendations() {
  return (
    <section className="section-cinematic relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #828661 0%, #6B6F4E 50%, #4B523C 100%)",
        }}
      />
      <div className="absolute inset-0 bg-olive-vignette" />

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
                  <span className="text-2xl">{grupo.icono}</span>
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
