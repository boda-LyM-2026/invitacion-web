import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGrupoInvitacion } from "@/hooks/useGrupoInvitacion";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { Hero } from "@/components/shared/Hero";
import { Footer } from "@/components/shared/Footer";
import { WaxSeal } from "@/components/shared/WaxSeal";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-alabaster">
      <WaxSeal size={48} className="animate-pulse" />
      <p className="eyebrow">Abriendo tu invitación...</p>
    </div>
  );
}

function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-alabaster px-6 text-center">
      <p className="font-display text-2xl italic text-olive-900">{mensaje}</p>
      <p className="font-body text-sm text-ink/60">
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

  // RF-06: la intro cinemática solo aplica al escenario "pending"; quienes ya
  // respondieron entran directo a su experiencia (confirmada o de agradecimiento).
  if (grupo.estado === "pending" && !introVisto) {
    return <IntroSequence onFinished={() => setIntroVisto(true)} />;
  }

  if (grupo.estado === "declined") {
    return (
      <main>
        <ThankYouScreen nombreInvitado={grupo.invitado_principal} />
        <Footer />
      </main>
    );
  }

  if (grupo.estado === "confirmed") {
    return (
      <main>
        <Hero nombreInvitado={grupo.invitado_principal} />
        <Countdown />
        <LocationSection />
        <Timeline />
        <TableAssignment mesa={grupo.mesa} />
        <Recommendations />
        <Footer />
      </main>
    );
  }

  // Escenario A — pending
  return (
    <main>
      <Hero nombreInvitado={grupo.invitado_principal} />
      <OurStory />
      <FormalInvitation />
      <CodeOfConduct />
      <RsvpForm grupo={grupo} onSuccess={refetch} />
      <Footer />
    </main>
  );
}
