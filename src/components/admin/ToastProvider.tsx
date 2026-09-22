import { useCallback, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContext, type TipoToast } from "@/hooks/useToast";

interface ToastItem {
  id: number;
  tipo: TipoToast;
  mensaje: string;
}

const ESTILOS: Record<TipoToast, string> = {
  success: "border-olive/40 bg-white text-olive-900",
  error: "border-champagne-300 bg-white text-champagne-300",
  info: "border-pistachio-300 bg-white text-ink",
};

const ICONO: Record<TipoToast, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

let siguienteId = 1;

/**
 * Feedback no intrusivo para las acciones del panel (crear, editar,
 * eliminar, exportar, importar...). Se consume vía `useToast`.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timer = useRef<number | null>(null);

  const toast = useCallback((mensaje: string, tipo: TipoToast = "info") => {
    const id = siguienteId++;
    setToasts((prev) => [...prev, { id, tipo, mensaje }]);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setToasts([]);
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[90] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-soft ${ESTILOS[t.tipo]}`}
              role="status"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current font-body text-xs">
                {ICONO[t.tipo]}
              </span>
              <span className="font-body text-sm">{t.mensaje}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}