import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AcompananteInput, NuevoGrupoInput } from "@/hooks/useGuestsAdmin";
import { CATEGORIAS, ESTADOS, ETIQUETAS_ESTADO, IMPORTANCIAS } from "@/config/catalogos";
import type { CategoriaInvitado, EstadoInvitacion, GrupoInvitacion, Mesa, NivelImportancia } from "@/types/domain";

interface GuestFormModalProps {
  grupoInicial: GrupoInvitacion | null;
  mesas: Mesa[];
  onCancelar: () => void;
  onGuardar: (input: NuevoGrupoInput) => Promise<void>;
}

export function GuestFormModal({ grupoInicial, mesas, onCancelar, onGuardar }: GuestFormModalProps) {
  const [form, setForm] = useState<NuevoGrupoInput>({
    nombre_grupo: grupoInicial?.nombre_grupo ?? "",
    invitado_principal: grupoInicial?.invitado_principal ?? "",
    limite_personas: grupoInicial?.limite_personas ?? 1,
    categoria: grupoInicial?.categoria ?? "otros",
    importancia: grupoInicial?.importancia ?? "estandar",
    mesa_id: grupoInicial?.mesa_id ?? grupoInicial?.mesa?.id ?? null,
    estado: grupoInicial?.estado ?? "pending",
    acompanantes: (grupoInicial?.acompanantes ?? []).map((a) => ({
      nombre_completo: a.nombre_completo ?? "",
      es_nino: a.es_nino,
    })),
  });
  const [guardando, setGuardando] = useState(false);

  const acompanantes = form.acompanantes ?? [];
  /** El titular cuenta como una persona: los acompanantes nunca superan el límite - 1. */
  const maxAcompanantes = Math.max(0, form.limite_personas - 1);
  const excedeLimite = acompanantes.filter((a) => a.nombre_completo.trim()).length > maxAcompanantes;

  function actualizarAcompanantes(indice: number, cambios: Partial<AcompananteInput>) {
    setForm({
      ...form,
      acompanantes: acompanantes.map((a, i) => (i === indice ? { ...a, ...cambios } : a)),
    });
  }

  function agregarAcompanante() {
    if (acompanantes.length >= maxAcompanantes) return;
    setForm({ ...form, acompanantes: [...acompanantes, { nombre_completo: "", es_nino: false }] });
  }

  function quitarAcompanante(indice: number) {
    setForm({ ...form, acompanantes: acompanantes.filter((_, i) => i !== indice) });
  }

  async function handleSubmit() {
    setGuardando(true);
    await onGuardar({
      ...form,
      acompanantes: acompanantes.filter((a) => a.nombre_completo.trim()),
    });
    setGuardando(false);
  }

  return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/40 px-4 py-8 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      <motion.div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-pistachio-200/50 bg-white p-6 shadow-cinematic"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-light italic text-olive-900">
          {grupoInicial ? "Editar grupo" : "Nuevo grupo de invitación"}
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
              Nombre del grupo
            </label>
            <input
              value={form.nombre_grupo}
              onChange={(e) => setForm({ ...form, nombre_grupo: e.target.value })}
              className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
              Invitado principal
            </label>
            <input
              value={form.invitado_principal}
              onChange={(e) => setForm({ ...form, invitado_principal: e.target.value })}
              className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
              Límite de personas
            </label>
            <input
              type="number"
              min={1}
              value={form.limite_personas}
              onChange={(e) => setForm({ ...form, limite_personas: Number(e.target.value) })}
              className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
            />
          </div>

          <div className="rounded-xl border border-pistachio-200/60 bg-alabaster/60 p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <label className="font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Acompañantes
              </label>
              <span className="font-body text-xs text-ink-muted">
                {acompanantes.filter((a) => a.nombre_completo.trim()).length} de {maxAcompanantes}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {acompanantes.map((acompanante, indice) => (
                  <motion.div
                    key={indice}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      value={acompanante.nombre_completo}
                      onChange={(e) =>
                        actualizarAcompanantes(indice, { nombre_completo: e.target.value })
                      }
                      placeholder="Nombre del acompañante"
                      className="min-w-0 flex-1 rounded-lg border border-pistachio-200 bg-white px-3 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none"
                    />
                    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 font-body text-xs text-ink-muted">
                      <input
                        type="checkbox"
                        checked={acompanante.es_nino}
                        onChange={(e) => actualizarAcompanantes(indice, { es_nino: e.target.checked })}
                        className="h-4 w-4 accent-olive"
                      />
                      Niño
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => quitarAcompanante(indice)}
                      aria-label={`Quitar acompañante ${indice + 1}`}
                      className="shrink-0 rounded-lg px-2 py-1.5 font-body text-sm text-ink-muted transition-colors hover:bg-pistachio-50 hover:text-olive-900"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {acompanantes.length === 0 && (
                <p className="font-body text-xs text-ink-muted">
                  Sin acompanantes registrados. El titular es la única persona del grupo.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={agregarAcompanante}
              disabled={acompanantes.length >= maxAcompanantes}
              className="mt-3 rounded-lg border border-pistachio-200 px-3 py-1.5 font-body text-xs text-olive-900 transition-colors hover:bg-pistachio-50 disabled:opacity-40"
            >
              + Añadir acompañante
            </button>

            {excedeLimite && (
              <p className="mt-2 font-body text-xs text-red-700">
                Hay más acompanantes que personas permitidas. Sube el límite o quitasome.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Categoría
              </label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaInvitado })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Importancia
              </label>
              <select
                value={form.importancia}
                onChange={(e) => setForm({ ...form, importancia: e.target.value as NivelImportancia })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none"
              >
                {IMPORTANCIAS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Mesa asignada
              </label>
              <select
                value={form.mesa_id ?? ""}
                onChange={(e) => setForm({ ...form, mesa_id: e.target.value || null })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none"
              >
                <option value="">Sin asignar</option>
                {mesas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre ? `${m.numero} · ${m.nombre}` : `Mesa ${m.numero}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoInvitacion })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none"
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {ETIQUETAS_ESTADO[e]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <motion.button
            onClick={onCancelar}
            className="rounded-xl px-5 py-2.5 font-body text-sm text-ink-muted transition-colors hover:bg-pistachio-50 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={
              guardando || !form.nombre_grupo || !form.invitado_principal || excedeLimite
            }
            className="rounded-xl bg-olive px-5 py-2.5 font-body text-sm text-alabaster shadow-soft transition-all hover:bg-olive-500 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}