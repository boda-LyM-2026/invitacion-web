import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`fixed left-0 right-0 top-0 z-[90] h-[3px] origin-left ${className}`}
      style={{
        scaleX,
        background: "linear-gradient(90deg, #E7DBCB 0%, #828661 50%, #6B6F4E 100%)",
      }}
    />
  );
}
