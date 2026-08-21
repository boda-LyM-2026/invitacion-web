import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const REGLAS = [
  "Es una celebración solo para adultos; agradecemos dejar a los peques en casa, salvo indicación contraria en tu invitación.",
  "El código de vestimenta es formal, tonos tierra y verdes son bienvenidos.",
  "Pedimos evitar el color blanco, champagne y verde pistacho: son los tonos de la boda.",
  "Por favor confirma tu asistencia antes del 1 de octubre para poder organizar mesas y menú.",
];

export function CodeOfConduct() {
  return (
    <section className="section-shell bg-alabaster">
      <Reveal className="text-center">
        <p className="eyebrow">Antes de venir</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900">Código de conducta</h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <Reveal delay={0.15}>
        <ul className="mx-auto max-w-md space-y-4">
          {REGLAS.map((regla) => (
            <li key={regla} className="flex items-start gap-3 font-body text-sm leading-relaxed text-ink/80">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pistachio-500" />
              {regla}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
