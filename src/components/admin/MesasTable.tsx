import { motion } from "framer-motion";
import type { OcupacionMesa } from "@/hooks/useMesasAdmin";
import type { Mesa } from "@/types/domain";

interface MesasTableProps {
  mesas: Mesa[];
  ocupacion: Record<string, OcupacionMesa>;
  onEditar: (mesa: Mesa) => void;
  onEliminar: (mesa: Mesa) => void;
}

export function MesasTable({ mesas, ocupacion, onEditar, onEliminar }: MesasTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-pistachio-200/50 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-pistachio-200/50 text-left text-sm">
        <thead className="bg-pistachio-50">
          <tr>
            {["N°", "Nombre", "Capacidad", "Grupos asignados", "Personas esperadas", "Posición", "Acciones"].map(
              (header) => (
                <th
                  key={header}
                  className={`px-4 py-3 font-body text-xs uppercase tracking-wider text-ink-muted ${
                    header === "Acciones" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-pistachio-100">
          {mesas.map((m, i) => {
            const ocup = ocupacion[m.id];
            const personas = ocup?.personas ?? 0;
            const grupos = ocup?.grupos ?? 0;
            const libre = m.capacidad - personas;
            return (
              <motion.tr
                key={m.id}
                className="transition-colors hover:bg-pistachio-50/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <td className="px-4 py-3 font-medium text-olive-900">{m.numero}</td>
                <td className="px-4 py-3 text-ink">
                  {m.nombre ?? `Mesa ${m.numero}`}
                  {!m.nombre && <span className="text-ink-muted"> · sin nombre</span>}
                </td>
                <td className="px-4 py-3 text-ink-light">{m.capacidad}</td>
                <td className="px-4 py-3 text-ink-light">{grupos}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      libre < 0
                        ? "text-champagne-300"
                        : libre === 0
                          ? "text-pistachio-600"
                          : "text-ink-light"
                    }`}
                  >
                    {personas} / {m.capacidad}
                  </span>
                  {libre < 0 && <span className="ml-1 text-xs text-champagne-300">(sobrecupo)</span>}
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  ({m.pos_x}%, {m.pos_y}%)
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEditar(m)}
                    className="mr-3 text-pistachio-600 transition-colors hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(m)}
                    className="text-champagne-300 transition-colors hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </motion.tr>
            );
          })}
          {mesas.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-ink-muted/50">
                No hay mesas configuradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}