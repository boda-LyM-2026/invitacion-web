import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

function GraduationIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  );
}

function HeartIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 21 5 14" />
    </svg>
  );
}

function SparklesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z" />
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
    anio: "2018",
    titulo: "Donde todo comenzó",
    texto: "Nos conocimos en la universidad gracias a unos amigos en común. En ese momento quedó solo como un encuentro, sin imaginar todo lo que vendría después.",
    Icon: GraduationIcon,
  },
  {
    anio: "2020",
    titulo: "Cuando nació el amor",
    texto: "En plena pandemia comenzamos a hablar cada vez más. Entre mensajes, risas y nuestras primeras salidas, poco a poco dejamos de ser solo amigos.",
    Icon: HeartIcon,
  },
  {
    anio: "2021",
    titulo: "Nuestra historia",
    texto: "En enero decidimos comenzar oficialmente esta aventura juntos. Desde entonces, hemos crecido, aprendido y compartido la vida de la mano.",
    Icon: SparklesIcon,
  },
  {
    anio: "2025",
    titulo: "El gran sí",
    texto: "En noviembre llegó la pregunta que cambiaría nuestro siguiente capítulo. Dijimos sí a una vida juntos y comenzamos a soñar con nuestra boda.",
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
