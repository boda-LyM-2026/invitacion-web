import { NavLink, Navigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { WaxSeal } from "@/components/shared/WaxSeal";

const LINKS = [
  { to: "/admin", label: "Resumen", end: true },
  { to: "/admin/invitados", label: "Invitados", end: false },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alabaster">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <WaxSeal size={48} />
        </motion.div>
      </div>
    );
  }

  if (!session && isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Header */}
      <header className="border-b border-pistachio-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <WaxSeal size={36} animated={false} />
            <div>
              <p className="font-display text-lg font-light italic text-olive-900">
                Lenan &amp; Mauricio
              </p>
              <p className="font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Panel administrativo
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-olive-900"
                      : "text-ink-muted hover:text-olive-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-px bg-olive"
                        layoutId="admin-nav"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
            <motion.button
              onClick={() => void signOut()}
              className="font-body text-sm text-ink-muted transition-colors hover:text-champagne-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Salir
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
