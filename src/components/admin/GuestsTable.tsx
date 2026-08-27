import { useState } from "react";
import { motion } from "framer-motion";
import type { GrupoInvitacion } from "@/types/domain";

interface GuestsTableProps {
  grupos: GrupoInvitacion[];
  onEditar: (grupo: GrupoInvitacion) => void;
  onEliminar: (grupo: GrupoInvitacion) => void;
}

const BADGE: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "bg-pistachio-100 text-pistachio-700 border-pistachio-300",
  pending: "bg-champagne-200 text-olive-700 border-champagne-300",
  declined: "bg-pistachio-50 text-ink-muted border-pistachio-200",
};

const ETIQUETA: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  declined: "Rechazado",
};

function enlaceInvitacion(accessToken: string): string {
  return `${window.location.origin}/invitacion/${accessToken}`;
}

export function GuestsTable({ grupos, onEditar, onEliminar }: GuestsTableProps) {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  async function copiarEnlace(grupo: GrupoInvitacion) {
    await navigator.clipboard.writeText(enlaceInvitacion(grupo.access_token));
    setCopiadoId(grupo.id);
    window.setTimeout(() => setCopiadoId((actual) => (actual === grupo.id ? null : actual)), 1500);
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-pistachio-200/50 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-pistachio-200/50 text-left text-sm">
        <thead className="bg-pistachio-50">
          <tr>
            {["Grupo", "Invitado principal", "Personas", "Estado", "Mesa", "Acciones"].map(
              (header) => (
                <th
                  key={header}
                  className={`px-4 py-3 font-body text-xs uppercase tracking-wider text-ink-muted ${
                    header === "Acciones" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-pistachio-100">
          {grupos.map((g, i) => (
            <motion.tr
              key={g.id}
              className="transition-colors hover:bg-pistachio-50/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <td className="px-4 py-3 font-medium text-olive-900">{g.nombre_grupo}</td>
              <td className="px-4 py-3 text-ink-light">{g.invitado_principal}</td>
              <td className="px-4 py-3 text-ink-light">{g.limite_personas}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE[g.estado]}`}
                >
                  {ETIQUETA[g.estado]}
                </span>
              </td>
              <td className="px-4 py-3 text-ink-light">
                {g.mesa?.nombre ?? (g.mesa?.numero ? `Mesa ${g.mesa.numero}` : "—")}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => void copiarEnlace(g)}
                  className="mr-3 text-ink-muted transition-colors hover:text-olive-700 hover:underline"
                >
                  {copiadoId === g.id ? "¡Copiado!" : "Copiar enlace"}
                </button>
                <button
                  onClick={() => onEditar(g)}
                  className="mr-3 text-pistachio-600 transition-colors hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(g)}
                  className="text-champagne-300 transition-colors hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </motion.tr>
          ))}
          {grupos.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-ink-muted/50">
                No hay grupos que coincidan con el filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
