import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { KpiResumen } from "@/types/domain";

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
 * RF-09: KPIs en tiempo real. En Supabase, `kpi_resumen` es una vista
 * (ver supabase/schema.sql) para evitar traer todas las filas al cliente
 * y calcular agregados en el navegador.
 */
export function useKpis() {
  const [kpis, setKpis] = useState<KpiResumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setKpis(KPI_DEMO);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("kpi_resumen").select("*").maybeSingle();
      setKpis((data as KpiResumen) ?? KPI_DEMO);
      setLoading(false);
    }
    void load();

    if (!isSupabaseConfigured) return;

    // Tiempo real: cualquier cambio en grupos_invitacion refresca los KPIs.
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

  return { kpis, loading };
}
