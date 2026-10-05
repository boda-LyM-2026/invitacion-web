import { describe, expect, it } from "vitest";
import {
  calcularAjustesLimite,
  claveNombre,
  deduplicarAcompanantes,
  limpiarAcompanantes,
  type AcompananteInput,
  type FilaImportacion,
} from "@/hooks/useGuestsAdmin";

function nombre(n: string): AcompananteInput {
  return { nombre_completo: n };
}

describe("claveNombre", () => {
  it("ignora mayúsculas, espacios extremos y espacios repetidos", () => {
    expect(claveNombre("  Sofía   Gómez ")).toBe("sofía gómez");
    expect(claveNombre("SOFÍA GÓMEZ")).toBe(claveNombre("sofía gómez"));
    expect(claveNombre("Sofia  Gomez")).toBe(claveNombre("sofia gomez"));
  });
});

describe("limpiarAcompanantes", () => {
  it("recorta, descarta vacíos y conserva el id de los existentes", () => {
    const lista = limpiarAcompanantes([
      { id: "abc", nombre_completo: "  Camila  " },
      nombre("   "),
      nombre("Sofia"),
      nombre(""),
    ]);

    expect(lista).toEqual([
      { id: "abc", nombre_completo: "Camila" },
      { nombre_completo: "Sofia" },
    ]);
  });

  it("no muta la lista original", () => {
    const original: AcompananteInput[] = [{ nombre_completo: "  Ana  " }];
    limpiarAcompanantes(original);
    expect(original[0].nombre_completo).toBe("  Ana  ");
  });

  it("devuelve lista vacía si no hay acompañantes", () => {
    expect(limpiarAcompanantes(undefined)).toEqual([]);
  });
});

describe("deduplicarAcompanantes", () => {
  it("descarta repetidos dentro de la propia lista", () => {
    const r = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("Sofia"), nombre("SOFIA"), nombre("  Sofia  ")]),
      new Set(),
    );

    expect(r.lista).toHaveLength(1);
    expect(r.omitidos).toBe(2);
  });

  it("trata como distintos los nombres que solo difieren en tildes", () => {
    // "Sofia" y "Sofía" son dos personas: la clave no normaliza acentos a
    // propósito, porque colapsarlos fundiría a dos invitados reales.
    const r = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("Sofia"), nombre("Sofía")]),
      new Set(),
    );

    expect(r.lista).toHaveLength(2);
    expect(r.omitidos).toBe(0);
  });

  it("descarta los que ya están en la base de datos", () => {
    const r = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("Sofia"), nombre("Mateo")]),
      new Set([claveNombre("SOFIA")]),
    );

    expect(r.lista.map((a) => a.nombre_completo)).toEqual(["Mateo"]);
    expect(r.omitidos).toBe(1);
  });

  it("cuenta los omitidos al deduplicar contra filas anteriores del lote", () => {
    const yaRegistrados = new Set<string>();
    const primero = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("Sofia"), nombre("Mateo")]),
      yaRegistrados,
    );
    for (const a of primero.lista) yaRegistrados.add(claveNombre(a.nombre_completo));

    // La segunda fila del archivo repite a Sofia: es el caso de la reimportación.
    const segundo = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("Sofia"), nombre("Julia")]),
      yaRegistrados,
    );

    expect(segundo.lista.map((a) => a.nombre_completo)).toEqual(["Julia"]);
    expect(segundo.omitidos).toBe(1);
  });

  it("conserva el primer nombre visto tal cual vino", () => {
    const r = deduplicarAcompanantes(
      limpiarAcompanantes([nombre("  Sofía  "), nombre("SOFIA")]),
      new Set(),
    );
    expect(r.lista[0].nombre_completo).toBe("Sofía");
  });
});

