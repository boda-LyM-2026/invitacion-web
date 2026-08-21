import { useMemo, useState } from "react";
import { useGuestsAdmin } from "@/hooks/useGuestsAdmin";
import { GuestsTable } from "@/components/admin/GuestsTable";
import { GuestFormModal } from "@/components/admin/GuestFormModal";
import { exportarCsv, exportarExcel, exportarPdf } from "@/lib/exportUtils";
import type { CategoriaInvitado, EstadoInvitacion, GrupoInvitacion } from "@/types/domain";

const CATEGORIAS: Array<CategoriaInvitado | "todas"> = [
  "todas",
  "familia_novia",
  "familia_novio",
  "amigos_novia",
  "amigos_novio",
  "trabajo",
  "otros",
];

const ESTADOS: Array<EstadoInvitacion | "todos"> = ["todos", "pending", "confirmed", "declined"];

export default function GuestsPage() {
  const { grupos, loading, crear, actualizar, eliminar } = useGuestsAdmin();
  const [categoria, setCategoria] = useState<CategoriaInvitado | "todas">("todas");
  const [estado, setEstado] = useState<EstadoInvitacion | "todos">("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoInvitacion | null>(null);

  const filtrados = useMemo(() => {
    return grupos.filter((g) => {
      const okCategoria = categoria === "todas" || g.categoria === categoria;
      const okEstado = estado === "todos" || g.estado === estado;
      return okCategoria && okEstado;
    });
  }, [grupos, categoria, estado]);

  async function handleGuardar(input: Parameters<typeof crear>[0]) {
    if (grupoEditando) {
      await actualizar(grupoEditando.id, input);
    } else {
      await crear(input);
    }
    setModalAbierto(false);
    setGrupoEditando(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-olive-900">Invitados</h1>
          <p className="text-sm text-neutral-500">{filtrados.length} grupos mostrados de {grupos.length}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportarExcel(filtrados)} className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100">
            Excel
          </button>
          <button onClick={() => exportarCsv(filtrados)} className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100">
            CSV
          </button>
          <button onClick={() => exportarPdf(filtrados)} className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:bg-neutral-100">
            PDF
          </button>
          <button
            onClick={() => {
              setGrupoEditando(null);
              setModalAbierto(true);
            }}
            className="rounded-lg bg-olive px-4 py-2 text-xs font-medium text-white hover:bg-olive-900"
          >
            + Nuevo grupo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as typeof categoria)} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c === "todas" ? "Todas las categorías" : c.replace("_", " ")}
            </option>
          ))}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value as typeof estado)} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e === "todos" ? "Todos los estados" : e}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-neutral-400">Cargando invitados...</p>
      ) : (
        <GuestsTable
          grupos={filtrados}
          onEditar={(g) => {
            setGrupoEditando(g);
            setModalAbierto(true);
          }}
          onEliminar={(g) => {
            if (confirm(`¿Eliminar el grupo "${g.nombre_grupo}"?`)) void eliminar(g.id);
          }}
        />
      )}

      {modalAbierto && (
        <GuestFormModal
          grupoInicial={grupoEditando}
          onCancelar={() => setModalAbierto(false)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}
