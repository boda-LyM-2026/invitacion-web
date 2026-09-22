import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ETIQUETAS_ESTADO } from "@/config/catalogos";
import type { GrupoInvitacion } from "@/types/domain";

interface FilaExport {
  Grupo: string;
  "Invitado principal": string;
  Estado: string;
  "Personas confirmadas": number;
  "Límite de personas": number;
  Categoría: string;
  Importancia: string;
  Mesa: string;
  "Mensaje RSVP": string;
  Enlace: string;
}

function aFilas(grupos: GrupoInvitacion[]): FilaExport[] {
  const origen = window.location.origin;
  return grupos.map((g) => ({
    Grupo: g.nombre_grupo,
    "Invitado principal": g.invitado_principal,
    Estado: ETIQUETAS_ESTADO[g.estado],
    "Personas confirmadas": g.estado === "confirmed" ? g.acompanantes.length + 1 : 0,
    "Límite de personas": g.limite_personas,
    Categoría: g.categoria,
    Importancia: g.importancia,
    Mesa: g.mesa?.nombre ?? (g.mesa?.numero ? `Mesa ${g.mesa.numero}` : "Sin asignar"),
    "Mensaje RSVP": g.mensaje_rsvp ?? "",
    // RF-02: el enlace personal que se comparte con cada invitado.
    Enlace: `${origen}/invitacion/${g.access_token}`,
  }));
}

export function exportarExcel(grupos: GrupoInvitacion[], nombreArchivo = "invitados-lenan-mauricio.xlsx") {
  const filas = aFilas(grupos);
  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Invitados");
  XLSX.writeFile(libro, nombreArchivo);
}

export function exportarCsv(grupos: GrupoInvitacion[], nombreArchivo = "invitados-lenan-mauricio.csv") {
  const filas = aFilas(grupos);
  const hoja = XLSX.utils.json_to_sheet(filas);
  const csv = XLSX.utils.sheet_to_csv(hoja);
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportarPdf(grupos: GrupoInvitacion[], nombreArchivo = "invitados-lenan-mauricio.pdf") {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16);
  doc.text("Lenan & Mauricio — Lista de invitados", 14, 16);

  const filas = aFilas(grupos);
  autoTable(doc, {
    startY: 22,
    head: [Object.keys(filas[0] ?? {})],
    body: filas.map((f) => Object.values(f)),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [97, 110, 77] },
  });

  doc.save(nombreArchivo);
}
