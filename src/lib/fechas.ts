export interface CuentaRegresiva {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  haPasado: boolean;
}

export function diffFechas(target: Date, ahora: number = Date.now()): CuentaRegresiva {
  const ms = target.getTime() - ahora;
  if (ms <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, haPasado: true };
  }
  const segundosTotales = Math.floor(ms / 1000);
  return {
    dias: Math.floor(segundosTotales / 86400),
    horas: Math.floor((segundosTotales % 86400) / 3600),
    minutos: Math.floor((segundosTotales % 3600) / 60),
    segundos: segundosTotales % 60,
    haPasado: false,
  };
}

/** Convierte un ISO (timestamptz) a fecha local YYYY-MM-DD. */
export function fechaLocalIso(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}