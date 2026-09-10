import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMesasAdmin, type NuevaMesaInput } from "@/hooks/useMesasAdmin";
import { useToast } from "@/hooks/useToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { MesaFormModal } from "@/components/admin/MesaFormModal";
import { MesasTable } from "@/components/admin/MesasTable";
import type { Mesa } from "@/types/domain";

export default function MesasPage() {
  const { mesas, ocupacion, loading, crear, actualizar, eliminar } = useMesasAdmin();
  const { toast } = useToast();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mesaEditando, setMesaEditando] = useState<Mesa | null>(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<Mesa | null>(null);

  async function handleGuardar(input: NuevaMesaInput) {
    if (mesaEditando) {
      const err = await actualizar(mesaEditando.id, input);
      toast(err ?? "Mesa actualizada.", err ? "error" : "success");
    } else {
      const err = await crear(input);
      toast(err ?? "Mesa creada.", err ? "error" : "success");
    }
  }

  async function handleEliminar() {
    if (!confirmandoEliminar) return;
    const err = await eliminar(confirmandoEliminar.id);
    toast(err ?? "Mesa eliminada.", err ? "error" : "success");
    setConfirmandoEliminar(null);
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="font-display text-3xl font-light italic text-olive-900">Mesas del salón</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            {mesas.length} mesas · configura nombre, capacidad y posición del croquis.
          </p>
        </div>
        <motion.button
          onClick={() => {
            setMesaEditando(null);
            setModalAbierto(true);
          }}
          className="rounded-lg bg-olive px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster shadow-soft transition-all hover:bg-olive-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Nueva mesa
        </motion.button>
      </motion.div>

      {loading ? (
        <motion.p
          className="text-ink-muted"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando mesas...
        </motion.p>
      ) : (
        <MesasTable
          mesas={mesas}
          ocupacion={ocupacion}
          onEditar={(m) => {
            setMesaEditando(m);
            setModalAbierto(true);
          }}
          onEliminar={(m) => setConfirmandoEliminar(m)}
        />
      )}

      <AnimatePresence>
        {modalAbierto && (
          <MesaFormModal
            mesaInicial={mesaEditando}
            onCancelar={() => setModalAbierto(false)}
            onGuardar={async (input) => {
              await handleGuardar(input);
              setModalAbierto(false);
              setMesaEditando(null);
            }}
          />
        )}

        {confirmandoEliminar && (
          <ConfirmDialog
            titulo="Eliminar mesa"
            mensaje={`¿Quitar la mesa "${confirmandoEliminar.nombre ?? `Mesa ${confirmandoEliminar.numero}`}"? Los grupos asignados quedarán sin mesa.`}
            onConfirmar={handleEliminar}
            onCancelar={() => setConfirmandoEliminar(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}