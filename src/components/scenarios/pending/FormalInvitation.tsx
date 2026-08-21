import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";

export function FormalInvitation() {
  return (
    <section className="section-shell bg-leaf-fade">
      <Reveal className="card-surface text-center">
        <p className="eyebrow">Con la bendición de Dios y de nuestros padres</p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-pistachio-600">Padres de la novia</p>
            <p className="mt-2 font-display text-lg text-olive-900">Rosa Delgado</p>
            <p className="font-display text-lg text-olive-900">Fernando Vega</p>
          </div>
          <div>
            <p className="eyebrow text-pistachio-600">Padres del novio</p>
            <p className="mt-2 font-display text-lg text-olive-900">Elena Suárez</p>
            <p className="font-display text-lg text-olive-900">Ricardo Vargas</p>
          </div>
        </div>

        <OliveDivider className="text-pistachio-400" />

        <p className="font-display text-2xl italic text-olive-900">
          Tenemos el gusto de invitarte a celebrar nuestra unión
        </p>

        <div className="mt-6 space-y-1 font-body text-sm uppercase tracking-widest2 text-ink/80">
          <p>Sábado 14 de noviembre de 2026</p>
          <p>6:00 p.m.</p>
          <p>Hacienda Los Olivos, Cochabamba</p>
        </div>
      </Reveal>
    </section>
  );
}
