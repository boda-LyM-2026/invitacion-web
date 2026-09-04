import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { WaxSeal } from "@/components/shared/WaxSeal";
import NotFoundPage from "@/pages/NotFoundPage";

// Code-splitting por ruta: los invitados NO descargan el panel admin
// (recharts, xlsx/jsPDF), y el admin no carga la intro de la invitación.
const InvitationPage = lazy(() => import("@/pages/InvitationPage"));
const LoginPage = lazy(() => import("@/pages/admin/LoginPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const GuestsPage = lazy(() => import("@/pages/admin/GuestsPage"));

function RutaFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cinematic-dark">
      <WaxSeal size={48} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RutaFallback />}>
        <Routes>
          {/* RF-02: ruta pública que resuelve al invitado por su access_token */}
          <Route path="/invitacion/:token" element={<InvitationPage />} />

          {/* Panel administrativo (RF-08 a RF-12) */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="invitados" element={<GuestsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}