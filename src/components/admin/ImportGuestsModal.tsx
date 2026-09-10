import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIAS, IMPORTANCIAS } from "@/config/catalogos";
import type { FilaImportacion } from "@/hooks/useGuestsAdmin";
import type { CategoriaInvitado, NivelImportancia } from "@/types/domain";

interface ImportGuestsModalProps {
  onImportar: (filas: FilaImportacion[]) => Promise<string | null>;
  onCerrar: () => void;
}

type FilaRaw = Record<string, unknown>;

const ALIASES: Record<keyof FilaImportacion, string[]> = {
  nombre_grupo: ["nombre_grupo", "grupo", "nombre del grupo"],
  invitado_principal: ["invitado_principal", "invitado", "principal"],
  limite_personas: ["limite_personas", "limite", "límite", "personas", "cupo"],
  categoria: ["categoria", "categoría", "cat"],
  importancia: ["importancia", "imp"],
};

const COLUMNAS: Array<[keyof FilaImportacion, string]> = [
  ["nombre_grupo", "Nombre del grupo (obligatorio)"],
  ["invitado_principal", "Invitado principal (obligatorio)"],
  ["limite_personas", "Límite de personas (default 1)"],
  ["categoria", "Categoría (default otros)"],
  ["importancia", "Importancia (default estandar)"],
];

function texto(valor: unknown): string {
  return String(valor ?? "").trim();
}

function leerFila(raw: FilaRaw): FilaImportacion | null {
  const get = (clave: keyof FilaImportacion): string => {
    for (const alias of ALIASES[clave]) {
      const encontrado = Object.keys(raw).find((k) => k.trim().toLowerCase() === alias.toLowerCase());
      if (encontrado !== undefined) return texto(raw[encontrado]);
    }
    return "";
  };

  const nombre_grupo = get("nombre_grupo");
  const invitado_principal = get("invitado_principal");
  if (!nombre_grupo || !invitado_principal) return null;

  const limite = Number.parseInt(get("limite_personas"), 10);
  const categoriaRaw = get("categoria").toLowerCase().replace(" ", "_");
  const importanciaRaw = get("importancia").toLowerCase();

  return {
    nombre_grupo,
    invitado_principal,
    limite_personas: Number.isFinite(limite) && limite >= 1 ? limite : 1,
    categoria: (CATEGORIAS as string[]).includes(categoriaRaw)
      ? (categoriaRaw as CategoriaInvitado)
      : "otros",
    importancia: (IMPORTANCIAS as string[]).includes(importanciaRaw)
      ? (importanciaRaw as NivelImportancia)
      : "estandar",
  };
}

function construirFilas(raw: FilaRaw[]): FilaImportacion[] {
  return raw.map(leerFila).filter((f): f is FilaImportacion => f !== null);
}

