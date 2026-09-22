import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BADGES_ESTADO, ETIQUETAS_ESTADO, ETIQUETAS_CATEGORIA } from "@/config/catalogos";
import { NOMBRE_NOVIOS } from "@/config/wedding";
import type { GrupoInvitacion } from "@/types/domain";

interface GuestsTableProps {
  grupos: GrupoInvitacion[];
  onEditar: (grupo: GrupoInvitacion) => void;
  onEliminar: (grupo: GrupoInvitacion) => void;
  onDetalle: (grupo: GrupoInvitacion) => void;
}

type ColumnaOrden = "nombre_grupo" | "invitado_principal" | "personas" | "estado" | "mesa";
type Direccion = "asc" | "desc";

const OPCIONES_POR_PAGINA = [10, 20, 50] as const;

function enlaceInvitacion(accessToken: string): string {
  return `${window.location.origin}/invitacion/${accessToken}`;
}

function personasConfirmadas(g: GrupoInvitacion): number {
  return g.estado === "confirmed" ? g.acompanantes.length + 1 : 0;
}

function enlaceWhatsApp(g: GrupoInvitacion): string {
  const url = enlaceInvitacion(g.access_token);
  const texto = `Hola ${g.invitado_principal}, te invitamos a la boda de ${NOMBRE_NOVIOS}. Confirma tu asistencia aquí: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

function nombreMesa(g: GrupoInvitacion): string {
  if (g.mesa?.nombre) return g.mesa.nombre;
  if (g.mesa?.numero) return `Mesa ${g.mesa.numero}`;
  return "—";
}

export function GuestsTable({ grupos, onEditar, onEliminar, onDetalle }: GuestsTableProps) {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [columna, setColumna] = useState<ColumnaOrden>("nombre_grupo");
  const [dir, setDir] = useState<Direccion>("asc");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState<(typeof OPCIONES_POR_PAGINA)[number]>(10);

  async function copiarEnlace(grupo: GrupoInvitacion) {
    await navigator.clipboard.writeText(enlaceInvitacion(grupo.access_token));
    setCopiadoId(grupo.id);
    window.setTimeout(() => setCopiadoId((actual) => (actual === grupo.id ? null : actual)), 1500);
  }

  function cambiarOrden(nueva: ColumnaOrden) {
    if (nueva === columna) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setColumna(nueva);
      setDir("asc");
    }
    setPagina(1);
  }

  const ordenados = useMemo(() => {
    const comparador = (a: GrupoInvitacion, b: GrupoInvitacion): number => {
      switch (columna) {
        case "personas":
          return personasConfirmadas(a) - personasConfirmadas(b);
        case "estado":
          return a.estado.localeCompare(b.estado);
        case "mesa":
          return nombreMesa(a).localeCompare(nombreMesa(b));
        case "invitado_principal":
          return a.invitado_principal.localeCompare(b.invitado_principal);
        default:
          return a.nombre_grupo.localeCompare(b.nombre_grupo);
      }
    };
    const multiplo = dir === "asc" ? 1 : -1;
    return [...grupos].sort((a, b) => comparador(a, b) * multiplo);
  }, [grupos, columna, dir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const visibles = ordenados.slice(inicio, inicio + porPagina);

  const flecha = (c: ColumnaOrden) =>
    columna === c ? (dir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-pistachio-200/50 bg-white shadow-soft">
        <table className="min-w-full divide-y divide-pistachio-200/50 text-left text-sm">
          <thead className="bg-pistachio-50">
            <tr>
              {(
                [
                  ["nombre_grupo", "Grupo"],
                  ["invitado_principal", "Invitado principal"],
                  ["personas", "Personas"],
                  ["estado", "Estado"],
                  ["mesa", "Mesa"],
                ] as Array<[ColumnaOrden, string]>
              ).map(([clave, header]) => (
                <th
                  key={clave}
                  className="px-4 py-3 font-body text-xs uppercase tracking-wider text-ink-muted"
                >
                  <button
                    onClick={() => cambiarOrden(clave)}
                    className="transition-colors hover:text-olive-700"
                  >
                    {header}
                    {flecha(clave)}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-body text-xs uppercase tracking-wider text-ink-muted">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pistachio-100">
            {visibles.map((g, i) => {
              const confirmadas = personasConfirmadas(g);
              const categoria = ETIQUETAS_CATEGORIA[g.categoria] ?? g.categoria;
              return (
                <motion.tr
                  key={g.id}
                  className="transition-colors hover:bg-pistachio-50/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-olive-900">{g.nombre_grupo}</p>
                    <p className="text-xs text-ink-muted">{categoria}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-light">{g.invitado_principal}</td>
                  <td className="px-4 py-3 text-ink-light">
                    {confirmadas} / {g.limite_personas}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${BADGES_ESTADO[g.estado]}`}
                    >
                      {ETIQUETAS_ESTADO[g.estado]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-light">{nombreMesa(g)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                      <a
                        href={enlaceWhatsApp(g)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink-muted transition-colors hover:text-olive-700 hover:underline"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => void copiarEnlace(g)}
                        className="text-ink-muted transition-colors hover:text-olive-700 hover:underline"
                      >
                        {copiadoId === g.id ? "¡Copiado!" : "Enlace"}
                      </button>
                      <button
                        onClick={() => onDetalle(g)}
                        className="text-pistachio-600 transition-colors hover:underline"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => onEditar(g)}
                        className="text-pistachio-600 transition-colors hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onEliminar(g)}
                        className="text-champagne-300 transition-colors hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted/50">
                  No hay grupos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {ordenados.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 font-body text-sm text-ink-muted">
          <p>
            Mostrando {inicio + 1}–{inicio + visibles.length} de {ordenados.length} grupos
          </p>
          <div className="flex items-center gap-3">
            <select
              value={porPagina}
              onChange={(e) => {
                setPorPagina(Number(e.target.value) as (typeof OPCIONES_POR_PAGINA)[number]);
                setPagina(1);
              }}
              className="rounded-lg border border-pistachio-200 bg-white px-3 py-1.5 text-sm text-ink focus:border-olive focus:outline-none"
              aria-label="Filas por página"
            >
              {OPCIONES_POR_PAGINA.map((n) => (
                <option key={n} value={n}>
                  {n} / página
                </option>
              ))}
            </select>
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura <= 1}
              className="rounded-lg border border-pistachio-200 px-3 py-1.5 text-ink transition-colors hover:border-pistachio-400 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs">
              Página {paginaSegura} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura >= totalPaginas}
              className="rounded-lg border border-pistachio-200 px-3 py-1.5 text-ink transition-colors hover:border-pistachio-400 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}