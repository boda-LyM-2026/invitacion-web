interface KpiCardProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

export function KpiCard({ label, value, accent = false }: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        accent ? "border-pistachio-300 bg-pistachio-50" : "border-neutral-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 font-display text-3xl text-olive-900">{value}</p>
    </div>
  );
}
