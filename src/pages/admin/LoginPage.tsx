import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { WaxSeal } from "@/components/shared/WaxSeal";
import { ParticleField } from "@/components/shared/ParticleField";

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
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)",
        }}
      />
      <div className="absolute inset-0 bg-olive-vignette" />

      {/* Particles */}
      <ParticleField count={25} color="rgba(231,219,203,0.3)" />

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass-card p-8">
          <WaxSeal size={56} className="mx-auto mb-6" />

          <h1 className="text-center font-display text-2xl font-light italic text-alabaster">
            Panel de Lenan &amp; Mauricio
          </h1>
          <p className="mt-2 text-center font-body text-xs uppercase tracking-widest2 text-alabaster/50">
            Acceso solo para los novios y organizadores
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-alabaster/50">
                Correo
              </label>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-alabaster/20 bg-alabaster/10 px-4 py-3 font-body text-sm text-alabaster placeholder:text-alabaster/30 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/30 transition-all duration-300"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-widest2 text-alabaster/50">
                Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-alabaster/20 bg-alabaster/10 px-4 py-3 font-body text-sm text-alabaster placeholder:text-alabaster/30 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/30 transition-all duration-300"
              />
            </div>
          </div>

          {error && (
            <motion.p
              className="mt-4 text-center font-body text-sm text-champagne"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={enviando}
            className="mt-8 w-full rounded-xl bg-olive py-3 font-body text-sm uppercase tracking-[0.18em] text-alabaster shadow-glow-olive transition-all duration-500 hover:bg-olive-500 hover:shadow-glow-olive disabled:opacity-50"
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
