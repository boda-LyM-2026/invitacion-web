import type { GrupoInvitacion } from "@/types/domain";

/**
 * Datos de ejemplo, solo para desarrollo/preview sin conexión a Supabase.
 * Prueba las 3 rutas en el navegador:
 *   /invitacion/demo-pendiente
 *   /invitacion/demo-confirmado
 *   /invitacion/demo-rechazado
 */
export const MOCK_GRUPOS: Record<string, GrupoInvitacion> = {
  "demo-pendiente": {
    id: "1",
    access_token: "demo-pendiente",
    nombre_grupo: "Familia Rojas",
    invitado_principal: "Camila Rojas",
    limite_personas: 3,
    categoria: "familia_novia",
    importancia: "principal",
    estado: "pending",
    mesa_id: null,
    mensaje_rsvp: null,
    respondido_en: null,
    creado_en: "2026-06-01T10:00:00-04:00",
    acompanantes: [],
    mesa: null,
  },
  "demo-confirmado": {
    id: "2",
    access_token: "demo-confirmado",
    nombre_grupo: "Familia Rojas",
    invitado_principal: "Camila Rojas",
    limite_personas: 3,
    categoria: "familia_novia",
    importancia: "principal",
    estado: "confirmed",
    mesa_id: "m4",
    mensaje_rsvp: "¡No nos lo perdemos por nada del mundo!",
    respondido_en: "2026-06-05T18:30:00-04:00",
    creado_en: "2026-06-01T10:00:00-04:00",
    acompanantes: [
      { id: "a1", grupo_id: "2", nombre_completo: "Jorge Rojas", es_nino: false, confirmado: true },
      { id: "a2", grupo_id: "2", nombre_completo: "Valentina Rojas", es_nino: true, confirmado: true },
    ],
    mesa: { id: "m4", numero: 4, nombre: "Mesa Olivo", capacidad: 8, pos_x: 60, pos_y: 30 },
  },
  "demo-rechazado": {
    id: "3",
    access_token: "demo-rechazado",
    nombre_grupo: "Familia Herrera",
    invitado_principal: "Daniel Herrera",
    limite_personas: 2,
    categoria: "amigos_novio",
    importancia: "estandar",
    estado: "declined",
    mesa_id: null,
    mensaje_rsvp: "Estaremos con ustedes en pensamiento, muchas felicidades.",
    respondido_en: "2026-06-03T09:15:00-04:00",
    creado_en: "2026-06-01T10:00:00-04:00",
    acompanantes: [],
    mesa: null,
  },
};
