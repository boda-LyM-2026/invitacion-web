import type { Mesa } from "@/types/domain";

/**
 * Croquis del salón. Mantener sincronizado con el seed de `mesas` en
 * supabase/schema.sql (11 mesas). La asignación real de cada invitado
 * viene de la base; esta lista solo dibuja el plano.
 */
export const MESAS_REFERENCIA: Array<Pick<Mesa, "numero" | "pos_x" | "pos_y">> = [
  { numero: 1, pos_x: 15, pos_y: 20 },
  { numero: 2, pos_x: 38, pos_y: 15 },
  { numero: 3, pos_x: 62, pos_y: 15 },
  { numero: 4, pos_x: 85, pos_y: 20 },
  { numero: 5, pos_x: 15, pos_y: 50 },
  { numero: 6, pos_x: 38, pos_y: 50 },
  { numero: 7, pos_x: 62, pos_y: 50 },
  { numero: 8, pos_x: 85, pos_y: 50 },
  { numero: 9, pos_x: 25, pos_y: 80 },
  { numero: 10, pos_x: 50, pos_y: 80 },
  { numero: 11, pos_x: 75, pos_y: 80 },
];