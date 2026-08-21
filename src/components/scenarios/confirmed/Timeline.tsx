import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const PROGRAMA = [
  { hora: "5:30 p.m.", actividad: "Llegada e ingreso" },
  { hora: "6:00 p.m.", actividad: "Ceremonia civil" },
  { hora: "7:00 p.m.", actividad: "Cóctel de bienvenida" },
  { hora: "8:30 p.m.", actividad: "Cena" },
  { hora: "9:30 p.m.", actividad: "Primer baile y brindis" },
  { hora: "10:00 p.m.", actividad: "Fiesta" },
  { hora: "1:00 a.m.", actividad: "Despedida" },
];

export function Timeline() {
  return (
    <section className="section-shell bg-leaf-fade">
      <Reveal className="text-center">
        <p className="eyebrow">El programa</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Cronograma de la noche</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto max-w-sm">
        <div className="absolute bottom-2 left-[54px] top-2 w-px bg-pistachio-300" aria-hidden="true" />
        <ol className="space-y-6">
          {PROGRAMA.map((item) => (
            <li key={item.hora} className="relative flex items-start gap-4 pl-0">
              <span className="w-[54px] shrink-0 pt-0.5 text-right font-body text-xs uppercase tracking-wide text-pistachio-600">
                {item.hora}
              </span>
              <span className="relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-olive ring-4 ring-alabaster" />
              <span className="font-display text-lg text-olive-900">{item.actividad}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
