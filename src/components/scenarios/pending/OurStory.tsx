import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

function CoffeeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function HomeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function RingIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="14" r="7" />
      <path d="M9 3.5 12 2l3 1.5" />
      <path d="M9 3.5v3" />
      <path d="M15 3.5v3" />
    </svg>
  );
}

const HITOS = [
  {
    anio: "2019",
    titulo: "Un café que se alargó",
    texto: "Se conocieron en la boda de un amigo en común y terminaron hablando hasta que apagaron las luces del salón.",
    Icon: CoffeeIcon,
  },
  {
    anio: "2021",
    titulo: "La primera casa",
    texto: "Adoptaron a Oliva, su perrita, y con ella llegó la costumbre de las caminatas de domingo.",
    Icon: HomeIcon,
  },
  {
    anio: "2025",
    titulo: "La pregunta",
    texto: "Mauricio le propuso matrimonio en el mismo mirador de su primera cita, con la misma canción de fondo.",
    Icon: RingIcon,
  },
];

export function OurStory() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ramo-de-flores.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />

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

                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-olive shadow-glow-olive">
                    <hito.Icon className="h-7 w-7 text-alabaster" />
                  </div>

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
