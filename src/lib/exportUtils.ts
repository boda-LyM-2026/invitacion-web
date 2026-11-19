import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable, { type CellInput } from "jspdf-autotable";
import { ETIQUETAS_ESTADO } from "@/config/catalogos";
import type { GrupoInvitacion } from "@/types/domain";

export type OrdenListaInvitados = "alfabetico" | "grupo";

interface FilaExportLista {
  Grupo: string;
  "Invitado principal": string;
  Acompañantes: string;
  "Total personas": number;
}

interface FilaExportCompleta {
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

function aFilasLista(grupos: GrupoInvitacion[]): FilaExportLista[] {
  return grupos.map((g) => {
    const acompañantes = g.acompanantes
      .map((a) => a.nombre_completo)
      .filter((nombre): nombre is string => Boolean(nombre && nombre.trim()))
      .join(", ");

    return {
      Grupo: g.nombre_grupo,
      "Invitado principal": g.invitado_principal,
      Acompañantes: acompañantes,
      "Total personas": g.limite_personas,
    };
  });
}

function aFilas(grupos: GrupoInvitacion[]): FilaExportCompleta[] {
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
  const doc = new jsPDF({ orientation: "portrait" });
  doc.setFontSize(16);
  doc.text("Lenan & Mauricio — Lista de invitados", 14, 16);

  const filas = aFilasLista(grupos);
  autoTable(doc, {
    startY: 22,
    head: [Object.keys(filas[0] ?? {})],
    body: filas.map((f) => Object.values(f)),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [97, 110, 77] },
    columnStyles: {
      Acompañantes: { cellWidth: "auto" },
    },
  });

  doc.save(nombreArchivo);
}

interface InvitadoLista {
  nombre: string;
  mesa: string;
}

interface GrupoLista {
  nombreGrupo: string;
  invitados: InvitadoLista[];
}

function compararNombres(a: string, b: string) {
  return a.localeCompare(b, "es", { sensitivity: "base" });
}

function agruparInvitados(grupos: GrupoInvitacion[]): GrupoLista[] {
  return grupos
    .map((g) => {
      const mesa = g.mesa?.numero != null ? String(g.mesa.numero) : "Sin asignar";
      const invitados: InvitadoLista[] = [
        { nombre: g.invitado_principal.trim(), mesa },
        ...g.acompanantes
          .map((a) => (a.nombre_completo ?? "").trim())
          .filter(Boolean)
          .map((nombre) => ({ nombre, mesa })),
      ];
      return { nombreGrupo: g.nombre_grupo, invitados };
    })
    .filter((g) => g.invitados.length > 0)
    .sort((a, b) => compararNombres(a.nombreGrupo, b.nombreGrupo));
}

function invitadosAlfabeticamente(grupos: GrupoInvitacion[]): InvitadoLista[] {
  return agruparInvitados(grupos)
    .flatMap((g) => g.invitados)
    .sort((a, b) => compararNombres(a.nombre, b.nombre));
}

export function exportarListaInvitadosPdf(
  grupos: GrupoInvitacion[],
  orden: OrdenListaInvitados,
  nombreArchivo = "lista-invitados.pdf",
) {
  const doc = new jsPDF({ orientation: "portrait" });
  doc.setFontSize(16);
  doc.text("Lenan & Mauricio — Lista de invitados", 14, 16);
  doc.setFontSize(10);
  doc.text(orden === "grupo" ? "Agrupado por grupo" : "Orden alfabético", 14, 22);

  if (orden === "grupo") {
    const cuerpo: CellInput[][] = [];
    for (const g of agruparInvitados(grupos)) {
      cuerpo.push([
        {
          content: g.nombreGrupo,
          colSpan: 3,
          styles: { fillColor: [231, 219, 203], fontStyle: "bold", textColor: [42, 45, 29] },
        },
      ]);
      for (const invitado of g.invitados) {
        cuerpo.push(["", invitado.nombre, invitado.mesa]);
      }
    }

    autoTable(doc, {
      startY: 26,
      head: [["Grupo", "Invitado", "Mesa"]],
      body: cuerpo,
      styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [97, 110, 77] },
      alternateRowStyles: { fillColor: [249, 249, 239] },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 22, halign: "center" },
      },
    });
  } else {
    autoTable(doc, {
      startY: 26,
      head: [["Nombre Invitado", "Mesa"]],
      body: invitadosAlfabeticamente(grupos).map((invitado) => [invitado.nombre, invitado.mesa]),
      styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [97, 110, 77] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 30, halign: "center" },
      },
    });
  }

  doc.save(nombreArchivo);
}

export function exportarListaInvitadosExcel(
  grupos: GrupoInvitacion[],
  orden: OrdenListaInvitados,
  nombreArchivo = "lista-invitados.xlsx",
) {
  const filas: string[][] = [
    orden === "grupo" ? ["Grupo", "Invitado", "Mesa"] : ["Nombre Invitado", "Mesa"],
  ];
  const secciones: XLSX.Range[] = [];

  if (orden === "grupo") {
    for (const g of agruparInvitados(grupos)) {
      const filaSeccion = filas.length;
      filas.push([g.nombreGrupo, "", ""]);
      secciones.push({ s: { r: filaSeccion, c: 0 }, e: { r: filaSeccion, c: 2 } });
      for (const invitado of g.invitados) {
        filas.push(["", invitado.nombre, invitado.mesa]);
      }
    }
  } else {
    for (const invitado of invitadosAlfabeticamente(grupos)) {
      filas.push([invitado.nombre, invitado.mesa]);
    }
  }

  const hoja = XLSX.utils.aoa_to_sheet(filas);
  hoja["!cols"] =
    orden === "grupo"
      ? [{ wch: 35 }, { wch: 35 }, { wch: 10 }]
      : [{ wch: 45 }, { wch: 10 }];
  if (secciones.length > 0) hoja["!merges"] = secciones;

  const estiloEncabezado = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "616E4D" } },
  };
  const columnasEncabezado = filas[0].length;
  for (let c = 0; c < columnasEncabezado; c++) {
    const celda = hoja[XLSX.utils.encode_cell({ r: 0, c })];
    if (celda) celda.s = estiloEncabezado;
  }
  const estiloSeccion = {
    font: { bold: true, color: { rgb: "2A2D1D" } },
    fill: { fgColor: { rgb: "E7DBCB" } },
  };
  for (const seccion of secciones) {
    const celda = hoja[XLSX.utils.encode_cell(seccion.s)];
    if (celda) celda.s = estiloSeccion;
  }

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Invitados");
  XLSX.writeFile(libro, nombreArchivo);
}
