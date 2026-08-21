import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RsvpPayload } from "@/types/domain";

interface UseRsvpResult {
  submitRsvp: (accessToken: string, payload: RsvpPayload) => Promise<boolean>;
  submitting: boolean;
  error: string | null;
}

/**
 * RF-06/RF-07: envía la confirmación o rechazo. La escritura ocurre a través
 * de la función RPC `submit_rsvp` (ver supabase/schema.sql) para que la
 * validación de limite_personas y la escritura de acompanantes sea atómica
 * y quede protegida por RLS del lado del servidor, no solo del cliente.
 */
export function useRsvp(): UseRsvpResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitRsvp(accessToken: string, payload: RsvpPayload): Promise<boolean> {
    setSubmitting(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Modo demo: simula latencia de red y éxito, sin persistir nada.
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSubmitting(false);
      return true;
    }

    const { error: rpcError } = await supabase.rpc("submit_rsvp", {
      p_access_token: accessToken,
      p_estado: payload.estado,
      p_mensaje: payload.mensaje_rsvp,
      p_acompanantes: payload.acompanantes,
    });

    setSubmitting(false);

    if (rpcError) {
      setError("No pudimos guardar tu respuesta. Verifica tu conexión e inténtalo de nuevo.");
      return false;
    }

    return true;
  }

  return { submitRsvp, submitting, error };
}
