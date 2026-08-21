import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_GRUPOS } from "@/data/mockInvitados";
import type { GrupoInvitacion, CategoriaInvitado, NivelImportancia } from "@/types/domain";

export interface NuevoGrupoInput {
  nombre_grupo: string;
  invitado_principal: string;
  limite_personas: number;
  categoria: CategoriaInvitado;
  importancia: NivelImportancia;
}

/**
 * RF-12: CRUD completo de invitados desde el panel administrativo.
 * Crear/editar/eliminar quedan protegidos por las políticas RLS
 * "admin_write_grupos" (solo usuarios autenticados) definidas en el esquema.
 */
export function useGuestsAdmin() {
  const [grupos, setGrupos] = useState<GrupoInvitacion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setGrupos(Object.values(MOCK_GRUPOS));
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("grupos_invitacion")
      .select(
        "id, access_token, nombre_grupo, invitado_principal, limite_personas, categoria, importancia, estado, mesa_id, mensaje_rsvp, respondido_en, creado_en, acompanantes(*), mesa:mesas(*)",
      )
      .order("creado_en", { ascending: false });
    setGrupos((data as unknown as GrupoInvitacion[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function crear(input: NuevoGrupoInput): Promise<string | null> {
    if (!isSupabaseConfigured) {
      await cargar();
      return null;
    }
    const { error } = await supabase.from("grupos_invitacion").insert({
      ...input,
      access_token: crypto.randomUUID(),
      estado: "pending",
    });
    if (!error) await cargar();
    return error ? "No se pudo crear el grupo." : null;
  }

  async function actualizar(id: string, cambios: Partial<NuevoGrupoInput>): Promise<string | null> {
    if (!isSupabaseConfigured) {
      await cargar();
      return null;
    }
    const { error } = await supabase.from("grupos_invitacion").update(cambios).eq("id", id);
    if (!error) await cargar();
    return error ? "No se pudo actualizar el grupo." : null;
  }

  async function eliminar(id: string): Promise<string | null> {
    if (!isSupabaseConfigured) {
      setGrupos((prev) => prev.filter((g) => g.id !== id));
      return null;
    }
    const { error } = await supabase.from("grupos_invitacion").delete().eq("id", id);
    if (!error) await cargar();
    return error ? "No se pudo eliminar el grupo." : null;
  }

  return { grupos, loading, crear, actualizar, eliminar, refetch: cargar };
}
