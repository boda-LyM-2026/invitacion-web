interface WaxSealProps {
  size?: number;
  className?: string;
}

export function WaxSeal({ size = 88, className = "" }: WaxSealProps) {
  return (
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
          <stop offset="0%" stopColor="#A7B78D" />
          <stop offset="55%" stopColor="#7C8B65" />
          <stop offset="100%" stopColor="#54613F" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#sealGradient)" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#3E4732" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#F1F0E8" strokeOpacity="0.5" strokeWidth="0.75" />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize="34"
        fill="#F1F0E8"
      >
        L&amp;M
      </text>
    </svg>
  );
}
