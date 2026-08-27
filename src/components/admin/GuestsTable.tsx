import { useState } from "react";
import { motion } from "framer-motion";
import type { GrupoInvitacion } from "@/types/domain";

interface GuestsTableProps {
  grupos: GrupoInvitacion[];
  onEditar: (grupo: GrupoInvitacion) => void;
  onEliminar: (grupo: GrupoInvitacion) => void;
}

const BADGE: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "bg-olive/20 text-alabaster border-olive/30",
  pending: "bg-champagne/20 text-champagne border-champagne/30",
  declined: "bg-alabaster/10 text-alabaster/60 border-alabaster/20",
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
    <div className="overflow-x-auto rounded-2xl border border-alabaster/10 bg-alabaster/5 backdrop-blur-sm">
      <table className="min-w-full divide-y divide-alabaster/10 text-left text-sm">
        <thead className="bg-alabaster/5">
          <tr>
            {["Grupo", "Invitado principal", "Personas", "Estado", "Mesa", "Acciones"].map(
              (header) => (
                <th
                  key={header}
                  className={`px-4 py-3 font-body text-xs uppercase tracking-wider text-alabaster/50 ${
                    header === "Acciones" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-alabaster/5">
          {grupos.map((g, i) => (
            <motion.tr
              key={g.id}
              className="transition-colors hover:bg-alabaster/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <td className="px-4 py-3 font-medium text-alabaster">{g.nombre_grupo}</td>
              <td className="px-4 py-3 text-alabaster/80">{g.invitado_principal}</td>
              <td className="px-4 py-3 text-alabaster/80">{g.limite_personas}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${BADGE[g.estado]}`}
                >
                  {ETIQUETA[g.estado]}
                </span>
              </td>
              <td className="px-4 py-3 text-alabaster/80">
                {g.mesa?.nombre ?? (g.mesa?.numero ? `Mesa ${g.mesa.numero}` : "—")}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => void copiarEnlace(g)}
                  className="mr-3 text-alabaster/50 transition-colors hover:text-olive hover:underline"
                >
                  {copiadoId === g.id ? "¡Copiado!" : "Copiar enlace"}
                </button>
                <button
                  onClick={() => onEditar(g)}
                  className="mr-3 text-olive transition-colors hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(g)}
                  className="text-champagne transition-colors hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </motion.tr>
          ))}
          {grupos.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-alabaster/30">
                No hay grupos que coincidan con el filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
