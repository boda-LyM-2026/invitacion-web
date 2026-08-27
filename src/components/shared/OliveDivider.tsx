import { motion } from "framer-motion";

interface OliveDividerProps {
  className?: string;
  animated?: boolean;
}

export function OliveDivider({ className = "", animated = true }: OliveDividerProps) {
  if (!animated) {
    return (
      <svg viewBox="0 0 240 40" className={`divider-branch ${className}`} aria-hidden="true" fill="none">
        <path
          d="M4 20 C 60 8, 90 32, 120 20 C 150 8, 180 32, 236 20"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {[24, 62, 100, 140, 178, 216].map((x, i) => (
          <path
            key={x}
            d={i % 2 === 0 ? `M${x} 20 q 8 -14 16 -16` : `M${x} 20 q 8 14 16 16`}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 40"
      className={`divider-branch ${className}`}
      aria-hidden="true"
      fill="none"
    >
      {/* Main branch line */}
      <motion.path
        d="M4 20 C 60 8, 90 32, 120 20 C 150 8, 180 32, 236 20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {/* Leaves appearing one by one */}
      {[24, 62, 100, 140, 178, 216].map((x, i) => (
        <motion.path
          key={x}
          d={i % 2 === 0 ? `M${x} 20 q 8 -14 16 -16` : `M${x} 20 q 8 14 16 16`}
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{
            duration: 0.7,
            delay: 0.6 + i * 0.1,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Subtle glow on completion */}
      <motion.circle
        cx="120"
        cy="20"
        r="3"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      />
    </svg>
  );
}
