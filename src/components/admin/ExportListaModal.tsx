import { useState } from "react";
import { motion } from "framer-motion";
import type { OrdenListaInvitados } from "@/lib/exportUtils";
import type { EstadoInvitacion } from "@/types/domain";

export type EstadoListaInvitados = "todos" | EstadoInvitacion;

interface ExportListaModalProps {
  formato: "pdf" | "excel";
  onCancelar: () => void;
  onExportar: (orden: OrdenListaInvitados, estado: EstadoListaInvitados) => void;
}

const OPCIONES_ESTADO: { value: EstadoListaInvitados; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "confirmed", label: "Confirmados" },
  { value: "declined", label: "Rechazados" },
  { value: "pending", label: "Pendientes" },
];

const OPCIONES: { value: OrdenListaInvitados; titulo: string; detalle: string }[] = [
  {
    value: "alfabetico",
    titulo: "Orden alfabético",
    detalle: "Una fila por invitado, ordenada por nombre. Columnas: Nombre Invitado y Mesa.",
  },
  {
    value: "grupo",
    titulo: "Agrupado por grupo",
    detalle: "Cada grupo encabeza su sección. Columnas: Grupo, Invitado y Mesa.",
  },
];

export function ExportListaModal({ formato, onCancelar, onExportar }: ExportListaModalProps) {
  const [orden, setOrden] = useState<OrdenListaInvitados>("alfabetico");
  const [estado, setEstado] = useState<EstadoListaInvitados>("todos");

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
          Lista de invitados · {formato.toUpperCase()}
        </h2>
        <p className="mt-3 font-body text-sm text-ink-light">
          Elige el orden y qué invitados quieres incluir en el documento.
        </p>

        <div className="mt-5">
          <p className="font-body text-xs uppercase tracking-wider text-olive/70">Orden</p>
          <div className="mt-3 space-y-3">
            {OPCIONES.map((opcion) => (
              <label
                key={opcion.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  orden === opcion.value
                    ? "border-olive bg-pistachio-50/60"
                    : "border-pistachio-200 hover:border-pistachio-400"
                }`}
              >
                <input
                  type="radio"
                  name="orden-lista-invitados"
                  value={opcion.value}
                  checked={orden === opcion.value}
                  onChange={() => setOrden(opcion.value)}
                  className="mt-1 accent-olive"
                />
                <span>
                  <span className="block font-body text-sm font-medium text-olive-900">
                    {opcion.titulo}
                  </span>
                  <span className="mt-1 block font-body text-xs leading-relaxed text-ink-muted">
                    {opcion.detalle}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="estado-lista-invitados"
            className="font-body text-xs uppercase tracking-wider text-olive/70"
          >
            Invitados a incluir
          </label>
          <select
            id="estado-lista-invitados"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoListaInvitados)}
            className="mt-2 w-full rounded-lg border border-pistachio-200 bg-white px-4 py-2 font-body text-sm text-ink focus:border-olive focus:outline-none"
          >
            {OPCIONES_ESTADO.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
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
            onClick={() => onExportar(orden, estado)}
            className="rounded-xl bg-olive px-5 py-2.5 font-body text-sm text-alabaster shadow-soft transition-all hover:bg-olive-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Exportar {formato.toUpperCase()}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
