import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

const LINKS = [
  { to: "/admin", label: "Resumen", end: true },
  { to: "/admin/invitados", label: "Invitados", end: false },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-neutral-400">Cargando...</div>;
  }

  // En modo demo (sin Supabase configurado) se omite el guard para poder revisar el panel.
  if (!session && isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <p className="font-display text-lg text-olive-900">Lenan &amp; Mauricio</p>
          <p className="text-xs text-neutral-500">Panel administrativo</p>
        </div>
        <nav className="flex items-center gap-4">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-olive-900" : "text-neutral-500 hover:text-olive-700"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button onClick={() => void signOut()} className="text-sm text-neutral-500 hover:text-red-600">
            Salir
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
