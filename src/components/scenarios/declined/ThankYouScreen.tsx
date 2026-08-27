import { motion } from "framer-motion";
import { WaxSeal } from "@/components/shared/WaxSeal";
import { ParticleField } from "@/components/shared/ParticleField";

interface ThankYouScreenProps {
  nombreInvitado: string;
}

export function ThankYouScreen({ nombreInvitado }: ThankYouScreenProps) {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ramo-de-flores.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/85 backdrop-blur-sm" />

      {/* Particles dispersing */}
      <ParticleField count={35} color="rgba(130,134,97,0.4)" />

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Seal with fade effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <WaxSeal size={80} />
        </motion.div>

        {/* Greeting */}
        <motion.p
          className="eyebrow mt-10 text-olive/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Gracias, {nombreInvitado}
        </motion.p>

        {/* Main message */}
        <motion.h1
          className="mx-auto mt-6 max-w-sm font-display text-3xl font-light italic text-olive-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Vamos a extrañarte ese día, pero agradecemos muchísimo que nos avises.
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-olive/30 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />

        {/* Secondary message */}
        <motion.p
          className="mx-auto mt-6 max-w-xs font-body text-sm leading-relaxed text-ink-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Nos encantaría verte pronto de todos modos. Con cariño, Lenan &amp; Mauricio.
        </motion.p>
      </motion.div>
    </section>
  );
}
