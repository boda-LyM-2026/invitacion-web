import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MESAS_REFERENCIA } from "@/data/mesas";
import type { Mesa } from "@/types/domain";

export interface NuevaMesaInput {
  numero: number;
  nombre: string | null;
  capacidad: number;
  pos_x: number;
  pos_y: number;
}

export interface OcupacionMesa {
  grupos: number;
  personas: number;
}

/**
 * RF-12b: CRUD de mesas del salón. Las mesas se usan para el croquis
 * del invitado y la asignación en el panel. Protegido por las políticas
 * RLS `admin_write_mesas` (solo usuarios en admin_profiles).
 */
export function useMesasAdmin() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [ocupacion, setOcupacion] = useState<Record<string, OcupacionMesa>>({});
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setMesas(
        MESAS_REFERENCIA.map((m) => ({
          id: String(m.numero),
          numero: m.numero,
          nombre: `Mesa ${m.numero}`,
          capacidad: 8,
          pos_x: m.pos_x,
          pos_y: m.pos_y,
        })),
      );
      setOcupacion({});
      setLoading(false);
      return;
    }
    const [{ data: mesasData }, { data: gruposData }] = await Promise.all([
      supabase.from("mesas").select("*").order("numero", { ascending: true }),
      supabase.from("grupos_invitacion").select("mesa_id, limite_personas"),
    ]);
    setMesas((mesasData as Mesa[]) ?? []);

    const ocup: Record<string, OcupacionMesa> = {};
    for (const g of (gruposData as Array<{ mesa_id: string | null; limite_personas: number }>) ?? []) {
      if (!g.mesa_id) continue;
      ocup[g.mesa_id] ??= { grupos: 0, personas: 0 };
      ocup[g.mesa_id].grupos += 1;
      ocup[g.mesa_id].personas += g.limite_personas;
    }
    setOcupacion(ocup);
    setLoading(false);
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function crear(input: NuevaMesaInput): Promise<string | null> {
    if (!isSupabaseConfigured) return "Modo demo: no se pueden crear mesas.";
    const { error } = await supabase.from("mesas").insert(input);
    if (!error) await cargar();
    return error ? "No se pudo crear la mesa." : null;
  }

  async function actualizar(id: string, cambios: Partial<NuevaMesaInput>): Promise<string | null> {
    if (!isSupabaseConfigured) return "Modo demo: no se pueden editar mesas.";
    const { error } = await supabase.from("mesas").update(cambios).eq("id", id);
    if (!error) await cargar();
    return error ? "No se pudo actualizar la mesa." : null;
  }

  async function eliminar(id: string): Promise<string | null> {
    if (!isSupabaseConfigured) return "Modo demo: no se puede eliminar.";
    const { error } = await supabase.from("mesas").delete().eq("id", id);
    if (!error) await cargar();
    return error ? "No se pudo eliminar la mesa." : null;
  }

  return { mesas, ocupacion, loading, crear, actualizar, eliminar, refetch: cargar };
}