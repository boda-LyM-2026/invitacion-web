import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGrupoInvitacion } from "@/hooks/useGrupoInvitacion";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { Hero } from "@/components/shared/Hero";
import { Footer } from "@/components/shared/Footer";
import { WaxSeal } from "@/components/shared/WaxSeal";
import { FilmGrain } from "@/components/shared/FilmGrain";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { AudioPlayer } from "@/components/shared/AudioPlayer";

import { OurStory } from "@/components/scenarios/pending/OurStory";
import { FormalInvitation } from "@/components/scenarios/pending/FormalInvitation";
import { CodeOfConduct } from "@/components/scenarios/pending/CodeOfConduct";
import { RsvpForm } from "@/components/scenarios/pending/RsvpForm";

import { Countdown } from "@/components/scenarios/confirmed/Countdown";
import { LocationSection } from "@/components/scenarios/confirmed/LocationSection";
import { Timeline } from "@/components/scenarios/confirmed/Timeline";
import { TableAssignment } from "@/components/scenarios/confirmed/TableAssignment";
import { Recommendations } from "@/components/scenarios/confirmed/Recommendations";

import { ThankYouScreen } from "@/components/scenarios/declined/ThankYouScreen";

function EstadoCarga() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cinematic-dark">
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(130,134,97,0.2)",
            "0 0 40px rgba(130,134,97,0.4)",
            "0 0 20px rgba(130,134,97,0.2)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <WaxSeal size={56} />
      </motion.div>
      <motion.p
        className="eyebrow text-alabaster/60"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Abriendo tu invitación...
      </motion.p>
    </div>
  );
}

function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cinematic-dark px-6 text-center">
      <WaxSeal size={64} animated={false} />
      <p className="font-display text-3xl font-light italic text-alabaster">{mensaje}</p>
      <p className="font-body text-sm text-alabaster/50">
        Revisa el enlace que te compartieron los novios, o escríbeles directamente.
      </p>
    </div>
  );
}

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const { grupo, loading, error, refetch } = useGrupoInvitacion(token);
  const [introVisto, setIntroVisto] = useState(false);

  if (loading) return <EstadoCarga />;
  if (error || !grupo) return <EstadoError mensaje={error ?? "Invitación no encontrada"} />;

  // Intro cinemática solo para escenario "pending"
  if (grupo.estado === "pending" && !introVisto) {
    return <IntroSequence onFinished={() => setIntroVisto(true)} />;
  }

  if (grupo.estado === "declined") {
    return (
      <>
        <FilmGrain />
        <AudioPlayer />
        <AnimatePresence mode="wait">
          <motion.main
            key="declined"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ThankYouScreen nombreInvitado={grupo.invitado_principal} />
            <Footer />
          </motion.main>
        </AnimatePresence>
      </>
    );
  }

  if (grupo.estado === "confirmed") {
    return (
      <>
        <FilmGrain />
        <ScrollProgress />
        <AudioPlayer />
        <AnimatePresence mode="wait">
          <motion.main
            key="confirmed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Hero nombreInvitado={grupo.invitado_principal} />
            <Countdown />
            <LocationSection />
            <Timeline />
            <TableAssignment mesa={grupo.mesa} />
            <Recommendations />
            <Footer />
          </motion.main>
        </AnimatePresence>
      </>
    );
  }

  // Escenario A — pending
  return (
    <>
      <FilmGrain />
      <ScrollProgress />
      <AudioPlayer />
      <AnimatePresence mode="wait">
        <motion.main
          key="pending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Hero nombreInvitado={grupo.invitado_principal} />
          <OurStory />
          <FormalInvitation />
          <CodeOfConduct />
          <RsvpForm grupo={grupo} onSuccess={refetch} />
          <Footer />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
