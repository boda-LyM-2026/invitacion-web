import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { esUuid } from "@/lib/validacion";
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

    // Los tokens reales son UUIDv4. Validar evita enviar "foo" al RPC
    // (el tipo uuid de Postgres respondería con un 400).
    if (!esUuid(accessToken)) {
      setError("Enlace de invitación inválido.");
      setGrupo(null);
      setLoading(false);
      return;
    }

    // Lectura pública SOLO vía RPC security-definer (ver supabase/schema.sql):
    // localiza el grupo por access_token exacto y devuelve acompañantes + mesa.
    const { data, error: queryError } = await supabase.rpc("obtener_grupo", {
      p_access_token: accessToken,
    });

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
