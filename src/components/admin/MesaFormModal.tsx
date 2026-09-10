import { useState } from "react";
import { motion } from "framer-motion";
import type { NuevaMesaInput } from "@/hooks/useMesasAdmin";
import type { Mesa } from "@/types/domain";

interface MesaFormModalProps {
  mesaInicial: Mesa | null;
  onCancelar: () => void;
  onGuardar: (input: NuevaMesaInput) => Promise<void>;
}

export function MesaFormModal({ mesaInicial, onCancelar, onGuardar }: MesaFormModalProps) {
  const [form, setForm] = useState<NuevaMesaInput>({
    numero: mesaInicial?.numero ?? 12,
    nombre: mesaInicial?.nombre ?? "",
    capacidad: mesaInicial?.capacidad ?? 8,
    pos_x: mesaInicial?.pos_x ?? 50,
    pos_y: mesaInicial?.pos_y ?? 50,
  });
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit() {
    setGuardando(true);
    await onGuardar(form);
    setGuardando(false);
  }

  return (
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
          {mesaInicial ? `Editar ${mesaInicial.nombre ?? `Mesa ${mesaInicial.numero}`}` : "Nueva mesa"}
        </h2>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Número
              </label>
              <input
                type="number"
                min={1}
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Capacidad
              </label>
              <input
                type="number"
                min={1}
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
              Nombre (opcional)
            </label>
            <input
              value={form.nombre ?? ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value || null })}
              placeholder="Ej. Mesa Azahar"
              className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Posición X (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.pos_x}
                onChange={(e) => setForm({ ...form, pos_x: Number(e.target.value) })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Posición Y (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.pos_y}
                onChange={(e) => setForm({ ...form, pos_y: Number(e.target.value) })}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
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
            disabled={guardando || form.numero <= 0 || form.capacidad <= 0}
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