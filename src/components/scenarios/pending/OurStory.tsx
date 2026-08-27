import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

const HITOS = [
  {
    anio: "2019",
    titulo: "Un café que se alargó",
    texto: "Se conocieron en la boda de un amigo en común y terminaron hablando hasta que apagaron las luces del salón.",
    icono: "☕",
  },
  {
    anio: "2021",
    titulo: "La primera casa",
    texto: "Adoptaron a Oliva, su perrita, y con ella llegó la costumbre de las caminatas de domingo.",
    icono: "🏠",
  },
  {
    anio: "2025",
    titulo: "La pregunta",
    texto: "Mauricio le propuso matrimonio en el mismo mirador de su primera cita, con la misma canción de fondo.",
    icono: "💍",
  },
];

export function OurStory() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background */}
      <div className="absolute inset-0 bg-alabaster" />
      <div className="absolute inset-0 bg-champagne-glow" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">Nuestra historia</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Cómo llegamos hasta aquí
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        {/* Timeline */}
        <div className="relative mt-12">
          {/* Vertical line */}
          <Reveal variant="scale-in" className="absolute left-8 top-0 bottom-0 w-px md:left-1/2 md:-translate-x-1/2">
            <div className="h-full w-full bg-gradient-to-b from-pistachio-200 via-pistachio-400 to-pistachio-200" />
          </Reveal>

          <div className="space-y-12">
            {HITOS.map((hito, i) => (
              <Reveal
                key={hito.anio}
                delay={i * 0.2}
                variant={i % 2 === 0 ? "fade-left" : "fade-right"}
                className="relative"
              >
                <div className={`flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content card */}
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="card-surface shimmer-border mx-auto max-w-sm p-6 transition-all duration-500 hover:shadow-glow-olive md:mx-0">
                      <p className="eyebrow text-olive">{hito.anio}</p>
                      <h3 className="mt-2 font-display text-2xl font-light text-olive-900">
                        {hito.titulo}
                      </h3>
                      <p className="mt-3 font-body text-sm leading-relaxed text-ink-light">
                        {hito.texto}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-olive shadow-glow-olive">
                    <span className="text-2xl">{hito.icono}</span>
                  </div>

                  {/* Spacer for desktop */}
                  <div className="hidden flex-1 md:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
