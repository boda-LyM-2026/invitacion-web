import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import { FECHA_BODA_TEXTO, HORA_BODA_TEXTO, LUGAR_BODA_COMPLETO } from "@/config/wedding";

export function FormalInvitation() {
  return (
    <section className="section-cinematic film-grain">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/tarjetas-con-nombres-invitados.jpg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/90 backdrop-blur-sm" />

      <div className="relative z-10">
        <Reveal className="text-center" variant="blur-in">
          <div className="card-surface shimmer-border mx-auto max-w-lg p-8 md:p-12">
            {/* Decorative top line */}
            <motion.div
              className="mx-auto mb-6 h-px bg-gradient-to-r from-transparent via-olive/30 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />

            <p className="eyebrow text-olive/60">Con la bendición de Dios y de nuestros padres</p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Reveal delay={0.2} variant="fade-left">
                <div>
                  <p className="eyebrow text-olive">Padres de la novia</p>
                  <p className="mt-3 font-display text-2xl font-light text-olive-900">Rosa Delgado</p>
                  <p className="font-display text-2xl font-light text-olive-900">Fernando Vega</p>
                </div>
              </Reveal>
              <Reveal delay={0.3} variant="fade-right">
                <div>
                  <p className="eyebrow text-olive">Padres del novio</p>
                  <p className="mt-3 font-display text-2xl font-light text-olive-900">Elena Suárez</p>
                  <p className="font-display text-2xl font-light text-olive-900">Ricardo Vargas</p>
                </div>
              </Reveal>
            </div>

            <OliveDivider className="my-8 text-pistachio-400" />

            <Reveal delay={0.4} variant="fade-up">
              <p className="font-display text-3xl font-light italic text-olive-900">
                Tenemos el gusto de invitarte a celebrar nuestra unión
              </p>
            </Reveal>

            <motion.div
              className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-olive/20 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "80px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1.5 }}
            />

            <Reveal delay={0.5} variant="scale-in">
              <div className="mt-8 space-y-2 font-body text-sm uppercase tracking-cinematic text-ink-light">
                <p>Sábado {FECHA_BODA_TEXTO}</p>
                <p className="font-display text-lg normal-case tracking-normal text-olive-900">
                  {HORA_BODA_TEXTO}
                </p>
                <p>{LUGAR_BODA_COMPLETO}</p>
              </div>
            </Reveal>

            {/* Decorative bottom line */}
            <motion.div
              className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-olive/30 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.5 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
