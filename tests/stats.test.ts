import { describe, expect, it } from "vitest";
import { buildSerieTiempo } from "@/lib/stats";
import type { GrupoInvitacion } from "@/types/domain";

function grupo(id: string, estado: GrupoInvitacion["estado"], respondidoEn?: string): GrupoInvitacion {
  return {
    id,
    access_token: `${"00000000-0000-4000-8000-" + "000000000000"}`.replace("000000000000", "00000000000a"),
    nombre_grupo: `Grupo ${id}`,
    invitado_principal: `Invitado ${id}`,
    categoria: "amigos_novia",
    importancia: "estandar",
    estado,
    mesa_numero: null,
    respondido_en: respondidoEn ?? null,
  } as GrupoInvitacion;
}

describe("buildSerieTiempo", () => {
  it("agrupa confirmaciones por día local de forma acumulada", () => {
    const ayerIso = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const hoyIso = new Date().toISOString();

    const serie = buildSerieTiempo([
      grupo("1", "confirmed", ayerIso),
      grupo("2", "confirmed", hoyIso),
      grupo("3", "confirmed", hoyIso),
      grupo("4", "pending"),
      grupo("5", "declined", ayerIso),
    ]);

    expect(serie).toHaveLength(2);
    expect(serie[0].acumulado).toBe(1);
    expect(serie[1].acumulado).toBe(3);
    expect(serie.length).toBe(2);
  });

  it("ignora grupos sin respondido_en", () => {
    const serie = buildSerieTiempo([grupo("1", "confirmed"), grupo("2", "pending")]);
    expect(serie).toHaveLength(0);
  });
});