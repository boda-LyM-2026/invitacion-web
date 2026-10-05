import { Fragment, useMemo, useState } from "react";
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
  const destinatario = g.nombre_grupo || g.invitado_principal;
  const texto = `Hola ${destinatario}, te invitamos a la boda de ${NOMBRE_NOVIOS}. Confirma tu asistencia aquí: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

function nombreMesa(g: GrupoInvitacion): string {
  if (g.mesa?.nombre) return g.mesa.nombre;
  if (g.mesa?.numero) return `Mesa ${g.mesa.numero}`;
  return "—";
}

/** Silueta de personas: indica que el grupo tiene invitados registrados. */
function IconoPersonas({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function GuestsTable({ grupos, onEditar, onEliminar, onDetalle }: GuestsTableProps) {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [columna, setColumna] = useState<ColumnaOrden>("nombre_grupo");
  const [dir, setDir] = useState<Direccion>("asc");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState<(typeof OPCIONES_POR_PAGINA)[number]>(10);
  /** Grupos desplegados para ver quién asiste realmente. */
  const [abiertos, setAbiertos] = useState<Set<string>>(new Set());

  function alternarDetalle(id: string) {
    setAbiertos((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  function desplegarTodos() {
    const idsVisibles = visibles.map((g) => g.id);
    const todosAbiertos = idsVisibles.every((id) => abiertos.has(id));
    setAbiertos((prev) => {
      const siguiente = new Set(prev);
      for (const id of idsVisibles) {
        if (todosAbiertos) siguiente.delete(id);
        else siguiente.add(id);
      }
      return siguiente;
    });
  }

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-body text-xs text-ink-muted">
          Haz clic en un grupo para ver quién viene. El icono de personas marca los que tienen
          acompañantes registrados.
        </p>
        <button
          onClick={desplegarTodos}
          disabled={visibles.length === 0}
          className="rounded-lg border border-pistachio-200 px-3 py-1.5 font-body text-xs text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900 disabled:opacity-40"
        >
          {visibles.every((g) => abiertos.has(g.id)) ? "Contraer todo" : "Desplegar todo"}
        </button>
      </div>

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
              const abierto = abiertos.has(g.id);
              return (
                <Fragment key={g.id}>
                  <motion.tr
                    className="cursor-pointer transition-colors hover:bg-pistachio-50/50"
                    onClick={() => alternarDetalle(g.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        alternarDetalle(g.id);
                      }
                    }}
                    tabIndex={0}
                    aria-expanded={abierto}
                    aria-label={`${g.nombre_grupo}. Ver invitados`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        {g.acompanantes.length > 0 && (
                          <span
                            className="mt-0.5 shrink-0 text-ink-muted"
                            title={`${g.acompanantes.length} acompañante${
                              g.acompanantes.length === 1 ? "" : "s"
                            }`}
                          >
                            <IconoPersonas className="h-4 w-4" />
                          </span>
                        )}
                        <div>
                          <p className="font-medium text-olive-900">{g.nombre_grupo}</p>
                          <p className="text-xs text-ink-muted">{categoria}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-light">
                      {g.invitado_principal}
                      {g.acompanantes.length > 0 && (
                        <span className="mt-0.5 block text-xs text-ink-muted">
                          + {g.acompanantes.length} acompañante
                          {g.acompanantes.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </td>
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
                      {/* onClick propio: los clicks en acciones no despliegan la fila. */}
                      <div
                        className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1"
                        onClick={(e) => e.stopPropagation()}
                      >
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

                  {abierto && (
                    <tr className="bg-alabaster/60">
                      <td colSpan={6} className="px-4 py-3">
                        <ul className="space-y-1.5">
                          <li className="flex items-center justify-between gap-3 font-body text-sm">
                            <span className="text-ink">{g.invitado_principal}</span>
                            <span className="shrink-0 rounded-full bg-olive px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-alabaster">
                              Titular
                            </span>
                          </li>
                          {g.acompanantes.map((a) => (
                            <li
                              key={a.id}
                              className="flex items-center justify-between gap-3 font-body text-sm"
                            >
                              <span className="text-ink-light">{a.nombre_completo ?? "Sin nombre"}</span>
                              <span className="shrink-0 text-xs text-ink-muted">
                                Acompañante ·{" "}
                                {a.confirmado ? "confirmado" : "sin confirmar"}
                              </span>
                            </li>
                          ))}
                          {g.acompanantes.length === 0 && (
                            <li className="font-body text-xs text-ink-muted">
                              Sin acompañantes registrados: solo assiste el titular.
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
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