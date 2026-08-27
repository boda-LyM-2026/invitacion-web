import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NuevoGrupoInput } from "@/hooks/useGuestsAdmin";
import type { CategoriaInvitado, GrupoInvitacion, NivelImportancia } from "@/types/domain";

interface GuestFormModalProps {
  grupoInicial: GrupoInvitacion | null;
  onCancelar: () => void;
  onGuardar: (input: NuevoGrupoInput) => Promise<void>;
}

const CATEGORIAS: CategoriaInvitado[] = [
  "familia_novia",
  "familia_novio",
  "amigos_novia",
  "amigos_novio",
  "trabajo",
  "otros",
];

const IMPORTANCIAS: NivelImportancia[] = ["principal", "estandar", "cortesia"];

export function GuestFormModal({ grupoInicial, onCancelar, onGuardar }: GuestFormModalProps) {
  const [form, setForm] = useState<NuevoGrupoInput>({
    nombre_grupo: grupoInicial?.nombre_grupo ?? "",
    invitado_principal: grupoInicial?.invitado_principal ?? "",
    limite_personas: grupoInicial?.limite_personas ?? 1,
    categoria: grupoInicial?.categoria ?? "otros",
    importancia: grupoInicial?.importancia ?? "estandar",
  });
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit() {
    setGuardando(true);
    await onGuardar(form);
    setGuardando(false);
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl border border-pistachio-200/50 bg-white p-6 shadow-cinematic"
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
              disabled={guardando || !form.nombre_grupo || !form.invitado_principal}
              className="rounded-xl bg-olive px-5 py-2.5 font-body text-sm text-alabaster shadow-soft transition-all hover:bg-olive-500 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
