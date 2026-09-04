import { describe, expect, it } from "vitest";
import { diffFechas, fechaLocalIso } from "@/lib/fechas";

describe("diffFechas", () => {
  it("devuelve haPasado=false y cuentas correctas para una fecha futura", () => {
    const objetivo = new Date("2026-11-14T18:00:00-04:00");
    const ahora = new Date("2026-09-04T12:00:00-04:00").getTime();
    const r = diffFechas(objetivo, ahora);
    expect(r.haPasado).toBe(false);
    expect(r.dias).toBe(71);
    expect(r.horas).toBe(6);
    expect(r.minutos).toBe(0);
    expect(r.segundos).toBe(0);
  });

  it("devuelve haPasado=true y ceros para una fecha pasada", () => {
    const objetivo = new Date("2026-01-01T00:00:00Z");
    const r = diffFechas(objetivo);
    expect(r.haPasado).toBe(true);
    expect(r.dias).toBe(0);
    expect(r.horas).toBe(0);
    expect(r.minutos).toBe(0);
    expect(r.segundos).toBe(0);
  });
});

describe("fechaLocalIso", () => {
  it("convierte un timestamptz a fecha en hora local", () => {
    const d = new Date("2026-11-14T22:30:00Z");
    const local = fechaLocalIso(d.toISOString());
    const esperado = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
    expect(local).toBe(esperado);
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});