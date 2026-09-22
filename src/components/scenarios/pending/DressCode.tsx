import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

export function DressCode() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mesa-fondo-jardin-2.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/85 backdrop-blur-sm" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">Antes de venir</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Dress Code
          </h2>
          <OliveDivider className="text-pistachio-400" />
        </Reveal>

        <Reveal delay={0.2} variant="fade-up">
          <div className="card-surface mx-auto mt-8 max-w-md p-8 text-center md:p-10">
            <p className="eyebrow text-olive/60">DRESS CODE</p>
            <p className="mt-4 font-display text-3xl font-light text-olive-900">
              Formal &amp; Elegante
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink-light">
              Queremos verte lucir increíble ✨
            </p>

            <OliveDivider className="my-6 text-pistachio-400" />

            <p className="font-body text-base leading-relaxed text-ink-light">
              Te pedimos reservar el blanco y tonos similares para la novia.
            </p>
            <p className="mt-6 font-display text-xl font-light italic text-olive-900">
              ¡Gracias por acompañarnos en este día tan especial! 🤍
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}