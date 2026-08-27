import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
  overlay?: boolean;
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.3,
  direction = "up",
  overlay = false,
}: ParallaxSectionProps) {
  const { scrollYProgress } = useScroll();
  const factor = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, factor * 80 * speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-alabaster/20 via-transparent to-alabaster/20" />
      )}
    </div>
  );
}
