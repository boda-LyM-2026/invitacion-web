import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import { useCountdown } from "@/hooks/useCountdown";

const FECHA_BODA = (import.meta.env.VITE_WEDDING_DATETIME as string) ?? "2026-11-14T18:00:00-04:00";

const UNIDADES: Array<{ key: "dias" | "horas" | "minutos" | "segundos"; label: string }> = [
  { key: "dias", label: "Días" },
  { key: "horas", label: "Horas" },
  { key: "minutos", label: "Min" },
  { key: "segundos", label: "Seg" },
];

export function Countdown() {
  const cuenta = useCountdown(FECHA_BODA);

  return (
    <section className="section-shell bg-leaf-fade text-center">
      <Reveal>
        <p className="eyebrow">Falta poco</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Nos vemos muy pronto</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <Reveal delay={0.15} className="mx-auto grid max-w-sm grid-cols-4 gap-3">
        {UNIDADES.map(({ key, label }) => (
          <div key={key} className="card-surface py-4">
            <p className="font-display text-3xl text-olive-900">
              {String(cuenta[key]).padStart(2, "0")}
            </p>
            <p className="eyebrow mt-1 text-pistachio-600">{label}</p>
          </div>
        ))}
      </Reveal>

      {cuenta.haPasado && (
        <p className="mt-6 font-display italic text-olive-900">¡Hoy es el gran día!</p>
      )}
    </section>
  );
}
