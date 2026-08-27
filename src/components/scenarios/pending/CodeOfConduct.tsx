import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const REGLAS = [
  "Es una celebración solo para adultos; agradecemos dejar a los peques en casa, salvo indicación contraria en tu invitación.",
  "El código de vestimenta es formal, tonos tierra y verdes son bienvenidos.",
  "Pedimos evitar el color blanco, champagne y verde pistacho: son los tonos de la boda.",
  "Por favor confirma tu asistencia antes del 1 de octubre para poder organizar mesas y menú.",
];

export function CodeOfConduct() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/herramientas-para-cortar-pastel.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/85 backdrop-blur-sm" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">Antes de venir</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Código de conducta
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        <Reveal delay={0.2} variant="fade-up">
          <ul className="mx-auto mt-8 max-w-md space-y-4">
            {REGLAS.map((regla, i) => (
              <motion.li
                key={regla}
                className="flex items-start gap-4 rounded-2xl bg-white/60 p-4 shadow-glass backdrop-blur-sm transition-all duration-500 hover:shadow-glow-olive"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              >
                <motion.div
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive text-alabaster"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-display text-sm">{i + 1}</span>
                </motion.div>
                <span className="font-body text-sm leading-relaxed text-ink-light">
                  {regla}
                </span>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
