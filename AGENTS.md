# AGENTS.md

Reglas de operación para este repositorio. Son persistentes: aplican a toda
sesión, sin importar el modelo ni el largo del contexto.

---

## 1. Git: siempre preguntar primero

Ninguna acción en git es «obvia» ni «urgente». Antes de **cualquier**
comando que modifique el historial, el índice, las ramas o el remoto:

1. Explica en una línea qué hace el comando y qué riesgo tiene.
2. **Espera confirmación explícita del usuario.**
3. Solo entonces ejecuta.

Aplica a (entre otros): `commit`, `push`, `merge`, `rebase`, `cherry-pick`,
`reset`, `revert`, `checkout -b`, `switch -c`, `branch -d/-D`, `stash`,
`clean`, `restore`.

**Ejemplo de flujo correcto:**

> **Assistant:** Voy a eliminar la rama local `foo`. Esto borra el puntero a la
> rama; el commit `abc123` queda recuperable con reflog. ¿Confirmas?
>
> **Usuario:** Sí.
>
> **Assistant:** *(ejecuta)*

Si el usuario ya pidió la acción explícitamente en su mensaje, eso **es** la
confirmación: no hace falta re-preguntar, pero sí anunciar qué comando se va
a usar antes de ejecutarlo.

Antes de operar, **verifica el estado real** con `git status` / `git log` /
`git branch -vv`. Nunca asumas el estado del repo: puede haber trabajo sin
commitear, o cambios de otra persona.

## 2. Commit, push y merge solo cuando se piden

Estas tres acciones **nunca** son proactivas:

- **Commit** — no crear commits hasta que el usuario lo pida o apruebe el diff.
- **Push** — no subir nada al remoto sin que lo pida, **nombrando la rama**.
- **Merge** — no fusionar ramas (locales o remotas) sin orden explícita.

Si un cambio parece «obvio que debería propagarse», se **propone** y se espera:

> Los cambios de `foo` están listos. ¿Mergeo a `main` y a `alvaro`, y pusheo?
> No he tocado nada todavía.

## 3. Archivos temporales: permitidos, siempre limpios

Se pueden crear archivos temporales (scripts de análisis, parches, volcados,
notas) **dentro** del proyecto cuando la tarea lo requiera.

Compromisos:

- **Ubicar los scratch en `.tmp/`** (ignorado por git) o en el directorio
  temporal del sistema. Nunca en `src/`, `public/` ni en la raíz del proyecto.
- **Borrarlos al terminar la tarea**, en la misma sesión, sin que el usuario
  tenga que pedirlo.
- Al cerrar, `git status` debe estar limpio de archivos no trackeados.
- Nunca `rm` de algo que no hayas creado tú en esta sesión.

## 4. No dejar basura en el repositorio

- Cero archivos `.rej`, `.orig`, `.bak`, `.patch`, `.log`, `~` en el árbol.
- Nada de `console.log` / `debugger` olvidados en el código entregado.
- Nada de imports, variables o parámetros muertos: el proyecto usa
  `noUnusedLocals` y `noUnusedParameters` en `tsconfig.json`.
- Nada de cambios fuera del alcance pedido. Si detectas algo mejor, **se
  propone y se espera**, no se aplica de paso.

## 5. Antes de dar por terminado cualquier trabajo

Obligatorio, en este orden:

1. `npx tsc --noEmit` — sin errores de tipos.
2. `npm run lint` — sin errores de lint.
3. `npm test` si existen tests y fueron tocados los archivos que cubren.
4. `git status` — limpio, sin untracked.
5. Reportar: qué se cambió, qué se verificó, y qué **no** se pudo verificar.

Nunca declarar «listo» sin haber ejecutado las verificaciones en esta sesión.

## 6. Transparencia

- Si algo sale mal, decirlo de inmediato. Sin eufemismos («se rompió» > «hubo
  un detalle»).
- Si un error se repite, reconocerlo y cambiar el proceso, no solo la línea.
- Reportar el estado real: si un commit fue pusheado, si una rama existe en
  remoto, si algo quedó sin verificar.