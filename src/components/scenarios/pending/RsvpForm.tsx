import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import { useRsvp } from "@/hooks/useRsvp";
import type { GrupoInvitacion, RsvpPayload } from "@/types/domain";

interface RsvpFormProps {
  grupo: GrupoInvitacion;
  onSuccess: () => void;
}

type CampoAcompanante = RsvpPayload["acompanantes"][number];

export function RsvpForm({ grupo, onSuccess }: RsvpFormProps) {
  const { submitRsvp, submitting, error } = useRsvp();
  const [intencion, setIntencion] = useState<"confirmed" | "declined" | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const exitoTimerRef = useRef<number | null>(null);

  // No disparar onSuccess si el usuario ya navegó/desmontó el componente.
  useEffect(() => {
    return () => {
      if (exitoTimerRef.current) {
        window.clearTimeout(exitoTimerRef.current);
        exitoTimerRef.current = null;
      }
    };
  }, []);

  const cuposAcompanantes = Math.max(grupo.limite_personas - 1, 0);
  const [acompanantes, setAcompanantes] = useState<CampoAcompanante[]>(() => {
    if (grupo.acompanantes.length > 0) {
      return grupo.acompanantes.map((a) => ({
        id: a.id,
        nombre_completo: a.nombre_completo ?? "",
        es_nino: a.es_nino,
      }));
    }
    return Array.from({ length: cuposAcompanantes }, () => ({ nombre_completo: "", es_nino: false }));
  });

  const puedeEnviar = useMemo(() => {
    if (!intencion) return false;
    if (intencion === "declined") return true;
    return acompanantes.every((a) => a.nombre_completo.trim().length > 0 || cuposAcompanantes === 0);
  }, [intencion, acompanantes, cuposAcompanantes]);

  function actualizarAcompanante(index: number, cambios: Partial<CampoAcompanante>) {
    setAcompanantes((prev) => prev.map((a, i) => (i === index ? { ...a, ...cambios } : a)));
  }

  async function handleSubmit() {
    if (!intencion) return;
    const ok = await submitRsvp(grupo.access_token, {
      estado: intencion,
      mensaje_rsvp: mensaje.trim() || null,
      acompanantes: intencion === "confirmed" ? acompanantes.filter((a) => a.nombre_completo.trim()) : [],
    });
    if (ok) {
      setExito(true);
      exitoTimerRef.current = window.setTimeout(() => onSuccess(), 2000);
    }
  }

  if (exito) {
    return (
      <section id="rsvp" className="section-cinematic relative overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-white.jpeg')" }}
      />
      <div className="absolute inset-0 bg-alabaster/80" />
        <motion.div
          className="section-content relative z-10 flex min-h-[50vh] flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-6xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ✓
          </motion.div>
          <h2 className="mt-6 font-display text-3xl font-light italic text-olive-900">
            ¡Gracias por confirmar!
          </h2>
          <p className="mt-4 font-body text-sm text-ink-light">
            Tu respuesta ha sido registrada exitosamente.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="section-cinematic relative overflow-hidden">
      {/* Background image */}
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('/fondo-white.jpeg')" }}
        />
        <div className="absolute inset-0 bg-alabaster/80" />

      <div className="section-content relative z-10">
        <Reveal className="text-center" variant="fade-up">
          <p className="eyebrow text-olive/60">Confirma tu asistencia</p>
          <h2 className="mt-4 font-display text-4xl font-light italic text-olive-900 sm:text-5xl">
            {grupo.invitado_principal}, ¿nos acompañas?
          </h2>
          <OliveDivider className="text-pistachio-400" />
          <p className="mt-4 font-body text-sm text-ink-light">
            Tu grupo tiene {grupo.limite_personas} {grupo.limite_personas === 1 ? "lugar" : "lugares"}{" "}
            reservados.
          </p>
        </Reveal>

        {/* Decision buttons */}
        <Reveal delay={0.2} variant="scale-in" className="mt-10 flex justify-center gap-4">
          <motion.button
            type="button"
            onClick={() => setIntencion("confirmed")}
            className={`relative overflow-hidden rounded-full px-10 py-4 font-body text-sm uppercase tracking-[0.18em] transition-all duration-500 ${
              intencion === "confirmed"
                ? "bg-olive text-alabaster shadow-glow-olive"
                : "border border-olive/30 bg-white/80 text-olive-900 hover:bg-pistachio-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {intencion === "confirmed" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            )}
            Sí, ahí estaré
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setIntencion("declined")}
            className={`rounded-full px-10 py-4 font-body text-sm uppercase tracking-[0.18em] transition-all duration-500 ${
              intencion === "declined"
                ? "border border-olive/40 bg-pistachio-50/80 text-olive-900"
                : "border border-olive/20 bg-white/70 text-ink-muted hover:bg-pistachio-50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            No podré ir
          </motion.button>
        </Reveal>

        {/* Companion form */}
        <AnimatePresence>
          {intencion === "confirmed" && cuposAcompanantes > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-10 max-w-md space-y-4"
            >
              <p className="eyebrow text-center text-olive/60">Acompañantes</p>
              {acompanantes.map((a, i) => (
                <motion.div
                  key={a.id ?? i}
                  className="rounded-2xl border border-pistachio-200/50 bg-white/80 p-5 shadow-soft backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <label className="mb-2 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                    Invitado {i + 1}
                  </label>
                  <input
                    type="text"
                    value={a.nombre_completo}
                    onChange={(e) => actualizarAcompanante(i, { nombre_completo: e.target.value })}
                    placeholder="Nombre completo"
                    className="w-full rounded-xl border border-pistachio-200 bg-white/90 px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
                  />
                  <label className="mt-3 flex items-center gap-3 font-body text-xs text-ink-muted">
                    <input
                      type="checkbox"
                      checked={a.es_nino}
                      onChange={(e) => actualizarAcompanante(i, { es_nino: e.target.checked })}
                      className="h-4 w-4 rounded border-pistachio-300 accent-olive"
                    />
                    Es niño/a
                  </label>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message and submit */}
        <AnimatePresence>
          {intencion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto mt-8 max-w-md"
            >
              <label className="mb-2 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Mensaje para los novios (opcional)
              </label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-pistachio-200 bg-white/90 px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
                placeholder="Déjales unas palabras..."
              />

              {error && (
                <p className="mt-4 text-center font-body text-sm text-olive-700">{error}</p>
              )}

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={!puedeEnviar || submitting}
                className="btn-primary mt-8 w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Enviando...
                  </motion.span>
                ) : (
                  "Enviar respuesta"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
