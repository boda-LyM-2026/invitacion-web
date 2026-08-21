import { useState } from "react";
import type { GrupoInvitacion } from "@/types/domain";

interface GuestsTableProps {
  grupos: GrupoInvitacion[];
  onEditar: (grupo: GrupoInvitacion) => void;
  onEliminar: (grupo: GrupoInvitacion) => void;
}

const BADGE: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "bg-pistachio-100 text-pistachio-700",
  pending: "bg-champagne-300 text-olive-700",
  declined: "bg-neutral-200 text-neutral-600",
};

const ETIQUETA: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  declined: "Rechazado",
};

/** Construye el enlace público que se le comparte al invitado (RF-02). */
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
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
      <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Grupo</th>
            <th className="px-4 py-3">Invitado principal</th>
            <th className="px-4 py-3">Personas</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Mesa</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {grupos.map((g) => (
            <tr key={g.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-medium text-olive-900">{g.nombre_grupo}</td>
              <td className="px-4 py-3">{g.invitado_principal}</td>
              <td className="px-4 py-3">{g.limite_personas}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${BADGE[g.estado]}`}>
                  {ETIQUETA[g.estado]}
                </span>
              </td>
              <td className="px-4 py-3">{g.mesa?.nombre ?? (g.mesa?.numero ? `Mesa ${g.mesa.numero}` : "—")}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => void copiarEnlace(g)} className="mr-3 text-neutral-500 hover:text-olive-700 hover:underline">
                  {copiadoId === g.id ? "¡Copiado!" : "Copiar enlace"}
                </button>
                <button onClick={() => onEditar(g)} className="mr-3 text-pistachio-700 hover:underline">
                  Editar
                </button>
                <button onClick={() => onEliminar(g)} className="text-red-600 hover:underline">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {grupos.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                No hay grupos que coincidan con el filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
