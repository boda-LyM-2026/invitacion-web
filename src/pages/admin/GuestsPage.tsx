import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGuestsAdmin } from "@/hooks/useGuestsAdmin";
import { GuestsTable } from "@/components/admin/GuestsTable";
import { GuestFormModal } from "@/components/admin/GuestFormModal";
import { CATEGORIAS, ESTADOS } from "@/config/catalogos";
import type { GrupoInvitacion } from "@/types/domain";

const OPCIONES_CATEGORIA = ["todas", ...CATEGORIAS] as const;
const OPCIONES_ESTADO = ["todos", ...ESTADOS] as const;

export default function GuestsPage() {
  const { grupos, loading, crear, actualizar, eliminar } = useGuestsAdmin();
  const [categoria, setCategoria] = useState<(typeof OPCIONES_CATEGORIA)[number]>("todas");
  const [estado, setEstado] = useState<(typeof OPCIONES_ESTADO)[number]>("todos");
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

  // xlsx/jsPDF (exportUtils) se cargan bajo demanda: no deben pesar
  // en el bundle mientras nadie exporta.
  async function exportar(tipo: "excel" | "csv" | "pdf") {
    const mod = await import("@/lib/exportUtils");
    const exportadores = {
      excel: mod.exportarExcel,
      csv: mod.exportarCsv,
      pdf: mod.exportarPdf,
    };
    exportadores[tipo](filtrados);
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="font-display text-3xl font-light italic text-olive-900">Invitados</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            {filtrados.length} grupos mostrados de {grupos.length}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => void exportar("excel")}
            className="rounded-lg border border-pistachio-200 px-4 py-2 font-body text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Excel
          </motion.button>
          <motion.button
            onClick={() => void exportar("csv")}
            className="rounded-lg border border-pistachio-200 px-4 py-2 font-body text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            CSV
          </motion.button>
          <motion.button
            onClick={() => void exportar("pdf")}
            className="rounded-lg border border-pistachio-200 px-4 py-2 font-body text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            PDF
          </motion.button>
          <motion.button
            onClick={() => {
              setGrupoEditando(null);
              setModalAbierto(true);
            }}
            className="rounded-lg bg-olive px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster shadow-soft transition-all hover:bg-olive-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Nuevo grupo
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as typeof categoria)}
          className="rounded-lg border border-pistachio-200 bg-white px-4 py-2 font-body text-sm text-ink focus:border-olive focus:outline-none"
        >
          {OPCIONES_CATEGORIA.map((c) => (
            <option key={c} value={c}>
              {c === "todas" ? "Todas las categorías" : c.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          className="rounded-lg border border-pistachio-200 bg-white px-4 py-2 font-body text-sm text-ink focus:border-olive focus:outline-none"
        >
          {OPCIONES_ESTADO.map((e) => (
            <option key={e} value={e}>
              {e === "todos" ? "Todos los estados" : e}
            </option>
          ))}
        </select>
      </motion.div>

      {loading ? (
        <motion.p
          className="text-ink-muted"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando invitados...
        </motion.p>
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
