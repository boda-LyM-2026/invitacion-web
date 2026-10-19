import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";
import { NOMBRE_NOVIOS, FECHA_BODA_TEXTO } from "@/config/wedding";

export function Footer() {
  return (
    <footer className="film-grain relative overflow-hidden px-6 py-24 text-center text-alabaster">
      {/* Foto de fondo estática, idéntica a las secciones (bg-fixed) */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-white.jpeg')" }}
      />
      {/* Mismo velo alabaster que las secciones, para que la costura superior
          con la sección previa sea invisible */}
      <div className="absolute inset-0 bg-alabaster/30" />

      {/* Verde faded: transparente arriba (se ve la foto por detrás, que es
          lo que se desvanece desde la sección anterior) → verde profundo
          original del footer hacia abajo. */}
      <div
  className="absolute inset-0"
    style={{
      background:
        "linear-gradient(to top, " +
        "rgba(75, 82, 60, 1) 0%, " +       // #4B523C base sólida
        "rgba(75, 82, 60, 1) 12%, " +      // se mantiene sólido un tramo
        "rgba(88, 94, 68, 0.96) 25%, " +
        "rgba(107, 111, 78, 0.88) 40%, " +
        "rgba(107, 111, 78, 0.72) 55%, " +  // aquí todavía hay mucho verde
        "rgba(107, 111, 78, 0.45) 65%, " +  // desde acá se aclara más rápido
        "rgba(107, 111, 78, 0.18) 80%, " +
        "rgba(107, 111, 78, 0) 100%)",      // transparente en la punta
    }}
/>

      {/* Viñeta oliva (la original del footer) */}
      {/* <div className="pointer-events-none absolute inset-0 bg-olive-vignette" /> */}

      {/* Halo de reflector champagne detrás del sello */}
      <div className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(231,219,203,0.16) 0%, rgba(231,219,203,0.05) 42%, transparent 70%)",
          }}
          animate={{ opacity: [0.5, 0.95, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Estrellas del cierre */}
      <ParticleField count={25} color="rgba(231,219,203,0.4)" />

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8">
          <p className="mx-auto font-script text-5xl font-light italic leading-none tracking-[0.05em] text-olive/70 [text-shadow:0_1px_8px_rgba(249,249,239,0.6)] sm:text-6xl">
            L&amp;M
          </p>
        </div>

        <p className="font-display text-3xl font-light italic text-champagne">
          Gracias por ser parte de nuestra historia
        </p>

        <motion.div
          className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "150px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />

        <p className="mt-6 font-body text-sm uppercase tracking-cinematic text-champagne/70">
          {NOMBRE_NOVIOS} · {FECHA_BODA_TEXTO}
        </p>
      </motion.div>
    </footer>
  );
}
