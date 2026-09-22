import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BADGES_ESTADO, ETIQUETAS_ESTADO, ETIQUETAS_CATEGORIA } from "@/config/catalogos";
import type { GrupoInvitacion, RSVPAttempt } from "@/types/domain";

interface GuestDetailModalProps {
  grupo: GrupoInvitacion;
  onCerrar: () => void;
}

function formatoFecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GuestDetailModal({ grupo, onCerrar }: GuestDetailModalProps) {
  const [intentos, setIntentos] = useState<RSVPAttempt[]>([]);
  const [copiado, setCopiado] = useState(false);
  const enlace = `${window.location.origin}/invitacion/${grupo.access_token}`;

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .rpc("obtener_historial_rsvp", { p_grupo_id: grupo.id })
      .then(({ data }) => setIntentos((data as RSVPAttempt[]) ?? []));
  }, [grupo.id]);

  async function copiar() {
    await navigator.clipboard.writeText(enlace);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 1500);
  }

  const confirmadas = grupo.estado === "confirmed" ? grupo.acompanantes.length + 1 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-pistachio-200/50 bg-white p-6 shadow-cinematic"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-light italic text-olive-900">
              {grupo.nombre_grupo}
            </h2>
            <p className="mt-1 font-body text-sm text-ink-muted">{grupo.invitado_principal}</p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${BADGES_ESTADO[grupo.estado]}`}
          >
            {ETIQUETAS_ESTADO[grupo.estado]}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 font-body text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Categoría</dt>
            <dd className="mt-1 text-ink-light">{ETIQUETAS_CATEGORIA[grupo.categoria]}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Importancia</dt>
            <dd className="mt-1 text-ink-light">
              <span className="capitalize">{grupo.importancia}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Personas</dt>
            <dd className="mt-1 text-ink-light">
              {confirmadas} confirmadas de {grupo.limite_personas}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Mesa</dt>
            <dd className="mt-1 text-ink-light">
              {grupo.mesa?.nombre
                ? `${grupo.mesa.numero} · ${grupo.mesa.nombre}`
                : grupo.mesa?.numero
                  ? `Mesa ${grupo.mesa.numero}`
                  : "Sin asignar"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Respondió el</dt>
            <dd className="mt-1 text-ink-light">{formatoFecha(grupo.respondido_en)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-muted">Creado el</dt>
            <dd className="mt-1 text-ink-light">{formatoFecha(grupo.creado_en)}</dd>
          </div>
        </dl>

        {/* Enlace personal */}
        <div className="mt-6">
          <dt className="font-body text-xs uppercase tracking-wider text-ink-muted">Enlace de invitación</dt>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-pistachio-200 bg-alabaster px-3 py-2 font-body text-xs text-ink-light">
              {enlace}
            </code>
            <button
              onClick={() => void copiar()}
              className="shrink-0 rounded-lg border border-pistachio-200 px-3 py-2 font-body text-xs text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
            >
              {copiado ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Mensaje del invitado */}
        {(grupo.mensaje_rsvp || null) && (
          <div className="mt-6">
            <h3 className="font-body text-xs uppercase tracking-wider text-ink-muted">Mensaje del invitado</h3>
            <p className="mt-2 rounded-xl border border-pistachio-200/50 bg-pistachio-50 px-4 py-3 font-body text-sm italic text-ink-light">
              “{grupo.mensaje_rsvp}”
            </p>
          </div>
        )}

        {/* Acompañantes */}
        <div className="mt-6">
          <h3 className="font-body text-xs uppercase tracking-wider text-ink-muted">
            Acompañantes ({grupo.acompanantes.length})
          </h3>
          {grupo.acompanantes.length === 0 ? (
            <p className="mt-2 font-body text-sm text-ink-muted/70">Sin acompañantes registrados.</p>
          ) : (
            <ul className="mt-2 divide-y divide-pistachio-100 rounded-xl border border-pistachio-200/50">
              {grupo.acompanantes.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-4 py-2.5 font-body text-sm">
                  <span className="text-ink-light">{a.nombre_completo ?? "Sin nombre"}</span>
                  <span className="text-xs text-ink-muted">
                    {a.es_nino ? "niño" : "adulto"} · {a.confirmado ? "confirmado" : "sin confirmar"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Historial de intentos */}
        <div className="mt-6">
          <h3 className="font-body text-xs uppercase tracking-wider text-ink-muted">
            Historial de intentos de RSVP ({intentos.length})
          </h3>
          {intentos.length === 0 ? (
            <p className="mt-2 font-body text-sm text-ink-muted/70">
              {isSupabaseConfigured
                ? "Sin envíos registrados."
                : "Disponible en modo producción (Supabase)."}
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-pistachio-100 rounded-xl border border-pistachio-200/50">
              {intentos.map((i) => (
                <li key={i.id} className="flex items-center justify-between px-4 py-2.5 font-body text-sm">
                  <span className="text-ink-light">Envío de RSVP</span>
                  <span className="text-xs text-ink-muted">{formatoFecha(i.creado_en)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <motion.button
            onClick={onCerrar}
            className="rounded-xl px-5 py-2.5 font-body text-sm text-ink-muted transition-colors hover:bg-pistachio-50 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cerrar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}