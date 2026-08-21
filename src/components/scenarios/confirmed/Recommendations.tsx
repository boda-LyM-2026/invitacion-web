import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const GRUPOS = [
  {
    titulo: "Código de vestimenta",
    items: ["Formal / cocktail elegante", "Tonos tierra, verdes y neutros", "Evitar blanco, champagne y verde pistacho"],
  },
  {
    titulo: "Código de conducta",
    items: ["Evento libre de humo dentro del salón", "Celulares en silencio durante la ceremonia", "Cuidemos la decoración y el mobiliario"],
  },
  {
    titulo: "Restricciones",
    items: ["Evento solo para adultos, salvo indicación", "No se permite ingresar con mascotas", "Estacionamiento disponible con valet parking"],
  },
];

export function Recommendations() {
  return (
    <section className="section-shell bg-leaf-fade">
      <Reveal className="text-center">
        <p className="eyebrow">Para tener en cuenta</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Recomendaciones</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {GRUPOS.map((grupo, i) => (
          <Reveal key={grupo.titulo} delay={i * 0.1} className="card-surface">
            <h3 className="font-display text-lg text-olive-900">{grupo.titulo}</h3>
            <ul className="mt-3 space-y-2">
              {grupo.items.map((item) => (
                <li key={item} className="flex items-start gap-2 font-body text-sm text-ink/80">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-pistachio-500" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
