import { motion, useScroll, useTransform } from "framer-motion";
import { OliveDivider } from "./OliveDivider";

interface HeroProps {
  nombreInvitado?: string;
}

const FOTO_PRINCIPAL =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

export function Hero({ nombreInvitado }: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cinematic-black text-alabaster">
      {/* Parallax background image */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={FOTO_PRINCIPAL}
          alt="Lenan y Mauricio"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-cinematic-black/40 to-cinematic-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-cinematic-black/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-olive-vignette" />

      {/* Lens flare effect */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(231,219,203,0.15) 0%, transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-6 text-center"
        style={{ opacity }}
      >
        {/* Personalized greeting */}
        {nombreInvitado && (
          <motion.p
            className="eyebrow mb-4 text-champagne/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Con cariño, para {nombreInvitado}
          </motion.p>
        )}

        {/* Eyebrow */}
        <motion.p
          className="eyebrow mb-6 text-champagne/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Nos casamos
        </motion.p>

        {/* Main title with letter-by-letter animation */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-6xl font-light italic leading-tight sm:text-7xl md:text-8xl"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Lenan &amp; Mauricio
          </motion.h1>
        </div>

        {/* Date */}
        <motion.p
          className="mt-6 font-body text-sm uppercase tracking-cinematic text-champagne/80"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.25em" }}
          transition={{ delay: 1.3, duration: 1.2 }}
        >
          14 · Noviembre · 2026
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <OliveDivider className="mt-8 text-champagne/60" />
        </motion.div>

        {/* Quote */}
        <motion.p
          className="mx-auto mt-6 max-w-xs font-display text-lg italic text-champagne/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 1 }}
        >
          &ldquo;Dos historias que decidieron convertirse en una sola.&rdquo;
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-body text-[0.6rem] uppercase tracking-widest2 text-champagne/50">
            Descubre más
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-champagne/50"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
