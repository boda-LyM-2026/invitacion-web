import { BrowserRouter, Route, Routes } from "react-router-dom";

import InvitationPage from "@/pages/InvitationPage";
import NotFoundPage from "@/pages/NotFoundPage";

import LoginPage from "@/pages/admin/LoginPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import GuestsPage from "@/pages/admin/GuestsPage";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
