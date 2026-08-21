import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_GRUPOS } from "@/data/mockInvitados";
import type { GrupoInvitacion } from "@/types/domain";

interface UseGrupoInvitacionResult {
  grupo: GrupoInvitacion | null;
  loading: boolean;
  error: string | null;
  /** Vuelve a pedir el grupo, útil tras enviar el RSVP para reflejar el nuevo estado. */
  refetch: () => Promise<void>;
}

/**
 * RF-02: resuelve la información del invitado a partir de su access_token.
 * La consulta pide únicamente las columnas necesarias y hace join a
 * acompanantes/mesas en una sola ida y vuelta (ver índice en access_token,
 * supabase/schema.sql) para mantenerse dentro del presupuesto de 1.5s.
 */
export function useGrupoInvitacion(accessToken: string | undefined): UseGrupoInvitacionResult {
  const [grupo, setGrupo] = useState<GrupoInvitacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrupo = useCallback(async () => {
    if (!accessToken) {
      setError("Enlace de invitación inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Modo demo: usa los datos de ejemplo para poder revisar el diseño sin backend.
      const mock = MOCK_GRUPOS[accessToken];
      setGrupo(mock ?? null);
      if (!mock) setError("No encontramos una invitación con ese enlace.");
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("grupos_invitacion")
      .select(
        `
        id, access_token, nombre_grupo, invitado_principal, limite_personas,
        categoria, importancia, estado, mesa_id, mensaje_rsvp, respondido_en, creado_en,
        acompanantes ( id, grupo_id, nombre_completo, es_nino, confirmado ),
        mesa:mesas ( id, numero, nombre, capacidad, pos_x, pos_y )
      `,
      )
      .eq("access_token", accessToken)
      .maybeSingle();

    if (queryError) {
      setError("No pudimos cargar tu invitación. Intenta de nuevo en unos segundos.");
      setGrupo(null);
    } else if (!data) {
      setError("No encontramos una invitación con ese enlace.");
      setGrupo(null);
    } else {
      setGrupo(data as unknown as GrupoInvitacion);
    }

    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    void fetchGrupo();
  }, [fetchGrupo]);

  return { grupo, loading, error, refetch: fetchGrupo };
}
