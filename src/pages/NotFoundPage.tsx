import { WaxSeal } from "@/components/shared/WaxSeal";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-leaf-fade px-6 text-center">
      <WaxSeal size={56} />
      <h1 className="font-display text-2xl italic text-olive-900">
        Lenan &amp; Mauricio se casan el 14 de noviembre de 2026
      </h1>
      <p className="max-w-xs font-body text-sm text-ink/70">
        Usa el enlace personal que te compartimos para ver tu invitación.
      </p>
    </div>
  );
}
