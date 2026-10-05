import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_GRUPOS } from "@/data/mockInvitados";
import type {
  GrupoInvitacion,
  CategoriaInvitado,
  EstadoInvitacion,
  NivelImportancia,
} from "@/types/domain";

export interface AcompananteInput {
  nombre_completo: string;
  /**
   * Id del acompañante ya registrado en base de datos. Si viene informado, el
   * registro es inmutable: se muestra tal cual y no se puede reemplazar.
   */
  id?: string;
}

export interface NuevoGrupoInput {
  nombre_grupo: string;
  invitado_principal: string;
  limite_personas: number;
  categoria: CategoriaInvitado;
  importancia: NivelImportancia;
  mesa_id: string | null;
  estado: EstadoInvitacion;
  /** Miembros de la familia que acompañan al titular (RF-07). */
  acompanantes?: AcompananteInput[];
}

export type FilaImportacion = Pick<
  NuevoGrupoInput,
  "nombre_grupo" | "invitado_principal" | "limite_personas" | "categoria" | "importancia"
> & {
  /** Acompañantes opcionales declarados en la fila (RF-07). */
  acompanantes?: AcompananteInput[];
};

/** Clave de comparación de nombres: sin espacios extremos, sin distinguir mayúsculas. */
export function claveNombre(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Normaliza la lista: recorta, descarta vacíos y separa los que ya existen en
 * base de datos (id informado) de los nuevos que se deben insertar.
 */
export function limpiarAcompanantes(lista: AcompananteInput[] | undefined): AcompananteInput[] {
  return (lista ?? [])
    .map((a) => ({
      nombre_completo: a.nombre_completo.trim().slice(0, 120),
      ...(a.id ? { id: a.id } : {}),
    }))
    .filter((a) => a.nombre_completo.length > 0);
}

/**
 * Descarta nombres repetidos: tanto dentro de la propia lista como contra un
 * conjunto de nombres ya registrados (BD o filas anteriores del mismo lote).
 * Un nombre que ya existe no se vuelve a escribir.
 */
export function deduplicarAcompanantes(
  lista: AcompananteInput[],
  yaExistentes: Set<string>,
): { lista: AcompananteInput[]; omitidos: number } {
  const vistos = new Set<string>();
  const resultado: AcompananteInput[] = [];
  let omitidos = 0;
  for (const a of lista) {
    const clave = claveNombre(a.nombre_completo);
    if (yaExistentes.has(clave) || vistos.has(clave)) {
      omitidos++;
      continue;
    }
    vistos.add(clave);
    resultado.push(a);
  }
  return { lista: resultado, omitidos };
}

/**
 * Calcula los ajustes de limite_personas tras deduplicar los acompañantes.
 *
 * El archivo declara un límite, pero si un acompañante se descartó por estar
 * repetido, el cupo real queda sobrante. Se corrige solo a la baja: titular más
 * los acompañantes que de verdad se insertaron.
 *
 * Solo baja, nunca sube: un límite menor que la lista de acompañantes viene del
 * archivo y es un dato a respetar, no una consecuencia de la deduplicación.
 */
export function calcularAjustesLimite(
  filas: FilaImportacion[],
  idPorToken: Map<string, string>,
  tokens: string[],
  limiteReal: Map<string, number>,
): Array<{ id: string; limite_personas: number }> {
  const ajustes: Array<{ id: string; limite_personas: number }> = [];
  filas.forEach((fila, i) => {
    const grupoId = idPorToken.get(tokens[i]);
    if (!grupoId) return;
    const real = (limiteReal.get(grupoId) ?? 0) + 1;
    if (fila.limite_personas > real) {
      ajustes.push({ id: grupoId, limite_personas: real });
    }
  });
  return ajustes;
}

/**
 * RF-12: CRUD completo de invitados desde el panel administrativo.
 * Crear/editar/eliminar quedan protegidos por las políticas RLS
 * "admin_write_grupos" (solo usuarios autenticados) definidas en el esquema.
 */
export function useGuestsAdmin() {
  const [grupos, setGrupos] = useState<GrupoInvitacion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setGrupos(Object.values(MOCK_GRUPOS));
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("grupos_invitacion")
      .select(
        "id, access_token, nombre_grupo, invitado_principal, limite_personas, categoria, importancia, estado, mesa_id, mensaje_rsvp, respondido_en, creado_en, acompanantes(*), mesa:mesas(*)",
      )
      .order("creado_en", { ascending: false });
    setGrupos((data as unknown as GrupoInvitacion[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  /**
   * Inserta unicamente los acompanantes que aun no existen en base de datos.
   * Los que ya tienen id no se tocan: quedan bloqueados y solo se pueden
   * agregar nombres nuevos, nunca reemplazar los existentes.
   */
  async function agregarAcompanantes(
    grupoId: string,
    lista: AcompananteInput[] | undefined,
  ): Promise<string | null> {
    const nuevos = limpiarAcompanantes(lista).filter((a) => !a.id);
    if (nuevos.length === 0) return null;
    const { error } = await supabase.from("acompanantes").insert(
      nuevos.map((a) => ({
        grupo_id: grupoId,
        nombre_completo: a.nombre_completo,
        confirmado: null,
      })),
    );
    return error ? "No se pudieron guardar los acompanantes." : null;
  }

  async function crear(input: NuevoGrupoInput): Promise<string | null> {
    // acompanantes no es una columna: se separa para insertarlo en su tabla.
    const { acompanantes, ...columnas } = input;
    if (!isSupabaseConfigured) {
      const id = crypto.randomUUID();
      setGrupos((prev) => [
        {
          id,
          access_token: crypto.randomUUID(),
          ...columnas,
          estado: columnas.estado ?? "pending",
          mensaje_rsvp: null,
          respondido_en: null,
          creado_en: new Date().toISOString(),
          acompanantes: limpiarAcompanantes(acompanantes).map((a) => ({
            id: crypto.randomUUID(),
            grupo_id: id,
            nombre_completo: a.nombre_completo,
            confirmado: null,
          })),
          mesa: null,
        },
        ...prev,
      ]);
      return null;
    }
    const { data, error } = await supabase
      .from("grupos_invitacion")
      .insert({ ...columnas, access_token: crypto.randomUUID() })
      .select("id")
      .single();
    if (error) return "No se pudo crear el grupo.";
    const errAcompanantes = await agregarAcompanantes(data.id, acompanantes);
    await cargar();
    return errAcompanantes;
  }

  async function actualizar(id: string, cambios: Partial<NuevoGrupoInput>): Promise<string | null> {
    const { acompanantes, ...resto } = cambios;
    if (!isSupabaseConfigured) {
      setGrupos((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          const limpios = limpiarAcompanantes(acompanantes);
          return {
            ...g,
            ...resto,
            estado: cambios.estado ?? g.estado,
            acompanantes: acompanantes
              ? limpios.map((a) => ({
                  id: crypto.randomUUID(),
                  grupo_id: g.id,
                  nombre_completo: a.nombre_completo,
                  confirmado: null,
                }))
              : g.acompanantes,
          };
        }),
      );
      return null;
    }
    if (Object.keys(resto).length > 0) {
      const { error } = await supabase.from("grupos_invitacion").update(resto).eq("id", id);
      if (error) return "No se pudo actualizar el grupo.";
    }
    const errAcompanantes = await agregarAcompanantes(id, acompanantes);
    await cargar();
    return errAcompanantes;
  }

  async function eliminar(id: string): Promise<string | null> {
    if (!isSupabaseConfigured) {
      setGrupos((prev) => prev.filter((g) => g.id !== id));
      return null;
    }
    const { error } = await supabase.from("grupos_invitacion").delete().eq("id", id);
    if (!error) await cargar();
    return error ? "No se pudo eliminar el grupo." : null;
  }

  /** Alta masiva (importación CSV/Excel): crea tantos grupos como filas. */
  async function crearLote(
    filas: FilaImportacion[],
  ): Promise<{ ok: number; error: string | null; omitidos: number }> {
    if (!isSupabaseConfigured) {
      for (const fila of filas) {
        await crear({ ...fila, mesa_id: null, estado: "pending" });
      }
      return { ok: filas.length, error: null, omitidos: 0 };
    }

    // access_token es único por fila y lo generamos nosotros: sirve de ancla
    // para emparejar cada grupo creado con sus acompañantes.
    const tokens = filas.map(() => crypto.randomUUID());
    const registros = filas.map((fila, i) => ({
      nombre_grupo: fila.nombre_grupo,
      invitado_principal: fila.invitado_principal,
      limite_personas: fila.limite_personas,
      categoria: fila.categoria,
      importancia: fila.importancia,
      mesa_id: null,
      estado: "pending" as EstadoInvitacion,
      access_token: tokens[i],
    }));

    const { data, error } = await supabase
      .from("grupos_invitacion")
      .insert(registros)
      .select("id, access_token");
    if (error) return { ok: 0, error: "No se pudieron crear los grupos.", omitidos: 0 };

    const idPorToken = new Map((data ?? []).map((r) => [r.access_token, r.id]));

    // Nombres ya registrados en la BD: un acompañante existente no se reescribe.
    const { data: existentes } = await supabase.from("acompanantes").select("nombre_completo");
    const yaRegistrados = new Set(
      (existentes ?? [])
        .map((a) => claveNombre(a.nombre_completo ?? ""))
        .filter((n) => n.length > 0),
    );

    let omitidos = 0;
    const limiteReal = new Map<string, number>();
    const acompanantesPlano = filas.flatMap((fila, i) => {
      const grupoId = idPorToken.get(tokens[i]);
      if (!grupoId) return [];
      // Deduplica contra la BD y contra las filas ya procesadas del mismo lote,
      // de modo que la misma persona no se duplique al reimportar un archivo.
      const { lista, omitidos: descartados } = deduplicarAcompanantes(
        limpiarAcompanantes(fila.acompanantes),
        yaRegistrados,
      );
      omitidos += descartados;
      for (const a of lista) yaRegistrados.add(claveNombre(a.nombre_completo));
      limiteReal.set(grupoId, lista.length);
      return lista.map((a) => ({
        grupo_id: grupoId,
        nombre_completo: a.nombre_completo,
        confirmado: null,
      }));
    });

    const ajustes = calcularAjustesLimite(filas, idPorToken, tokens, limiteReal);
    for (const a of ajustes) {
      await supabase
        .from("grupos_invitacion")
        .update({ limite_personas: a.limite_personas })
        .eq("id", a.id);
    }

    let errorAcompanantes: string | null = null;
    if (acompanantesPlano.length > 0) {
      const { error: err } = await supabase.from("acompanantes").insert(acompanantesPlano);
      if (err) errorAcompanantes = "Los grupos se crearon, pero fallaron los acompañantes.";
    }

    await cargar();
    // `omitidos` va aparte de `error`: la importación fue correcta, solo se
    // saltaron nombres repetidos. Mezclarlos cerraría el modal como si fallara.
    return { ok: filas.length, error: errorAcompanantes, omitidos };
  }

  return { grupos, loading, crear, actualizar, eliminar, crearLote, refetch: cargar };
}