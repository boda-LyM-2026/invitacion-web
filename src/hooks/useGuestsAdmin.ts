import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_GRUPOS } from "@/data/mockInvitados";
import type {
  GrupoInvitacion,
  CategoriaInvitado,
  EstadoInvitacion,
  NivelImportancia,
} from "@/types/domain";

export interface NuevoGrupoInput {
  nombre_grupo: string;
  invitado_principal: string;
  limite_personas: number;
  categoria: CategoriaInvitado;
  importancia: NivelImportancia;
  mesa_id: string | null;
  estado: EstadoInvitacion;
}

export type FilaImportacion = Pick<
  NuevoGrupoInput,
  "nombre_grupo" | "invitado_principal" | "limite_personas" | "categoria" | "importancia"
>;

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
      setGrupos((prev) => [
        {
          id: crypto.randomUUID(),
          access_token: crypto.randomUUID(),
          ...input,
          estado: input.estado ?? "pending",
          mensaje_rsvp: null,
          respondido_en: null,
          creado_en: new Date().toISOString(),
          acompanantes: [],
          mesa: null,
        },
        ...prev,
      ]);
      return null;
    }
    const { error } = await supabase.from("grupos_invitacion").insert({
      ...input,
      access_token: crypto.randomUUID(),
    });
    if (!error) await cargar();
    return error ? "No se pudo crear el grupo." : null;
  }

  async function actualizar(id: string, cambios: Partial<NuevoGrupoInput>): Promise<string | null> {
    if (!isSupabaseConfigured) {
      setGrupos((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...cambios, estado: cambios.estado ?? g.estado } : g)),
      );
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

  /** Alta masiva (importación CSV/Excel): crea tantos grupos como filas. */
  async function crearLote(filas: FilaImportacion[]): Promise<{ ok: number; error: string | null }> {
    if (!isSupabaseConfigured) {
      for (const fila of filas) {
        await crear({ ...fila, mesa_id: null, estado: "pending" });
      }
      return { ok: filas.length, error: null };
    }

    const registros = filas.map((fila) => ({
      ...fila,
      access_token: crypto.randomUUID(),
      estado: "pending" as EstadoInvitacion,
      mesa_id: null,
    }));

    const { error } = await supabase.from("grupos_invitacion").insert(registros);
    if (!error) await cargar();
    return { ok: error ? 0 : filas.length, error: error ? "No se pudieron crear los grupos." : null };
  }

  return { grupos, loading, crear, actualizar, eliminar, crearLote, refetch: cargar };
}