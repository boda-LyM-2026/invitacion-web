/**
 * Datos centrales del evento. Un único lugar para fecha, hora y lugar
 * (antes repetidos en Hero, FormalInvitation, Footer, IntroSequence,
 * NotFoundPage y Countdown).
 */
export const NOMBRE_NOVIOS = "Lenan & Mauricio";

export const FECHA_BODA_TEXTO = "14 de noviembre de 2026";

export const HORA_BODA_TEXTO = "6:00 p.m.";

export const LUGAR_BODA = "Hacienda Los Olivos";

export const LUGAR_BODA_COMPLETO = "Hacienda Los Olivos, Cochabamba";

/** ISO con offset usado por el countdown; se puede sobreescribir vía env. */
export const FECHA_BODA_ISO =
  (import.meta.env.VITE_WEDDING_DATETIME as string | undefined) ?? "2026-11-14T18:00:00-04:00";