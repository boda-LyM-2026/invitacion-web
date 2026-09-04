import { fechaLocalIso } from "@/lib/fechas";
import type { GrupoInvitacion } from "@/types/domain";

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