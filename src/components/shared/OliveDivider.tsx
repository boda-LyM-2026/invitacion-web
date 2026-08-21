import { motion } from "framer-motion";

interface OliveDividerProps {
  className?: string;
}

/**
 * Elemento de firma visual del proyecto: una rama de olivo lineal que se
 * "dibuja" al entrar en pantalla. Reemplaza los separadores genéricos
 * (líneas rectas, iconos de stock) por un motivo que conecta directamente
 * con la paleta Pistachio/Olive y con la simbología de la boda.
 */
export function OliveDivider({ className = "" }: OliveDividerProps) {
  return (
    <svg
      viewBox="0 0 240 40"
      className={`divider-branch ${className}`}
      aria-hidden="true"
      fill="none"
    >
      <motion.path
        d="M4 20 C 60 8, 90 32, 120 20 C 150 8, 180 32, 236 20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {[24, 62, 100, 140, 178, 216].map((x, i) => (
        <motion.path
          key={x}
          d={
            i % 2 === 0
              ? `M${x} 20 q 8 -14 16 -16`
              : `M${x} 20 q 8 14 16 16`
          }
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
