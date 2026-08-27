import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const PROGRAMA = [
  { hora: "5:30 p.m.", actividad: "Llegada e ingreso", icono: "🚪" },
  { hora: "6:00 p.m.", actividad: "Ceremonia civil", icono: "💒" },
  { hora: "7:00 p.m.", actividad: "Cóctel de bienvenida", icono: "🥂" },
  { hora: "8:30 p.m.", actividad: "Cena", icono: "🍽️" },
  { hora: "9:30 p.m.", actividad: "Primer baile y brindis", icono: "💃" },
  { hora: "10:00 p.m.", actividad: "Fiesta", icono: "🎉" },
  { hora: "1:00 a.m.", actividad: "Despedida", icono: "✨" },
];

export function Timeline() {
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
          <p className="eyebrow text-champagne/70">El programa</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-alabaster sm:text-5xl">
            Cronograma de la noche
          </h2>
          <OliveDivider className="text-champagne/60" />
        </Reveal>

        <Reveal delay={0.2} variant="fade-up" className="relative mx-auto mt-10 max-w-md">
          {/* Animated vertical line */}
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
                {/* Time */}
                <span className="w-[52px] shrink-0 text-right font-body text-xs uppercase tracking-wide text-champagne/60">
                  {item.hora}
                </span>

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-alabaster/10 backdrop-blur-sm"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(249,249,239,0.2)" }}
                >
                  <span className="text-xl">{item.icono}</span>
                </motion.div>

                {/* Activity */}
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
