import { motion } from "framer-motion";
import { WaxSeal } from "@/components/shared/WaxSeal";

interface ThankYouScreenProps {
  nombreInvitado: string;
}

export function ThankYouScreen({ nombreInvitado }: ThankYouScreenProps) {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-leaf-fade px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <WaxSeal size={64} className="mx-auto mb-8" />
        <p className="eyebrow">Gracias, {nombreInvitado}</p>
        <h1 className="mx-auto mt-4 max-w-sm font-display text-3xl italic text-olive-900">
          Vamos a extrañarte ese día, pero agradecemos muchísimo que nos avises.
        </h1>
        <p className="mx-auto mt-6 max-w-xs font-body text-sm leading-relaxed text-ink/70">
          Nos encantaría verte pronto de todos modos. Con cariño, Lenan &amp; Mauricio.
        </p>
      </motion.div>
    </section>
  );
}
