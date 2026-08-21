import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

/**
 * RF-08: autenticación de los novios/organizadores vía Supabase Auth
 * (email + password, con RLS que restringe las tablas administrativas a
 * usuarios autenticados — ver policies "admin_*" en supabase/schema.sql).
 */
export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!isSupabaseConfigured) return "Configura Supabase antes de iniciar sesión.";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? "Correo o contraseña incorrectos." : null;
  }

  async function signOut(): Promise<void> {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  return { session, loading, signIn, signOut };
}
