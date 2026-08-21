import { WaxSeal } from "./WaxSeal";

export function Footer() {
  return (
    <footer className="bg-olive-fade px-6 py-16 text-center text-alabaster">
      <WaxSeal size={56} className="mx-auto mb-6 opacity-90" />
      <p className="font-display text-2xl italic">Gracias por ser parte de nuestra historia</p>
      <p className="mt-3 font-body text-sm uppercase tracking-widest2 text-champagne/80">
        Lenan &amp; Mauricio · 14 de noviembre de 2026
      </p>
    </footer>
  );
}
