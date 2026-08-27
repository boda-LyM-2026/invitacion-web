import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import type { Mesa } from "@/types/domain";

interface TableAssignmentProps {
  mesa: Mesa | null | undefined;
}

const MESAS_REFERENCIA: Array<Pick<Mesa, "numero" | "pos_x" | "pos_y">> = [
  { numero: 1, pos_x: 15, pos_y: 20 },
  { numero: 2, pos_x: 38, pos_y: 15 },
  { numero: 3, pos_x: 62, pos_y: 15 },
  { numero: 4, pos_x: 85, pos_y: 20 },
  { numero: 5, pos_x: 15, pos_y: 50 },
  { numero: 6, pos_x: 38, pos_y: 50 },
  { numero: 7, pos_x: 62, pos_y: 50 },
  { numero: 8, pos_x: 85, pos_y: 50 },
  { numero: 9, pos_x: 25, pos_y: 80 },
  { numero: 10, pos_x: 50, pos_y: 80 },
  { numero: 11, pos_x: 75, pos_y: 80 },
];

export function TableAssignment({ mesa }: TableAssignmentProps) {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/tarjetas-con-nombres-invitados.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/85 backdrop-blur-sm" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">Tu lugar en la fiesta</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Mesa asignada
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        {mesa ? (
          <Reveal delay={0.2} variant="scale-in" className="text-center">
            <motion.div
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-olive shadow-glow-olive"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(130,134,97,0.3)",
                  "0 0 50px rgba(130,134,97,0.5)",
                  "0 0 20px rgba(130,134,97,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-display text-5xl font-light text-alabaster">{mesa.numero}</span>
            </motion.div>
            <p className="mt-4 font-display text-2xl font-light text-olive-900">
              {mesa.nombre ?? `Mesa ${mesa.numero}`}
            </p>
          </Reveal>
        ) : (
          <Reveal delay={0.2} variant="fade-up">
            <p className="text-center font-body text-sm text-ink-light">
              Tu mesa se asignará en los próximos días, ¡te avisaremos!
            </p>
          </Reveal>
        )}

        {/* Floor plan */}
        <Reveal delay={0.3} variant="scale-in" className="card-surface shimmer-border relative mt-10 h-72 sm:h-80">
          <p className="eyebrow absolute left-6 top-4 text-olive">Croquis del salón</p>

          {/* Animated tables */}
          {MESAS_REFERENCIA.map((ref, i) => {
            const esLaMia = mesa?.numero === ref.numero;
            return (
              <motion.div
                key={ref.numero}
                className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-body text-xs transition-all duration-500 ${
                  esLaMia
                    ? "bg-olive text-alabaster shadow-glow-olive ring-4 ring-pistachio-300"
                    : "bg-pistachio-50 text-olive-600 hover:bg-pistachio-100"
                }`}
                style={{ left: `${ref.pos_x}%`, top: `${ref.pos_y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: esLaMia ? 1.25 : 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 200 }}
                whileHover={{ scale: esLaMia ? 1.3 : 1.1 }}
              >
                {ref.numero}
              </motion.div>
            );
          })}

          {/* Decorative floor pattern */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-30">
            <div className="absolute inset-4 rounded-full border border-dashed border-pistachio-200" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
