import { motion } from "framer-motion";

interface ConfirmDialogProps {
  titulo: string;
  mensaje: string;
  confirmarLabel?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmación elegante (reemplaza `window.confirm`) para acciones destructivas. */
export function ConfirmDialog({
  titulo,
  mensaje,
  confirmarLabel = "Eliminar",
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl border border-pistachio-200/50 bg-white p-6 shadow-cinematic"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-light italic text-olive-900">{titulo}</h2>
        <p className="mt-3 font-body text-sm text-ink-light">{mensaje}</p>

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
            onClick={onConfirmar}
            className="rounded-xl bg-champagne-300 px-5 py-2.5 font-body text-sm text-alabaster shadow-soft transition-all hover:bg-champagne-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {confirmarLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}