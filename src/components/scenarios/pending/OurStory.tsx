import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const HITOS = [
  {
    anio: "2019",
    titulo: "Un café que se alargó",
    texto: "Se conocieron en la boda de un amigo en común y terminaron hablando hasta que apagaron las luces del salón.",
  },
  {
    anio: "2021",
    titulo: "La primera casa",
    texto: "Adoptaron a Oliva, su perrita, y con ella llegó la costumbre de las caminatas de domingo.",
  },
  {
    anio: "2025",
    titulo: "La pregunta",
    texto: "Mauricio le propuso matrimonio en el mismo mirador de su primera cita, con la misma canción de fondo.",
  },
];

export function OurStory() {
  return (
    <section className="section-shell bg-alabaster">
      <Reveal className="text-center">
        <p className="eyebrow">Nuestra historia</p>
        <h2 className="mt-3 font-display text-3xl italic text-olive-900 sm:text-4xl">
          Cómo llegamos hasta aquí
        </h2>
        <OliveDivider className="text-pistachio-400" />
      </Reveal>

      <div className="mt-8 space-y-6">
        {HITOS.map((hito, i) => (
          <Reveal key={hito.anio} delay={i * 0.12} className="card-surface">
            <p className="eyebrow text-pistachio-600">{hito.anio}</p>
            <h3 className="mt-2 font-display text-xl text-olive-900">{hito.titulo}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/80">{hito.texto}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
