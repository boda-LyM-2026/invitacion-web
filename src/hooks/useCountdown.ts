import { useEffect, useState } from "react";

interface Countdown {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  haPasado: boolean;
}

function diff(target: Date): Countdown {
  const ms = target.getTime() - Date.now();
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

export function useCountdown(targetIso: string): Countdown {
  const [value, setValue] = useState<Countdown>(() => diff(new Date(targetIso)));

  useEffect(() => {
    const target = new Date(targetIso);
    const id = window.setInterval(() => setValue(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return value;
}