describe("calcularAjustesLimite", () => {
  function fila(nombre_grupo: string, limite_personas: number, acompanantes: AcompananteInput[]) {
    return {
      nombre_grupo,
      limite_personas,
      categoria: "amigos_novia",
      importancia: "estandar",
      invitado_principal: "Titular",
      acompanantes,
    } as FilaImportacion;
  }

  it("baja el límite cuando un acompañante se omitió por repetido", () => {
    // Escenario real: el archivo declara 3, pero Sofia ya estaba en la base y
    // se descarta, así que solo queda Camila como acompañante.
    const filas = [fila("Familia Rojas", 3, [nombre("Camila"), nombre("Sofia")])];
    const tokens = ["tok-1"];
    const idPorToken = new Map([["tok-1", "grupo-1"]]);
    const limiteReal = new Map([["grupo-1", 1]]);

    const ajustes = calcularAjustesLimite(filas, idPorToken, tokens, limiteReal);

    expect(ajustes).toEqual([{ id: "grupo-1", limite_personas: 2 }]);
  });

  it("deja el límite intacto si no hubo omisiones", () => {
    const filas = [fila("Familia Rojas", 3, [nombre("Camila"), nombre("Sofia")])];
    const idPorToken = new Map([["tok-1", "grupo-1"]]);

    const ajustes = calcularAjustesLimite(
      filas,
      idPorToken,
      ["tok-1"],
      new Map([["grupo-1", 2]]),
    );

    expect(ajustes).toEqual([]);
  });

  it("baja también cuando el archivo declara más personas de las que lista", () => {
    // El archivo dice 4 y solo quedan 2 acompañantes: el cupo real es 3.
    const filas = [fila("Familia Rojas", 4, [nombre("Camila"), nombre("Sofia")])];
    const idPorToken = new Map([["tok-1", "grupo-1"]]);

    const ajustes = calcularAjustesLimite(
      filas,
      idPorToken,
      ["tok-1"],
      new Map([["grupo-1", 2]]),
    );

    expect(ajustes).toEqual([{ id: "grupo-1", limite_personas: 3 }]);
  });

  it("nunca sube un límite menor que el grupo real", () => {
    // El archivo dice 2 pero se insertaron 3 acompañantes: es un dato del
    // archivo, no un error de deduplicación. No se toca.
    const filas = [fila("Familia Rojas", 2, [nombre("A"), nombre("B"), nombre("C")])];
    const idPorToken = new Map([["tok-1", "grupo-1"]]);

    const ajustes = calcularAjustesLimite(
      filas,
      idPorToken,
      ["tok-1"],
      new Map([["grupo-1", 3]]),
    );

    expect(ajustes).toEqual([]);
  });

  it("deja el límite en 1 cuando el grupo se queda sin acompañantes", () => {
    const filas = [fila("Familia Rojas", 3, [nombre("Sofia")])];
    const idPorToken = new Map([["tok-1", "grupo-1"]]);

    const ajustes = calcularAjustesLimite(
      filas,
      idPorToken,
      ["tok-1"],
      new Map([["grupo-1", 0]]),
    );

    expect(ajustes).toEqual([{ id: "grupo-1", limite_personas: 1 }]);
  });

  it("ajusta solo el grupo afectado cuando el lote tiene varias filas", () => {
    const filas = [
      fila("Familia Rojas", 3, [nombre("Camila"), nombre("Sofia")]),
      fila("Familia Pérez", 2, [nombre("Diego")]),
    ];
    const idPorToken = new Map([
      ["tok-1", "grupo-1"],
      ["tok-2", "grupo-2"],
    ]);

    const ajustes = calcularAjustesLimite(
      filas,
      idPorToken,
      ["tok-1", "tok-2"],
      new Map([
        ["grupo-1", 1],
        ["grupo-2", 1],
      ]),
    );

    expect(ajustes).toEqual([{ id: "grupo-1", limite_personas: 2 }]);
  });

  it("ignora filas sin grupo creado", () => {
    const filas = [fila("Familia Rojas", 5, [nombre("Camila")])];
    const ajustes = calcularAjustesLimite(
      filas,
      new Map(),
      ["tok-1"],
      new Map([["grupo-1", 1]]),
    );
    expect(ajustes).toEqual([]);
  });

  it("corrige el límite cuando se reimporta el mismo archivo", () => {
    // Escenario completo: la primera importación inserta Camila y Sofia.
    // Al reimportar, ambos ya están en el conjunto y se descartan, así que el
    // segundo grupo no debe quedar con un cupo de 3 que nadie puede usar.
    const yaRegistrados = new Set<string>();
    const nombresArchivo = [nombre("Camila"), nombre("Sofia")];

    const primera = deduplicarAcompanantes(
      limpiarAcompanantes(nombresArchivo),
      yaRegistrados,
    );
    for (const a of primera.lista) yaRegistrados.add(claveNombre(a.nombre_completo));

    const segunda = deduplicarAcompanantes(
      limpiarAcompanantes(nombresArchivo),
      yaRegistrados,
    );

    const filas = [fila("Familia Rojas", 3, nombresArchivo)];
    const ajustes = calcularAjustesLimite(
      filas,
      new Map([["tok-1", "grupo-1"]]),
      ["tok-1"],
      new Map([["grupo-1", segunda.lista.length]]),
    );

    expect(primera.omitidos).toBe(0);
    expect(segunda.omitidos).toBe(2);
    expect(segunda.lista).toEqual([]);
    expect(ajustes).toEqual([{ id: "grupo-1", limite_personas: 1 }]);
  });
});