function descargarPlantilla() {
  const encabezado = ["nombre_grupo", "invitado_principal", "limite_personas", "categoria", "importancia"];
  const ejemplo = ["Familia Ejemplo", "Camila Rojas", "3", "familia_novia", "principal"];
  const csv = "\ufeff" + encabezado.join(",") + "\n" + ejemplo.join(",");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "plantilla-invitados.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ImportGuestsModal({ onImportar, onCerrar }: ImportGuestsModalProps) {
  const [filas, setFilas] = useState<FilaImportacion[]>([]);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function seleccionarArchivo(archivo: File | null) {
    setError(null);
    if (!archivo) return;
    setNombreArchivo(archivo.name);

    try {
      const esJson = /\.json$/i.test(archivo.name) || archivo.type === "application/json";
      let raw: FilaRaw[];

      if (esJson) {
        const objeto = await archivo.text();
        const parseado: unknown = JSON.parse(objeto);
        if (Array.isArray(parseado)) {
          raw = parseado as FilaRaw[];
        } else if (parseado && typeof parseado === "object") {
          const conArray = Object.values(parseado as Record<string, unknown>).find(Array.isArray);
          raw = (conArray as FilaRaw[]) ?? [];
        } else {
          throw new Error("El JSON debe ser un arreglo de invitados o un objeto con un arreglo.");
        }
      } else {
        const XLSX = await import("xlsx");
        const datos = await archivo.arrayBuffer();
        const libro = XLSX.read(datos, { type: "array" });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        raw = XLSX.utils.sheet_to_json<FilaRaw>(hoja, { defval: "" });
      }

      const validas = construirFilas(raw);
      if (validas.length === 0) throw new Error("No se encontraron filas válidas.");
      setFilas(validas);
    } catch (e) {
      setFilas([]);
      setError(e instanceof Error ? e.message : "No se pudo leer el archivo.");
    }
  }

  async function importar() {
    if (filas.length === 0) return;
    setImportando(true);
    const err = await onImportar(filas);
    setImportando(false);
    if (err) setError(err);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-pistachio-200/50 bg-white p-6 shadow-cinematic"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-display text-2xl font-light italic text-olive-900">Importar invitados</h2>

        <div className="mt-4 rounded-2xl border border-pistachio-200/50 bg-pistachio-50 p-4">
          <h3 className="font-body text-xs uppercase tracking-wider text-ink-muted">
            Formatos aceptados
          </h3>
          <p className="mt-2 font-body text-sm text-ink-light">
            <strong>.xlsx / .xls / .csv</strong> — primeras columnas como encabezado;{" "}
            <strong>.json</strong> — arreglo de objetos.
          </p>

          <h3 className="mt-4 font-body text-xs uppercase tracking-wider text-ink-muted">
            Columnas / claves reconocidas
          </h3>
          <ul className="mt-2 space-y-1 font-body text-sm text-ink-light">
            {COLUMNAS.map(([clave, descripcion]) => (
              <li key={clave}>
                <code className="text-xs text-olive-700">{clave}</code> — {descripcion}
              </li>
            ))}
          </ul>

          <h3 className="mt-4 font-body text-xs uppercase tracking-wider text-ink-muted">
            Ejemplo JSON
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-white px-3 py-2 font-body text-xs text-ink">
{`[
  { "nombre_grupo": "Familia Rojas", "invitado_principal": "Camila Rojas", "limite_personas": 3, "categoria": "familia_novia", "importancia": "principal" },
  { "nombre_grupo": "Familia Herrera", "invitado_principal": "Daniel Herrera" }
]`}
          </pre>
          <p className="mt-2 font-body text-xs text-ink-muted">
            Categorías: familia_novia · familia_novio · amigos_novia · amigos_novio · trabajo ·
            otros. Importancia: principal · estandar · cortesia.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json,text/csv,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => void seleccionarArchivo(e.target.files?.[0] ?? null)}
            className="w-full cursor-pointer rounded-xl border border-dashed border-pistachio-300 bg-alabaster px-4 py-6 font-body text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-olive file:px-4 file:py-2 file:font-body file:text-xs file:uppercase file:tracking-wider file:text-alabaster hover:file:bg-olive-500 sm:w-auto sm:flex-1"
          />
          <button
            onClick={descargarPlantilla}
            className="rounded-xl border border-pistachio-200 px-4 py-3 font-body text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-pistachio-400 hover:text-olive-900"
          >
            Descargar plantilla
          </button>
        </div>

        {error && <p className="mt-4 font-body text-sm text-champagne-300">{error}</p>}

        {filas.length > 0 && (
          <div className="mt-5">
            <p className="font-body text-xs uppercase tracking-wider text-ink-muted">
              {filas.length} filas válidas listas para importar · {nombreArchivo}
            </p>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-pistachio-200/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-pistachio-50 font-body text-ink-muted">
                  <tr>
                    <th className="px-3 py-2">Grupo</th>
                    <th className="px-3 py-2">Principal</th>
                    <th className="px-3 py-2">Límite</th>
                    <th className="px-3 py-2">Categoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pistachio-100 font-body text-ink-light">
                  {filas.slice(0, 8).map((f, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{f.nombre_grupo}</td>
                      <td className="px-3 py-2">{f.invitado_principal}</td>
                      <td className="px-3 py-2">{f.limite_personas}</td>
                      <td className="px-3 py-2">{f.categoria.replace("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filas.length > 8 && (
                <p className="px-3 py-2 text-center font-body text-xs text-ink-muted">
                  … y {filas.length - 8} filas más
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <motion.button
            onClick={onCerrar}
            className="rounded-xl px-5 py-2.5 font-body text-sm text-ink-muted transition-colors hover:bg-pistachio-50 hover:text-olive-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={() => void importar()}
            disabled={importando || filas.length === 0}
            className="rounded-xl bg-olive px-5 py-2.5 font-body text-sm text-alabaster shadow-soft transition-all hover:bg-olive-500 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {importando ? `Importando ${filas.length}...` : "Importar ahora"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}