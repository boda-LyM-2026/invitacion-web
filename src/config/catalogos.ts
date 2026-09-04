import type { GrupoInvitacion, CategoriaInvitado, NivelImportancia } from "@/types/domain";

export const CATEGORIAS: CategoriaInvitado[] = [
  "familia_novia",
  "familia_novio",
  "amigos_novia",
  "amigos_novio",
  "trabajo",
  "otros",
];

export const IMPORTANCIAS: NivelImportancia[] = ["principal", "estandar", "cortesia"];

export const ESTADOS: GrupoInvitacion["estado"][] = ["pending", "confirmed", "declined"];

export const ETIQUETAS_ESTADO: Record<GrupoInvitacion["estado"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "Rechazado",
};

export const BADGES_ESTADO: Record<GrupoInvitacion["estado"], string> = {
  confirmed: "bg-pistachio-100 text-pistachio-700 border-pistachio-300",
  pending: "bg-champagne-200 text-olive-700 border-champagne-300",
  declined: "bg-pistachio-50 text-ink-muted border-pistachio-200",
};

export const ETIQUETAS_CATEGORIA: Record<CategoriaInvitado, string> = {
  familia_novia: "Familia novia",
  familia_novio: "Familia novio",
  amigos_novia: "Amigos novia",
  amigos_novio: "Amigos novio",
  trabajo: "Trabajo",
  otros: "Otros",
};