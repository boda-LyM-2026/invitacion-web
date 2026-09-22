import { createContext, useContext } from "react";

export type TipoToast = "success" | "error" | "info";

export interface ToastContextValue {
  toast: (mensaje: string, tipo?: TipoToast) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/** Feedback para las acciones del panel. Debe usarse dentro del <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  return ctx;
}