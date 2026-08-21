/**
 * Tipos de dominio, alineados 1:1 con el esquema SQL en /supabase/schema.sql.
 * Mantener este archivo sincronizado con la base evita "any" en toda la app.
 */

export type EstadoInvitacion = "pending" | "confirmed" | "declined";

export type CategoriaInvitado =
  | "familia_novia"
  | "familia_novio"
  | "amigos_novia"
  | "amigos_novio"
  | "trabajo"
  | "otros";

export type NivelImportancia = "principal" | "estandar" | "cortesia";

export interface Mesa {
  id: string;
  numero: number;
  nombre: string | null;
  capacidad: number;
  pos_x: number;
  pos_y: number;
}

export interface Acompanante {
  id: string;
  grupo_id: string;
  nombre_completo: string | null;
  es_nino: boolean;
  confirmado: boolean | null;
}

export interface GrupoInvitacion {
  id: string;
  access_token: string;
  nombre_grupo: string;
  invitado_principal: string;
  limite_personas: number;
  categoria: CategoriaInvitado;
  importancia: NivelImportancia;
  estado: EstadoInvitacion;
  mesa_id: string | null;
  mensaje_rsvp: string | null;
  respondido_en: string | null;
  creado_en: string;
  acompanantes: Acompanante[];
  mesa?: Mesa | null;
}

export interface KpiResumen {
  total_grupos: number;
  total_personas_esperadas: number;
  confirmados_grupos: number;
  confirmados_personas: number;
  rechazados_grupos: number;
  pendientes_grupos: number;
  tasa_confirmacion: number;
  tasa_rechazo: number;
}

export interface RsvpPayload {
  estado: Extract<EstadoInvitacion, "confirmed" | "declined">;
  mensaje_rsvp: string | null;
  acompanantes: Array<{ id?: string; nombre_completo: string; es_nino: boolean }>;
}
