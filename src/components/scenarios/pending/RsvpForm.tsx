import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/Reveal";
import { OliveDivider } from "@/components/shared/OliveDivider";
import { useRsvp } from "@/hooks/useRsvp";
import type { GrupoInvitacion } from "@/types/domain";

interface RsvpFormProps {
  grupo: GrupoInvitacion;
  onSuccess: () => void;
}

interface CampoAcompanante {
  id?: string;
  nombre_completo: string;
  es_nino: boolean;
}

export function RsvpForm({ grupo, onSuccess }: RsvpFormProps) {
  const { submitRsvp, submitting, error } = useRsvp();
  const [intencion, setIntencion] = useState<"confirmed" | "declined" | null>(null);
  const [mensaje, setMensaje] = useState("");

  // RF-07: si ya existen acompañantes registrados, se precargan sus nombres;
  // si no, se generan campos vacíos según limite_personas (menos el titular).
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
    if (ok) onSuccess();
  }

  return (
    <section id="rsvp" className="section-shell bg-olive-fade text-alabaster">
      <Reveal className="text-center">
        <p className="eyebrow text-champagne/80">Confirma tu asistencia</p>
        <h2 className="mt-3 font-display text-3xl italic sm:text-4xl">
          {grupo.invitado_principal}, ¿nos acompañas?
        </h2>
        <OliveDivider className="text-champagne/70" />
        <p className="font-body text-sm text-alabaster/80">
          Tu grupo tiene {grupo.limite_personas} {grupo.limite_personas === 1 ? "lugar" : "lugares"} reservados.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setIntencion("confirmed")}
          className={`btn-primary ${intencion === "confirmed" ? "" : "opacity-70"}`}
          aria-pressed={intencion === "confirmed"}
        >
          Sí, ahí estaré
        </button>
        <button
          type="button"
          onClick={() => setIntencion("declined")}
          className={`btn-ghost border-alabaster/60 text-alabaster ${intencion === "declined" ? "bg-alabaster/10" : ""}`}
          aria-pressed={intencion === "declined"}
        >
          No podré ir
        </button>
      </Reveal>

      {intencion === "confirmed" && cuposAcompanantes > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-8 max-w-md space-y-4"
        >
          <p className="eyebrow text-champagne/80">Acompañantes</p>
          {acompanantes.map((a, i) => (
            <div key={a.id ?? i} className="rounded-2xl bg-alabaster/10 p-4 backdrop-blur-sm">
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-champagne/70">
                Invitado {i + 1}
              </label>
              <input
                type="text"
                value={a.nombre_completo}
                onChange={(e) => actualizarAcompanante(i, { nombre_completo: e.target.value })}
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-alabaster/30 bg-alabaster/90 px-4 py-2 font-body text-sm text-ink placeholder:text-ink/40 focus:border-champagne focus:outline-none"
              />
              <label className="mt-2 flex items-center gap-2 font-body text-xs text-champagne/80">
                <input
                  type="checkbox"
                  checked={a.es_nino}
                  onChange={(e) => actualizarAcompanante(i, { es_nino: e.target.checked })}
                  className="h-4 w-4 rounded border-alabaster/50 accent-pistachio-400"
                />
                Es niño/a
              </label>
            </div>
          ))}
        </motion.div>
      )}

      {intencion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-6 max-w-md"
        >
          <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-champagne/70">
            Mensaje para los novios (opcional)
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-alabaster/30 bg-alabaster/90 px-4 py-2 font-body text-sm text-ink placeholder:text-ink/40 focus:border-champagne focus:outline-none"
            placeholder="Déjales unas palabras..."
          />

          {error && <p className="mt-3 text-center font-body text-sm text-champagne">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!puedeEnviar || submitting}
            className="btn-primary mt-6 w-full"
          >
            {submitting ? "Enviando..." : "Enviar respuesta"}
          </button>
        </motion.div>
      )}
    </section>
  );
}
