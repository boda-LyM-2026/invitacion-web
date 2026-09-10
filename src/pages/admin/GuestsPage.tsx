import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestsAdmin, type NuevoGrupoInput } from "@/hooks/useGuestsAdmin";
import { useMesasAdmin } from "@/hooks/useMesasAdmin";
import { useToast } from "@/hooks/useToast";
import { GuestsTable } from "@/components/admin/GuestsTable";
import { GuestFormModal } from "@/components/admin/GuestFormModal";
import { GuestDetailModal } from "@/components/admin/GuestDetailModal";
import { ImportGuestsModal } from "@/components/admin/ImportGuestsModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CATEGORIAS, ESTADOS } from "@/config/catalogos";
import type { GrupoInvitacion } from "@/types/domain";

const OPCIONES_CATEGORIA = ["todas", ...CATEGORIAS] as const;
const OPCIONES_ESTADO = ["todos", ...ESTADOS] as const;

export default function GuestsPage() {
  const { grupos, loading, crear, actualizar, eliminar, crearLote } = useGuestsAdmin();
  const { mesas } = useMesasAdmin();
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<(typeof OPCIONES_CATEGORIA)[number]>("todas");
  const [estado, setEstado] = useState<(typeof OPCIONES_ESTADO)[number]>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoInvitacion | null>(null);
  const [grupoDetalle, setGrupoDetalle] = useState<GrupoInvitacion | null>(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState<GrupoInvitacion | null>(null);
  const [importandoAbierto, setImportandoAbierto] = useState(false);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return grupos.filter((g) => {
      const okCategoria = categoria === "todas" || g.categoria === categoria;
      const okEstado = estado === "todos" || g.estado === estado;
      const okBusqueda =
        !q ||
        g.nombre_grupo.toLowerCase().includes(q) ||
        g.invitado_principal.toLowerCase().includes(q);
      return okCategoria && okEstado && okBusqueda;
    });
  }, [grupos, busqueda, categoria, estado]);

  async function handleGuardar(input: NuevoGrupoInput) {
    if (grupoEditando) {
      const err = await actualizar(grupoEditando.id, input);
      toast(err ?? "Grupo actualizado.", err ? "error" : "success");
    } else {
      const err = await crear(input);
      toast(err ?? "Grupo creado.", err ? "error" : "success");
    }
  }

  async function handleEliminar() {
    if (!confirmandoEliminar) return;
    const err = await eliminar(confirmandoEliminar.id);
    toast(err ?? "Grupo eliminado.", err ? "error" : "success");
    setConfirmandoEliminar(null);
  }

  async function handleImportar(filas: Parameters<typeof crearLote>[0]) {
    const { ok, error } = await crearLote(filas);
    toast(error ?? `${ok} grupos importados.`, error ? "error" : "success");
    if (!error) setImportandoAbierto(false);
    return error;
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
    toast(`Exportados ${filtrados.length} grupos a ${tipo.toUpperCase()}.`, "success");
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
        <div className="flex flex-wrap gap-2">
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
            onClick={() => setImportandoAbierto(true)}
            className="rounded-lg border border-pistachio-200 px-4 py-2 font-body text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Importar
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

      {/* Search + filters */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <input
          type="search"
          placeholder="Buscar por grupo o invitado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-pistachio-200 bg-white px-4 py-2 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none"
        />
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
          onEliminar={(g) => setConfirmandoEliminar(g)}
          onDetalle={(g) => setGrupoDetalle(g)}
        />
      )}

      <AnimatePresence>
        {modalAbierto && (
          <GuestFormModal
            grupoInicial={grupoEditando}
            mesas={mesas}
            onCancelar={() => setModalAbierto(false)}
            onGuardar={async (input) => {
              await handleGuardar(input);
              setModalAbierto(false);
              setGrupoEditando(null);
            }}
          />
        )}

        {grupoDetalle && (
          <GuestDetailModal grupo={grupoDetalle} onCerrar={() => setGrupoDetalle(null)} />
        )}

        {importandoAbierto && (
          <ImportGuestsModal
            onImportar={handleImportar}
            onCerrar={() => setImportandoAbierto(false)}
          />
        )}

        {confirmandoEliminar && (
          <ConfirmDialog
            titulo="Eliminar grupo"
            mensaje={`¿Eliminar el grupo "${confirmandoEliminar.nombre_grupo}"? Se quitarán también sus acompañantes.`}
            confirmarLabel="Eliminar"
            onConfirmar={handleEliminar}
            onCancelar={() => setConfirmandoEliminar(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}