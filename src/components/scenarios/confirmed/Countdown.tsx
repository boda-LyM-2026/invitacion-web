import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import { useCountdown } from "@/hooks/useCountdown";
import { ParticleField } from "@/components/shared/ParticleField";
import { FECHA_BODA_ISO } from "@/config/wedding";

const UNIDADES: Array<{ key: "dias" | "horas" | "minutos" | "segundos"; label: string }> = [
  { key: "dias", label: "Días" },
  { key: "horas", label: "Horas" },
  { key: "minutos", label: "Min" },
  { key: "segundos", label: "Seg" },
];

export function Countdown() {
  const cuenta = useCountdown(FECHA_BODA_ISO);

  return (
    <section className="section-cinematic relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ramo-de-flores.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/85 backdrop-blur-sm" />

      {/* Particles */}
      <ParticleField count={25} color="rgba(130,134,97,0.3)" />

      <div className="relative z-10 text-center">
        <Reveal variant="fade-up">
          <p className="eyebrow">Falta poco</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Nos vemos muy pronto
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        <Reveal delay={0.2} variant="scale-in" className="mx-auto mt-10 grid max-w-sm grid-cols-4 gap-4">
          {UNIDADES.map(({ key, label }, i) => (
            <motion.div
              key={key}
              className="card-surface shimmer-border py-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <motion.p
                className="font-display text-4xl font-light text-olive-900"
                key={cuenta[key]}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {String(cuenta[key]).padStart(2, "0")}
              </motion.p>
              <p className="eyebrow mt-2 text-olive">{label}</p>
            </motion.div>
          ))}
        </Reveal>

        {cuenta.haPasado && (
          <Reveal delay={0.5} variant="scale-in">
            <motion.p
              className="mt-8 font-display text-2xl italic text-olive-900"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ¡Hoy es el gran día!
            </motion.p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
