import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

export function GiftsSection() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-white.jpeg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/30" />

      <div className="section-content relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow">Un detalle, si lo deseas</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            Regalos
          </h2>
          <OliveDivider className="text-pistachio-400" />
          <p className="mt-4 mx-auto max-w-md font-body text-sm leading-relaxed text-ink-light">
            Si deseas obsequiarnos algo, puedes hacerlo de alguna de estas dos formas. 
            Escoge la que más te acomode.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Regalos físicos */}
          <Reveal delay={0.15} variant="fade-up">
            <div className="card-surface h-full flex flex-col items-center p-6 md:p-8 text-center">
              <p className="eyebrow text-olive/60">Opción 1</p>
              <h3 className="mt-2 font-display text-2xl font-light text-olive-900">
                Lista de regalos físicos
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-light">
                Escanea este QR para solicitar la lista de regalos que hemos seleccionado. 
                Podrás elegir el que prefieras desde ahí.
              </p>
              <div className="mt-6 rounded-2xl overflow-hidden shadow-soft border border-pistachio-200/50 bg-white">
                <img
                  src="/images/regalos/QR-regalos-fisico.jpeg"
                  alt="QR para lista de regalos físicos"
                  width={256}
                  height={256}
                  className="w-64 h-64 object-cover"
                  loading="lazy"
                />
              </div>
              <a
                href="https://wa.link/ukrzab"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-4 inline-flex"
              >
                Solicitar lista
              </a>
            </div>
          </Reveal>

          {/* Regalo monetario */}
          <Reveal delay={0.25} variant="fade-up">
            <div className="card-surface h-full flex flex-col items-center p-6 md:p-8 text-center">
              <p className="eyebrow text-olive/60">Opción 2</p>
              <h3 className="mt-2 font-display text-2xl font-light text-olive-900">
                Regalo monetario
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink-light">
                Si prefieres hacernos un regalo mediante transferencia, 
                escanea este QR e indica el monto que desees.
              </p>
              <div className="mt-6 rounded-2xl overflow-hidden shadow-soft border border-pistachio-200/50 bg-white">
                <img
                  src="/images/regalos/QR-regalos-monetario.jpeg"
                  alt="QR para regalo monetario"
                  width={256}
                  height={256}
                  className="w-64 h-64 object-cover"
                  loading="lazy"
                />
              </div>
              <a
                href="/images/regalos/QR-regalos-monetario.jpeg"
                download="QR-regalos-monetarios.jpg"
                className="btn-ghost mt-4 inline-flex"
              >
                Descargar QR
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
