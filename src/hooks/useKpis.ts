import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_GRUPOS } from "@/data/mockInvitados";
import { buildChartsDesdeGrupos } from "@/lib/stats";
import type { KpiResumen, KpiGraficos } from "@/types/domain";

const KPI_DEMO: KpiResumen = {
  total_grupos: 86,
  total_personas_esperadas: 214,
  confirmados_grupos: 41,
  confirmados_personas: 103,
  rechazados_grupos: 12,
  pendientes_grupos: 33,
  tasa_confirmacion: 47.7,
  tasa_rechazo: 14,
};

/**
 * RF-09: KPIs en tiempo real. `kpi_resumen` es una vista del servidor
 * (supabase/schema.sql). Los agregados de los gráficos vienen del RPC
 * `kpi_graficos()` para no descargar todos los invitados al navegador.
 * En modo demo (sin Supabase) se derivan de MOCK_GRUPOS en el cliente.
 */
export function useKpis() {
  const [kpis, setKpis] = useState<KpiResumen | null>(null);
  const [charts, setCharts] = useState<KpiGraficos | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setKpis(KPI_DEMO);
        setCharts(buildChartsDesdeGrupos(Object.values(MOCK_GRUPOS)));
        setLoading(false);
        return;
      }
      const [{ data: kpi }, { data: graf }] = await Promise.all([
        supabase.from("kpi_resumen").select("*").maybeSingle(),
        supabase.rpc("kpi_graficos"),
      ]);
      setKpis((kpi as KpiResumen | null) ?? KPI_DEMO);
      setCharts((graf as KpiGraficos | null) ?? null);
      setLoading(false);
    }
    void load();

    if (!isSupabaseConfigured) return;

    // Tiempo real: cualquier cambio en grupos_invitacion (RSVP o alta
    // administrativa) refresca KPIs y gráficos.
    const channel = supabase
      .channel("kpi-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "grupos_invitacion" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return { kpis, charts, loading };
}