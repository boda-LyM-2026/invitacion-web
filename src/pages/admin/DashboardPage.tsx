import { useKpis } from "@/hooks/useKpis";
import { useGuestsAdmin } from "@/hooks/useGuestsAdmin";
import { KpiCard } from "@/components/admin/KpiCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default function DashboardPage() {
  const { kpis, loading: kpisLoading } = useKpis();
  const { grupos, loading: gruposLoading } = useGuestsAdmin();

  if (kpisLoading || gruposLoading || !kpis) {
    return <p className="text-neutral-400">Cargando KPIs...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-olive-900">Resumen</h1>
        <p className="text-sm text-neutral-500">Estado actual de las confirmaciones, en tiempo real.</p>
      </div>

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
