import { fechaLocalIso } from "@/lib/fechas";
import { ETIQUETAS_CATEGORIA } from "@/config/catalogos";
import type { KpiGraficos, GrupoInvitacion, CategoriaInvitado } from "@/types/domain";

interface PuntoSerie {
  fecha: string;
  acumulado: number;
}

/** Serie acumulada de confirmaciones por día, en fecha LOCAL. */
export function buildSerieTiempo(grupos: GrupoInvitacion[]): PuntoSerie[] {
  const confirmados = grupos
    .filter((g) => g.estado === "confirmed" && g.respondido_en)
    .map((g) => g.respondido_en as string)
    .sort((a, b) => a.localeCompare(b));

  const porDia = new Map<string, number>();
  confirmados.forEach((iso) => {
    const dia = fechaLocalIso(iso);
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  });

  let acumulado = 0;
  return Array.from(porDia.entries()).map(([fecha, cantidad]) => {
    acumulado += cantidad;
    return { fecha, acumulado };
  });
}

/**
 * Agregados de gráficos desde los grupos en memoria. SOLO para el modo demo
 * sin Supabase: en producción el panel los obtiene del RPC `kpi_graficos`.
 */
export function buildChartsDesdeGrupos(grupos: GrupoInvitacion[]): KpiGraficos {
  const porCategoria = (Object.keys(ETIQUETAS_CATEGORIA) as CategoriaInvitado[]).map(
    (categoria) => ({
      categoria,
      grupos: grupos.filter((g) => g.categoria === categoria).length,
    }),
  );

  const conteoEstado = (estado: GrupoInvitacion["estado"]) =>
    grupos.filter((g) => g.estado === estado).length;

  return {
    por_categoria: porCategoria,
    por_estado: [
      { estado: "confirmed", grupos: conteoEstado("confirmed") },
      { estado: "pending", grupos: conteoEstado("pending") },
      { estado: "declined", grupos: conteoEstado("declined") },
    ],
    serie_tiempo: buildSerieTiempo(grupos),
  };
}