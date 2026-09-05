# Lenan & Mauricio — Invitación digital premium

Invitación digital personalizada por invitado, con RSVP dinámico, panel
administrativo con KPIs en tiempo real y exportaciones. Construida con
React + TypeScript + Vite + Framer Motion + TailwindCSS en el frontend y
Supabase (PostgreSQL + RLS + Auth) en el backend.

> Rama de trabajo activa: **`alvaro`**. `main`/`master` quedan para releases
> tras revisar el PR.

## 1. Puesta en marcha

Requisitos: Node 20+, una cuenta en [supabase.com](https://supabase.com).

```bash
npm install
cp .env.example .env       # completar con las credenciales de Supabase
npm run dev
```

1. Crea un proyecto en Supabase.
2. Abre el **SQL Editor** y ejecuta `supabase/schema.sql` **completo**. El
   script es **idempotente** (se puede re-ejecutar sin romper nada). Crea:
   - Tipos `estado_invitacion`, `categoria_invitado`, `nivel_importancia`.
   - Tablas `grupos_invitacion`, `acompanantes`, `mesas`, `rsvp_intentos`,
     `admin_profiles`, y la vista `kpi_resumen`.
   - Funciones `obtener_grupo(uuid)` y `submit_rsvp(...)` (SECURITY DEFINER).
   - RLS habilitado en todas las tablas con políticas administrativas
     gated por `admin_profiles`.
   - Seed de ejemplo: **11 mesas** y **2 grupos de invitados**.
3. En **Authentication → Users** (o la CLI de Supabase), crea un usuario
   email/password para los novios/organizadores; ese es el acceso a `/admin`.
4. **Añade ese usuario a `admin_profiles`** (inserta su `id` de `auth.users`
   en la tabla). Sin este paso el panel no muestra datos: toda lectura
   administrativa requiere pertenecer a `admin_profiles`.
5. Copia `Project URL` y `anon public key` (Project Settings → API) al `.env`.

> **Modo demo sin Supabase**: si dejas `.env` vacío, la app funciona igual
> usando `src/data/mockInvitados.ts` para revisar diseño y escenarios:
> - `/invitacion/demo-pendiente`, `/invitacion/demo-confirmado`,
>   `/invitacion/demo-rechazado`
> - `/admin` también carga con KPIs y tabla de ejemplo.

### Variables de entorno (`.env.example`)

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon public key (nunca la `service_role`) |
| `VITE_WEDDING_DATETIME` | Fecha del evento en ISO con offset (default `2026-11-14T18:00:00-04:00`) |

## 2. Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # tsc -b && vite build (sin sourcemaps, code-splitting)
npm run preview    # sirve el build
npm run lint       # ESLint (flat config, eslint.config.js)
npm test           # Vitest (tests/fechas.test.ts, tests/stats.test.ts)
```

CI en `.github/workflows/ci.yml`: corre `lint`, `test` y `build` en cada push.

## 3. Arquitectura

### Frontend

```
src/
├── components/
│   ├── intro/            IntroSequence (secuencia cinemática + audio Web Audio)
│   ├── shared/           Hero, Footer, OliveDivider, WaxSeal, Reveal,
│   │                     ParticleField, AudioPlayer
│   ├── scenarios/
│   │   ├── pending/      Escenario A: OurStory, FormalInvitation,
│   │   │                  CodeOfConduct, RsvpForm
│   │   ├── confirmed/    Escenario B: Countdown, LocationSection,
│   │   │                  Timeline, TableAssignment, Recommendations
│   │   └── declined/     Escenario C: ThankYouScreen
│   └── admin/            KpiCard, DashboardCharts, GuestsTable, GuestFormModal
├── config/
│   ├── wedding.ts        DATOS DE LA BODA (fecha, hora, lugar, nombres) —
│   │                     única fuente: aquí se cambian, no en los componentes
│   └── catalogos.ts      catálogos reutilizados (estados, categorías,
│                         importancias y sus etiquetas/badges)
├── data/
│   ├── mesas.ts          croquis de las 11 mesas (pos_x/pos_y) — mantener
│   │                     sincronizado con el seed de supabase/schema.sql
│   └── mockInvitados.ts  datos de ejemplo para modo demo
├── pages/
│   ├── InvitationPage.tsx      resuelve token → decide escenario
│   ├── NotFoundPage.tsx
│   └── admin/                  LoginPage, AdminLayout, DashboardPage, GuestsPage
├── hooks/                useGrupoInvitacion, useRsvp, useCountdown,
│                          useAuth, useKpis, useGuestsAdmin
├── lib/
│   ├── supabase.ts       cliente Supabase
│   ├── validacion.ts     esUuid() — valida el token antes de consultar
│   ├── fechas.ts         diffFechas (countdown), fechaLocalIso (zona local)
│   ├── stats.ts          buildSerieTiempo() — curva acumulada por día local
│   ├── exportUtils.ts    CSV/Excel/PDF — se carga BAJO DEMANDA (dynamic import)
│   └── audioIntro.ts     sonido sintetizado de la intro (Web Audio, sin assets)
├── types/domain.ts       tipos alineados 1:1 con el esquema SQL
└── main.tsx / App.tsx    rutas con React.lazy + Suspense (code-splitting)
tests/                    Vitest: pruebas de las funciones puras
```

Notas clave del frontend:

- **Code-splitting por ruta** (`src/App.tsx`): el invitado no descarga el
  panel admin (recharts, xlsx/jsPDF) ni el admin la intro.
- `xlsx` + `jsPDF` viven en `exportUtils.ts`, importado con `await import()`
  dentro de los botones de exportación de `GuestsPage`.
- Las secciones de cada escenario son "tontas": reciben props y no consultan
  Supabase directamente (salvo los hooks). `InvitationPage` es la única pieza
  que conoce las reglas de qué escenario mostrar.
- `src/config/wedding.ts` centraliza fecha, hora, lugar y nombres: si cambia
  el lugar de la boda, se edita ahí y no en 6 componentes.

### Backend (Supabase)

Modelo entidad-relación (`supabase/schema.sql`):

```
mesas (11, seed) ─┐
                  │ mesa_id (FK, nullable)
                  ▼
grupos_invitacion (1) ──< acompanantes (N)
       │
       └──< rsvp_intentos (N)    -- registro anti-abuso de submit_rsvp

admin_profiles ── auth.users     -- puerta del panel administrativo
```

- **`grupos_invitacion`**: unidad de acceso. `access_token` (UUIDv4, único e
  indexado) es lo único que necesita el invitado para ver su invitación.
- **`acompanantes`**: uno-a-muchos con el grupo; se reescriben por completo en
  cada RSVP (ver `submit_rsvp`).
- **`mesas`**: catálogo con posición `(pos_x, pos_y)` en porcentaje, usado por
  el croquis del invitado y por el admin. El frontend la dibuja con
  `src/data/mesas.ts`.
- **Vista `kpi_resumen`**: agrega los conteos en el servidor; el `select`
  sobre ella está **revocado para `anon`** (solo pasan los autenticados en
  `admin_profiles`).
- **`rsvp_intentos`**: tabla de rate-limiting (máx. 10 envíos por grupo en la
  última hora).
- **`admin_profiles`**: gate del admin. Una política solo se activa si el
  usuario autenticado tiene fila en esta tabla.

### Seguridad (modelo vigente)

Ya no existen políticas públicas de lectura (`to anon using (true)` fue
eliminado del esquema). El acceso público queda así:

| Operación | Vía | Condición |
|---|---|---|
| Ver invitación del invitado | RPC `obtener_grupo(uuid)` (SECURITY DEFINER) | devuelve solo el grupo exacto por token, o `null` |
| Enviar RSVP | RPC `submit_rsvp(uuid, estado, mensaje, acompañantes jsonb)` | valida `limite_personas`, enums y rate-limit en el servidor |
| Leer/ver el panel admin | `select` con políticas RLS | usuario en `admin_profiles` |
| CRUD de invitados (admin) | `insert/update/delete` | usuario en `admin_profiles` |
| `kpi_resumen` | `select` | revocado de `anon`, solo admin |

El cliente nunca consulta `grupos_invitacion`/`acompanantes` directamente con
el rol público: **todo pasa por los RPC**. El `access_token` se valida como
UUID antes de llamar (`src/lib/validacion.ts`). Los RPC son `SECURITY DEFINER`
con `search_path` fijado para evitar la inyección de `search_path`.

## 4. Deploy

Es una SPA con `BrowserRouter`, así que **toda ruta debe caer en
`index.html`**:

- **Netlify**: el archivo `public/_redirects` (`/* /index.html 200`) se
  publica automáticamente.
- **Vercel**: ya está `vercel.json` en la raíz con el `rewrite`.

Antes de publicar en producción, faltan dos assets (ver pendientes):

- `public/og-portada.png` — imagen referenciada por las meta tags OG de
  `index.html` (la vista previa al compartir el link por WhatsApp).
- `public/audio/background-music.mp3` — música de fondo opcional; si no
  existe, `AudioPlayer` se oculta solo (no muestra 404).

## 5. Decisiones de diseño

- **Paleta**: Pistachio (#93A27D) dominante en fondos degradados
  (`bg-leaf-fade`, `bg-olive-fade`), tarjetas, botones y rama de olivo.
- **Tipografía**: Cormorant Garamond / Fraunces (display) + Jost (cuerpo).
- **Elementos de firma**: `OliveDivider` (rama dibujada con `pathLength`) y
  `WaxSeal` (monograma L&M) reutilizado en intro, footer y estados.
- **Intro cinemática** (`IntroSequence`): sobre 3D, sello de cera con
  microfisuras que se raja en fragmentos asimétricos, carta tipo pergamino que
  asoma (mismo tamaño que el sobre), spotlight y sonido sintetizado con Web
  Audio (crujido de papel, crack del sello, timbre music-box). Respetan
  `prefers-reduced-motion` (se omite la secuencia) y hay botones de omitir y
  silenciar. El resto de la app usa el patrón `Reveal` al hacer scroll.
- **Mobile first**: secciones desde `max-w-md` escalando a `sm:`/`md:`/`lg:`.

## 6. Cambios aplicados (contexto de retomar)

Último commit grande (`bf5d164`), por si necesitas rastrear decisiones:

- **Seguridad**: eliminadas las políticas `anon` de lectura; migrada la app a
  los RPC `obtener_grupo`/`submit_rsvp` con rate-limit; panel gated por
  `admin_profiles`; `revoke select` en `kpi_resumen`.
- **Cliente**: hook `useGrupoInvitacion` vía RPC con validación de UUID;
  constantes centralizadas (`config/wedding.ts`, `config/catalogos.ts`,
  `data/mesas.ts`); `buildSerieTiempo` corregido a fecha local.
- **Rendimiento**: code-splitting por ruta, `xlsx`/`jsPDF` bajo demanda,
  sourcemaps desactivados, imágenes con `width`/`height`/`fetchPriority`,
  `ParticleField` se pausa fuera del viewport, `AudioPlayer` oculta a 404.
- **Calidad**: ESLint flat config (`eslint.config.js`) en verde, Vitest +
  CI, `.env.example` restaurado, fallback SPA (Netlify/Vercel).
- **Intro realista**: física de sobre, sello fragmentado, audio sintetizado,
  luz/papel, ritmo compacto (~10 s) y carta sin zoom gigante.

## 7. Pendientes / próximos pasos

Prioridad alta (bloquean producción):

- [ ] Ejecutar `supabase/schema.sql` en el proyecto de producción y añadir a
      los organizadores a `admin_profiles` (roundtrip a `auth.users`).
- [ ] Crear `public/og-portada.png` (1200×630 aprox.) para las meta tags OG.
- [ ] Subir `public/audio/background-music.mp3` (se oculta solo si falta).
- [ ] Reemplazar las fotos de Unsplash (`Hero.tsx`, `LocationSection.tsx`)
      por fotos reales de la pareja.

Mejoras de producto:

- [ ] Importación masiva de invitados por CSV en el panel (reusar `xlsx`,
      hoy el alta es una por una).
- [ ] Envío de enlaces personalizados (`/invitacion/{access_token}`) por
      WhatsApp/email — no incluido aún.
- [ ] Ampliar la cobertura de tests de Vitest más allá de `fechas` y `stats`
      (validación del RPC, lógica de escenarios).
- [ ] Auditar quién hizo cada cambio (los admin ya pueden rastrearse vía
      `admin_profiles` + auditoría de `respondido_en`).