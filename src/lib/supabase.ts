import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // No lanzamos un error duro: en desarrollo local sin credenciales,
  // la app cae en /src/data/mockInvitados.ts para poder revisar el diseño.
  console.warn(
    "[supabase] Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no configuradas. " +
      "La app usará datos de ejemplo (ver src/data/mockInvitados.ts).",
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
