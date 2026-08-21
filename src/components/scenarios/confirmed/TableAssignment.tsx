import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import type { Mesa } from "@/types/domain";

interface TableAssignmentProps {
  mesa: Mesa | null | undefined;
}

// Layout de referencia del salón: se usa cuando no hay datos de otras mesas
// para dibujar (la mesa asignada siempre se resalta con datos reales).
const MESAS_REFERENCIA: Array<Pick<Mesa, "numero" | "pos_x" | "pos_y">> = [
  { numero: 1, pos_x: 15, pos_y: 20 },
  { numero: 2, pos_x: 38, pos_y: 15 },
  { numero: 3, pos_x: 62, pos_y: 15 },
  { numero: 4, pos_x: 85, pos_y: 20 },
  { numero: 5, pos_x: 15, pos_y: 50 },
  { numero: 6, pos_x: 38, pos_y: 50 },
  { numero: 7, pos_x: 62, pos_y: 50 },
  { numero: 8, pos_x: 85, pos_y: 50 },
  { numero: 9, pos_x: 25, pos_y: 80 },
  { numero: 10, pos_x: 50, pos_y: 80 },
  { numero: 11, pos_x: 75, pos_y: 80 },
];

export function TableAssignment({ mesa }: TableAssignmentProps) {
  return (
    <section className="section-shell bg-alabaster">
      <Reveal className="text-center">
        <p className="eyebrow">Tu lugar en la fiesta</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Mesa asignada</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      {mesa ? (
        <Reveal delay={0.1} className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-olive-fade shadow-soft">
            <span className="font-display text-4xl text-alabaster">{mesa.numero}</span>
          </div>
          <p className="mt-3 font-display text-xl text-olive-900">{mesa.nombre ?? `Mesa ${mesa.numero}`}</p>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <p className="text-center font-body text-sm text-ink/70">
            Tu mesa se asignará en los próximos días, ¡te avisaremos!
          </p>
        </Reveal>
      )}

      <Reveal delay={0.2} className="card-surface relative mt-8 h-64 sm:h-72">
        <p className="eyebrow absolute left-6 top-4 text-pistachio-600">Croquis del salón</p>
        {MESAS_REFERENCIA.map((ref) => {
          const esLaMia = mesa?.numero === ref.numero;
          return (
            <div
              key={ref.numero}
              className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-body text-xs transition-all ${
                esLaMia
                  ? "scale-125 bg-olive text-alabaster shadow-soft ring-4 ring-pistachio-300"
                  : "bg-pistachio-100 text-olive-700"
              }`}
              style={{ left: `${ref.pos_x}%`, top: `${ref.pos_y}%` }}
            >
              {ref.numero}
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
