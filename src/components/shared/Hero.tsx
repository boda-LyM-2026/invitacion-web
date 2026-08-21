import { motion } from "framer-motion";
import { OliveDivider } from "./OliveDivider";

interface HeroProps {
  nombreInvitado?: string;
}

const FOTO_PRINCIPAL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

export function Hero({ nombreInvitado }: HeroProps) {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-end overflow-hidden bg-olive-900 text-alabaster">
      <img
        src={FOTO_PRINCIPAL}
        alt="Lenan y Mauricio"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-olive-900 via-olive-900/40 to-olive-900/10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-6 pb-16 text-center"
      >
        {nombreInvitado && (
          <p className="eyebrow mb-3 text-champagne/90">Con cariño, para {nombreInvitado}</p>
        )}
        <p className="eyebrow mb-4 text-champagne/80">Nos casamos</p>
        <h1 className="font-display text-5xl italic leading-tight sm:text-6xl">Lenan &amp; Mauricio</h1>
        <p className="mt-4 font-body text-sm uppercase tracking-widest2 text-champagne/80">
          14 · Noviembre · 2026
        </p>
        <OliveDivider className="mt-6 text-champagne/70" />
        <p className="mx-auto max-w-xs font-display italic text-champagne/90">
          "Dos historias que decidieron convertirse en una sola."
        </p>
      </motion.div>
    </section>
  );
}
