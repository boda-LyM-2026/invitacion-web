import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { WaxSeal } from "@/components/shared/WaxSeal";

export default function LoginPage() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(await signIn(email, password));
    setEnviando(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-leaf-fade" />

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="card-surface p-8">
          <WaxSeal size={56} className="mx-auto mb-6" />

          <h1 className="text-center font-display text-2xl font-light italic text-olive-900">
            Panel de Lenan &amp; Mauricio
          </h1>
          <p className="mt-2 text-center font-body text-xs uppercase tracking-widest2 text-ink-muted">
            Acceso solo para los novios y organizadores
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Correo
              </label>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-ink-muted">
                Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-pistachio-200 bg-alabaster px-4 py-3 font-body text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all duration-300"
              />
            </div>
          </div>

          {error && (
            <motion.p
              className="mt-4 text-center font-body text-sm text-champagne-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={enviando}
            className="mt-8 w-full rounded-xl bg-olive py-3 font-body text-sm uppercase tracking-[0.18em] text-alabaster shadow-soft transition-all duration-500 hover:bg-olive-500 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {enviando ? "Ingresando..." : "Ingresar"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
