import { motion } from "framer-motion";
import { WaxSeal } from "./WaxSeal";
import { ParticleField } from "./ParticleField";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 py-20 text-center text-alabaster">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #828661 0%, #6B6F4E 50%, #4B523C 100%)",
        }}
      />
      <div className="absolute inset-0 bg-olive-vignette" />

      {/* Particles */}
      <ParticleField count={20} color="rgba(231,219,203,0.3)" />

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <WaxSeal size={64} className="mx-auto mb-8" />

        <p className="font-display text-3xl font-light italic">
          Gracias por ser parte de nuestra historia
        </p>

        <motion.div
          className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "150px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />

        <p className="mt-6 font-body text-sm uppercase tracking-cinematic text-champagne/70">
          Lenan &amp; Mauricio · 14 de noviembre de 2026
        </p>
      </motion.div>
    </footer>
  );
}
