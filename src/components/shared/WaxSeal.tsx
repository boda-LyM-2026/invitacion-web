import { motion } from "framer-motion";

interface WaxSealProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function WaxSeal({ size = 88, className = "", animated = true }: WaxSealProps) {
  const seal = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Sello L&M"
    >
      <defs>
        <radialGradient id="sealGradient" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#B3B99C" />
          <stop offset="40%" stopColor="#828661" />
          <stop offset="100%" stopColor="#4B523C" />
        </radialGradient>
        <radialGradient id="sealGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E7DBCB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E7DBCB" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sealShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="40%" stopColor="rgba(231,219,203,0.3)" />
          <stop offset="50%" stopColor="rgba(231,219,203,0.5)" />
          <stop offset="60%" stopColor="rgba(231,219,203,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Glow behind seal */}
      <circle cx="60" cy="60" r="58" fill="url(#sealGlow)" />
      {/* Main seal body */}
      <circle cx="60" cy="60" r="56" fill="url(#sealGradient)" />
      {/* Outer ring */}
      <circle cx="60" cy="60" r="56" fill="none" stroke="#3D412A" strokeOpacity="0.3" strokeWidth="1" />
      {/* Inner decorative ring */}
      <circle cx="60" cy="60" r="46" fill="none" stroke="#F9F9EF" strokeOpacity="0.4" strokeWidth="0.75" />
      {/* Inner ring detail */}
      <circle cx="60" cy="60" r="42" fill="none" stroke="#F9F9EF" strokeOpacity="0.2" strokeWidth="0.5" />
      {/* Text */}
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Fraunces', serif"
        fontSize="34"
        fontWeight="300"
        fill="#F9F9EF"
        letterSpacing="2"
      >
        L&amp;M
      </text>
      {/* Shimmer overlay */}
      <circle cx="60" cy="60" r="56" fill="url(#sealShimmer)" opacity="0.5" />
    </svg>
  );

  if (!animated) return seal;

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Animated glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 20px rgba(130,134,97,0.2)",
            "0 0 40px rgba(130,134,97,0.4)",
            "0 0 20px rgba(130,134,97,0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {seal}
    </motion.div>
  );
}
