import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import type { Mesa } from "@/types/domain";

interface TableAssignmentProps {
  mesa: Mesa | null | undefined;
}

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


      </div>
    </section>
  );
}
