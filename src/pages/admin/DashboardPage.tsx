import { motion } from "framer-motion";
import { useKpis } from "@/hooks/useKpis";
import { useGuestsAdmin } from "@/hooks/useGuestsAdmin";
import { KpiCard } from "@/components/admin/KpiCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default function DashboardPage() {
  const { kpis, loading: kpisLoading } = useKpis();
  const { grupos, loading: gruposLoading } = useGuestsAdmin();

  if (kpisLoading || gruposLoading || !kpis) {
    return (
      <motion.p
        className="text-ink-muted"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Cargando KPIs...
      </motion.p>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-display text-3xl font-light italic text-olive-900">Resumen</h1>
        <p className="mt-1 font-body text-sm text-ink-muted">
          Estado actual de las confirmaciones, en tiempo real.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Grupos totales" value={kpis.total_grupos} />
        <KpiCard label="Personas esperadas" value={kpis.total_personas_esperadas} />
        <KpiCard label="Confirmados" value={kpis.confirmados_grupos} accent />
        <KpiCard label="Rechazados" value={kpis.rechazados_grupos} />
        <KpiCard label="Pendientes" value={kpis.pendientes_grupos} />
        <KpiCard label="Tasa confirmación" value={`${kpis.tasa_confirmacion.toFixed(1)}%`} accent />
      </div>

      <DashboardCharts grupos={grupos} />
    </div>
  );
}
