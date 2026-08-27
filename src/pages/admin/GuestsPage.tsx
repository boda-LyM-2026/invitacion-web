import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h1 className="font-display text-3xl font-light italic text-alabaster">Invitados</h1>
          <p className="mt-1 font-body text-sm text-alabaster/50">
            {filtrados.length} grupos mostrados de {grupos.length}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => exportarExcel(filtrados)}
            className="rounded-lg border border-alabaster/20 px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster/70 transition-colors hover:border-alabaster/40 hover:text-alabaster"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Excel
          </motion.button>
          <motion.button
            onClick={() => exportarCsv(filtrados)}
            className="rounded-lg border border-alabaster/20 px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster/70 transition-colors hover:border-alabaster/40 hover:text-alabaster"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            CSV
          </motion.button>
          <motion.button
            onClick={() => exportarPdf(filtrados)}
            className="rounded-lg border border-alabaster/20 px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster/70 transition-colors hover:border-alabaster/40 hover:text-alabaster"
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
            className="rounded-lg bg-olive px-4 py-2 font-body text-xs uppercase tracking-wider text-alabaster shadow-glow-olive transition-all hover:bg-olive-500"
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
          className="rounded-lg border border-alabaster/20 bg-cinematic-dark px-4 py-2 font-body text-sm text-alabaster focus:border-olive focus:outline-none"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c === "todas" ? "Todas las categorías" : c.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          className="rounded-lg border border-alabaster/20 bg-cinematic-dark px-4 py-2 font-body text-sm text-alabaster focus:border-olive focus:outline-none"
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e === "todos" ? "Todos los estados" : e}
            </option>
          ))}
        </select>
      </motion.div>

      {loading ? (
        <motion.p
          className="text-alabaster/50"
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
