import { useEffect, useState } from "react";
import { diffFechas, type CuentaRegresiva } from "@/lib/fechas";

export function useCountdown(targetIso: string): CuentaRegresiva {
  const [value, setValue] = useState<CuentaRegresiva>(() =>
    diffFechas(new Date(targetIso)),
  );

  useEffect(() => {
    const target = new Date(targetIso);
    const id = window.setInterval(() => setValue(diffFechas(target)), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  return value;
}