import { motion } from "framer-motion";

interface KpiCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function KpiCard({ label, value, accent = false }: KpiCardProps) {
  return (
    <motion.div
      className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 ${
        accent
          ? "border-olive/30 bg-olive/10 shadow-glow-olive"
          : "border-alabaster/10 bg-alabaster/5 hover:bg-alabaster/10"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <p className="font-body text-xs uppercase tracking-wider text-alabaster/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-light text-alabaster">{value}</p>
    </motion.div>
  );
}
