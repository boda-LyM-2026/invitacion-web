import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  variant?: "fade-up" | "fade-left" | "fade-right" | "scale-in" | "blur-in";
  parallax?: boolean;
  parallaxSpeed?: number;
}

const variants = {
  "fade-up": { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  "scale-in": { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  "blur-in": { hidden: { opacity: 0, filter: "blur(10px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 40,
  variant = "fade-up",
  parallax = false,
  parallaxSpeed = 0.3,
}: RevealProps) {
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60 * parallaxSpeed]);

  const selectedVariant = variant === "fade-up" && y !== 40
    ? { hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }
    : variants[variant];

  if (parallax) {
    return (
      <motion.div
        className={className}
        style={{ y: parallaxY }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        variants={selectedVariant}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={selectedVariant}
    >
      {children}
    </motion.div>
  );
}
