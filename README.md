# Lenan & Mauricio — Invitación digital premium

Invitación digital personalizada por invitado, con RSVP dinámico, panel
administrativo con KPIs en tiempo real y exportaciones. Construida con
React + TypeScript + Vite + Framer Motion + TailwindCSS en el frontend y
Supabase (PostgreSQL + RLS + Auth) en el backend.

## 1. Puesta en marcha

```bash
npm install
cp .env.example .env       # completar con tus credenciales de Supabase
npm run dev
```

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre el **SQL Editor** y ejecuta `supabase/schema.sql` completo (crea
   tipos, tablas, índices, RLS, la función `submit_rsvp` y la vista `kpi_resumen`,
   además de 2 grupos y 6 mesas de ejemplo).
3. En **Authentication → Users**, crea un usuario (email/password) para los
   novios/organizadores; ese es el acceso al panel `/admin`.
4. Copia `Project URL` y `anon public key` (Project Settings → API) a tu `.env`.

> **Modo demo sin Supabase**: si dejas `.env` vacío, la app funciona igual
> usando datos de ejemplo (`src/data/mockInvitados.ts`) para que puedas
> revisar el diseño y los 3 escenarios sin backend:
> - `/invitacion/demo-pendiente`
> - `/invitacion/demo-confirmado`
> - `/invitacion/demo-rechazado`
> El panel `/admin` también carga con KPIs y una tabla de ejemplo.

## 2. Arquitectura

### Frontend

```
src/
├── components/
│   ├── intro/            IntroSequence (RF-04, secuencia cinemática)
│   ├── shared/            Hero, Footer, OliveDivider, WaxSeal, Reveal
│   ├── scenarios/
│   │   ├── pending/       Escenario A: OurStory, FormalInvitation,
│   │   │                  CodeOfConduct, RsvpForm
│   │   ├── confirmed/     Escenario B: Countdown, LocationSection,
│   │   │                  Timeline, TableAssignment, Recommendations
│   │   └── declined/      Escenario C: ThankYouScreen
│   └── admin/             KpiCard, DashboardCharts, GuestsTable, GuestFormModal
├── pages/
│   ├── InvitationPage.tsx        resuelve token → decide escenario
│   ├── NotFoundPage.tsx
│   └── admin/                    LoginPage, AdminLayout, DashboardPage, GuestsPage
├── hooks/                        useGrupoInvitacion, useRsvp, useCountdown,
│                                  useAuth, useKpis, useGuestsAdmin
├── lib/                          supabase.ts, exportUtils.ts
├── types/domain.ts               tipos alineados 1:1 con el esquema SQL
└── data/mockInvitados.ts         datos de ejemplo para modo demo
```

**Por qué esta estructura**: cada escenario (A/B/C) es una carpeta propia
bajo `scenarios/`, así una sección nueva o un cambio de copy en un
escenario no obliga a tocar los otros dos. `InvitationPage` es la única
pieza que conoce las reglas de qué escenario mostrar; las secciones en sí
son "tontas" (reciben props, no consultan Supabase directamente), lo que
las hace reutilizables y fáciles de probar.

### Backend (Supabase)

Modelo entidad-relación (`supabase/schema.sql`):

```
mesas (1) ───┐
             │ mesa_id (FK, nullable)
             ▼
grupos_invitacion (1) ──< acompanantes (N)
       │
       │ id (referenciado por access_token en la URL pública)
       ▼
   (sin FK directa) admin_profiles ── auth.users
```

- **`grupos_invitacion`**: unidad de acceso. `access_token` (UUIDv4, único,
  indexado) es lo único que necesita el invitado para ver su invitación —
  cumple RF-01 y RF-02.
- **`acompanantes`**: uno-a-muchos con el grupo; se reescriben por completo
  en cada RSVP (ver función `submit_rsvp`).
- **`mesas`**: catálogo simple con posición `(pos_x, pos_y)` en porcentaje,
  usada tanto por el croquis del invitado como por el admin.
- **Vista `kpi_resumen`**: agrega los conteos en el servidor (RF-09) para
  no traer cientos de filas al navegador solo para sumar.
- **Función `submit_rsvp` (`SECURITY DEFINER`)**: única vía de escritura
  para el invitado. Recibe el `access_token`, valida `limite_personas` en
  el servidor (nunca confiar solo en la validación del cliente) y escribe
  estado + acompañantes de forma atómica.

### Seguridad (RF-03)

Row Level Security está habilitado en las 4 tablas. La lectura pública
(`anon`) está abierta a nivel de política porque el aislamiento real ocurre
en la capa de aplicación: el cliente **siempre** filtra por
`access_token`, y ese token es un UUIDv4 no adivinable — nunca se expone un
listado. La escritura del invitado pasa exclusivamente por `submit_rsvp`
(que primero localiza el grupo por token exacto), por lo que un invitado
no puede modificar el registro de otro grupo aunque conociera su `id`. Toda
escritura administrativa (`insert`/`update`/`delete` directos) exige
`role = authenticated`, es decir, haber iniciado sesión con Supabase Auth.

## 3. Decisiones de diseño

- **Paleta**: Pistachio (#93A27D) es el color dominante en fondos con
  degradado (`bg-leaf-fade`, `bg-olive-fade`), tarjetas, botones y el
  motivo de rama de olivo — no solo en títulos, según lo pedido.
- **Tipografía**: Fraunces (display, con cursivas cálidas) + Jost (cuerpo,
  geométrica y limpia) — evita el par por defecto "serif genérica + Inter".
- **Elemento de firma**: `OliveDivider`, una rama de olivo dibujada con
  Framer Motion (`pathLength`) que aparece en cada transición de sección,
  y el sello de cera `WaxSeal` con el monograma "L&M", reutilizado en la
  intro, el footer y las pantallas de estado.
- **Mobile first**: todas las secciones parten de `max-w-md` con padding
  vertical generoso y escalan hacia `sm:`/`md:`/`lg:` — no al revés.
- **Movimiento**: la intro cinemática es la única secuencia orquestada
  (carta → título → sello → apertura); el resto de la app usa un único
  patrón de revelado sutil al hacer scroll (`Reveal`) para no saturar de
  animaciones dispersas. Se respeta `prefers-reduced-motion`.

## 4. Próximos pasos sugeridos

- Reemplazar las fotos de Unsplash en `Hero.tsx` y `LocationSection.tsx`
  por las fotos reales de la pareja.
- Cargar la lista real de invitados vía CSV en el panel (hoy el alta es
  una por una desde `GuestFormModal`; se puede añadir una importación
  masiva reusando `xlsx` para leer el archivo).
- Enviar los enlaces personalizados (`/invitacion/{access_token}`) por
  WhatsApp o email — no está incluido en este entregable.
- Añadir un usuario `admin_profiles` por cada novio/organizador que inicie
  sesión, para poder auditar quién hizo qué cambio.
