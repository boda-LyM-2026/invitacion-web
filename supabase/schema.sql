-- =====================================================================
-- Lenan & Mauricio — Invitación digital
-- Esquema completo de Supabase (PostgreSQL)
--
-- Diseñado para ser RE-EJECUTABLE (idempotente): se puede correr entero
-- en el SQL Editor de Supabase varias veces sin errores ni duplicados.
--
-- Modelo de seguridad (RF-03):
--   * El invitado SOLO entra por dos funciones RPC: obtener_grupo (lectura)
--     y submit_rsvp (escritura). Ambas son SECURITY DEFINER con
--     `set search_path = public` y localizan el grupo por access_token exacto.
--   * NO existen policies de lectura pública: `anon` no puede consultar
--     tablas directamente (RLS sin policy = cero filas).
--   * Toda lectura/escritura administrativa exige estar autenticado Y
--     tener una fila propia en admin_profiles (novia/novio/organizador).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS (idempotente)
-- ---------------------------------------------------------------------

do $$
begin
  if to_regtype('estado_invitacion') is null then
    create type estado_invitacion as enum ('pending', 'confirmed', 'declined');
  end if;
  if to_regtype('categoria_invitado') is null then
    create type categoria_invitado as enum (
      'familia_novia',
      'familia_novio',
      'amigos_novia',
      'amigos_novio',
      'trabajo',
      'otros'
    );
  end if;
  if to_regtype('nivel_importancia') is null then
    create type nivel_importancia as enum ('principal', 'estandar', 'cortesia');
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2. TABLAS (idempotente)
-- ---------------------------------------------------------------------

-- Mesas del salón: catálogo usado por el panel y para el croquis.
create table if not exists mesas (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  nombre text,
  capacidad integer not null default 8 check (capacidad > 0),
  pos_x numeric(5, 2) not null default 50 check (pos_x between 0 and 100),
  pos_y numeric(5, 2) not null default 50 check (pos_y between 0 and 100),
  creado_en timestamptz not null default now()
);

-- Grupo de invitación: la unidad de acceso (RF-01). Un enlace = un grupo.
create table if not exists grupos_invitacion (
  id uuid primary key default gen_random_uuid(),
  access_token uuid not null unique default gen_random_uuid(),
  nombre_grupo text not null,
  invitado_principal text not null,
  limite_personas integer not null default 1 check (limite_personas >= 1),
  categoria categoria_invitado not null default 'otros',
  importancia nivel_importancia not null default 'estandar',
  estado estado_invitacion not null default 'pending',
  mesa_id uuid references mesas (id) on delete set null,
  mensaje_rsvp text,
  respondido_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Acompañantes de un grupo: RF-07 (precarga si existen, campos vacíos si no)
create table if not exists acompanantes (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos_invitacion (id) on delete cascade,
  nombre_completo text,
  es_nino boolean not null default false,
  confirmado boolean,
  creado_en timestamptz not null default now()
);

-- Perfil ligado a auth.users: un usuario SOLO es admin si tiene fila aquí.
-- Los primeros admins se dan de alta desde el Dashboard de Supabase
-- (service_role) con su `auth.users.id` (ver sección de README).
create table if not exists admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_completo text,
  rol text not null default 'organizador' check (rol in ('novia', 'novio', 'organizador')),
  creado_en timestamptz not null default now()
);

-- Registro de intentos de RSVP por grupo (rate-limit, RF-06).
create table if not exists rsvp_intentos (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos_invitacion (id) on delete cascade,
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. ÍNDICES (idempotente)
--    Nota: access_token ya está indexado por su constraint UNIQUE; el
--    índice implícito resultante es el que usa la búsqueda por token.
-- ---------------------------------------------------------------------

create index if not exists idx_grupos_estado on grupos_invitacion (estado);
create index if not exists idx_grupos_categoria on grupos_invitacion (categoria);
create index if not exists idx_grupos_importancia on grupos_invitacion (importancia);
create index if not exists idx_grupos_mesa_id on grupos_invitacion (mesa_id);
create index if not exists idx_acompanantes_grupo_id on acompanantes (grupo_id);
create index if not exists idx_rsvp_intentos_grupo_creado
  on rsvp_intentos (grupo_id, creado_en);

-- ---------------------------------------------------------------------
-- 4. TRIGGERS (idempotente)
-- ---------------------------------------------------------------------

create or replace function set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_grupos_actualizado_en on grupos_invitacion;
create trigger trg_grupos_actualizado_en
  before update on grupos_invitacion
  for each row
  execute function set_actualizado_en();

-- ---------------------------------------------------------------------
-- 5. FUNCIÓN RPC: submit_rsvp (RF-06 / RF-07) — ÚNICA vía de escritura
-- del invitado. SECURITY DEFINER para escribir estado + acompañantes de
-- forma atómica validando limite_personas EN EL SERVIDOR, y con rate-limit.
-- ---------------------------------------------------------------------

create or replace function submit_rsvp(
  p_access_token uuid,
  p_estado estado_invitacion,
  p_mensaje text,
  p_acompanantes jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grupo_id uuid;
  v_limite integer;
  v_cantidad integer;
  v_intentos integer;
  v_nuevo_mensaje text;
begin
  -- Localiza el grupo por token EXACTO: un invitado solo puede escribir
  -- sobre su propio grupo aunque conociera ids de otros.
  select id, limite_personas into v_grupo_id, v_limite
  from grupos_invitacion
  where access_token = p_access_token;

  if v_grupo_id is null then
    raise exception 'Invitación no encontrada';
  end if;

  -- Anti-abuso: máximo 10 envíos de RSVP por grupo en la última hora.
  select count(*) into v_intentos
  from rsvp_intentos
  where grupo_id = v_grupo_id
    and creado_en > now() - interval '1 hour';
  if v_intentos >= 10 then
    raise exception 'Demasiados intentos. Intenta de nuevo más tarde.';
  end if;
  insert into rsvp_intentos (grupo_id) values (v_grupo_id);

  if p_estado not in ('confirmed', 'declined') then
    raise exception 'Estado de RSVP inválido';
  end if;

  if p_acompanantes is not null and jsonb_typeof(p_acompanantes) <> 'array' then
    raise exception 'Acompañantes inválidos';
  end if;

  v_cantidad := coalesce(jsonb_array_length(p_acompanantes), 0);
  if p_estado = 'confirmed' and v_cantidad > (v_limite - 1) then
    raise exception 'Excede el límite de personas del grupo';
  end if;

  v_nuevo_mensaje := nullif(btrim(coalesce(p_mensaje, '')), '');
  if length(v_nuevo_mensaje) > 500 then
    raise exception 'El mensaje es demasiado largo';
  end if;

  update grupos_invitacion
  set estado = p_estado,
      mensaje_rsvp = v_nuevo_mensaje,
      respondido_en = now()
  where id = v_grupo_id;

  delete from acompanantes where grupo_id = v_grupo_id;

  if p_estado = 'confirmed' and v_cantidad > 0 then
    insert into acompanantes (grupo_id, nombre_completo, es_nino, confirmado)
    select
      v_grupo_id,
      left(nullif(btrim(elem->>'nombre_completo'), ''), 120),
      coalesce((elem->>'es_nino')::boolean, false),
      true
    from jsonb_array_elements(p_acompanantes) as elem
    where btrim(coalesce(elem->>'nombre_completo', '')) <> '';
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- 6. FUNCIÓN RPC: obtener_grupo (RF-02) — ÚNICA vía de lectura del invitado.
-- Devuelve el grupo + acompañantes + mesa en un solo jsonb. Devuelve NULL
-- si el token no existe. SECURITY DEFINER con search_path fijo.
-- ---------------------------------------------------------------------

create or replace function obtener_grupo(p_access_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grupo grupos_invitacion%rowtype;
  v_json jsonb;
begin
  select * into v_grupo
  from grupos_invitacion
  where access_token = p_access_token;

  if not found then
    return null;
  end if;

  select jsonb_build_object(
    'id', g.id,
    'access_token', g.access_token,
    'nombre_grupo', g.nombre_grupo,
    'invitado_principal', g.invitado_principal,
    'limite_personas', g.limite_personas,
    'categoria', g.categoria,
    'importancia', g.importancia,
    'estado', g.estado,
    'mesa_id', g.mesa_id,
    'mensaje_rsvp', g.mensaje_rsvp,
    'respondido_en', g.respondido_en,
    'creado_en', g.creado_en,
    'acompanantes', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', a.id,
            'grupo_id', a.grupo_id,
            'nombre_completo', a.nombre_completo,
            'es_nino', a.es_nino,
            'confirmado', a.confirmado
          )
          order by a.creado_en, a.id
        )
        from acompanantes a
        where a.grupo_id = g.id
      ),
      '[]'::jsonb
    ),
    'mesa', (select to_jsonb(m) from mesas m where m.id = g.mesa_id)
  ) into v_json
  from grupos_invitacion g
  where g.id = v_grupo.id;

  return v_json;
end;
$$;

-- ---------------------------------------------------------------------
-- 7. VISTA: kpi_resumen (RF-09)
-- Agrega los conteos en el servidor; SOLO admin autenticado la consulta.
-- ---------------------------------------------------------------------

create or replace view kpi_resumen as
select
  count(*)::int as total_grupos,
  coalesce(sum(limite_personas), 0)::int as total_personas_esperadas,
  count(*) filter (where estado = 'confirmed')::int as confirmados_grupos,
  coalesce(
    sum(
      case when estado = 'confirmed'
        then 1 + (select count(*) from acompanantes a where a.grupo_id = g.id)
        else 0
      end
    ), 0
  )::int as confirmados_personas,
  count(*) filter (where estado = 'declined')::int as rechazados_grupos,
  count(*) filter (where estado = 'pending')::int as pendientes_grupos,
  round(
    100.0 * count(*) filter (where estado = 'confirmed') / greatest(count(*), 1), 1
  ) as tasa_confirmacion,
  round(
    100.0 * count(*) filter (where estado = 'declined') / greatest(count(*), 1), 1
  ) as tasa_rechazo
from grupos_invitacion g;

-- ---------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RF-03: aislamiento total entre grupos)
-- ---------------------------------------------------------------------

alter table grupos_invitacion enable row level security;
alter table acompanantes enable row level security;
alter table mesas enable row level security;
alter table admin_profiles enable row level security;
alter table rsvp_intentos enable row level security;

-- --- anon: sin policies de lectura/escritura sobre tablas. La única
-- puerta de entrada del invitado son las funciones RPC (owner via
-- SECURITY DEFINER), que localizan por access_token exacto. ---

-- --- Admin (novios/organizadores): todo pasa por tener una fila propia
-- en admin_profiles. `using`/`with check` evalúa la subconsulta bajo RLS
-- de admin_profiles (cada admin puede leer su propia fila), así que un
-- usuario autenticado sin perfil NO puede leer ni escribir nada. ---

drop policy if exists admin_select_grupos on grupos_invitacion;
create policy admin_select_grupos
  on grupos_invitacion
  for select
  to authenticated
  using (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_insert_grupos on grupos_invitacion;
create policy admin_insert_grupos
  on grupos_invitacion
  for insert
  to authenticated
  with check (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_update_grupos on grupos_invitacion;
create policy admin_update_grupos
  on grupos_invitacion
  for update
  to authenticated
  using (exists (select 1 from admin_profiles ap where ap.id = auth.uid()))
  with check (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_delete_grupos on grupos_invitacion;
create policy admin_delete_grupos
  on grupos_invitacion
  for delete
  to authenticated
  using (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_write_acompanantes on acompanantes;
create policy admin_write_acompanantes
  on acompanantes
  for all
  to authenticated
  using (exists (select 1 from admin_profiles ap where ap.id = auth.uid()))
  with check (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_write_mesas on mesas;
create policy admin_write_mesas
  on mesas
  for all
  to authenticated
  using (exists (select 1 from admin_profiles ap where ap.id = auth.uid()))
  with check (exists (select 1 from admin_profiles ap where ap.id = auth.uid()));

drop policy if exists admin_read_own_profile on admin_profiles;
create policy admin_read_own_profile
  on admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- 9. PRIVILEGIOS
--    * Funciones RPC ejecutables por anon/authenticated (puerta de entrada).
--    * kpi_resumen queda fuera del alcance de anon (aggres sin PII, pero
--      solo lo consume el panel admin).
-- ---------------------------------------------------------------------

revoke select on kpi_resumen from anon;

grant execute on function submit_rsvp(uuid, estado_invitacion, text, jsonb) to anon, authenticated;
grant execute on function obtener_grupo(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 10. DATOS DE EJEMPLO (idempotente — no duplica si ya existen)
-- ---------------------------------------------------------------------

insert into mesas (numero, nombre, capacidad, pos_x, pos_y) values
  (1,  'Mesa Alabastro',  8, 15, 20),
  (2,  'Mesa Champagne',  8, 38, 15),
  (3,  'Mesa Pistacho',   8, 62, 15),
  (4,  'Mesa Olivo',      8, 85, 20),
  (5,  'Mesa Sage',       8, 15, 50),
  (6,  'Mesa Cochabamba', 8, 38, 50),
  (7,  'Mesa Jardín',     8, 62, 50),
  (8,  'Mesa Vino',       8, 85, 50),
  (9,  'Mesa Azahar',     8, 25, 80),
  (10, 'Mesa Romero',     8, 50, 80),
  (11, 'Mesa Lavanda',    8, 75, 80)
on conflict (numero) do nothing;

insert into grupos_invitacion (nombre_grupo, invitado_principal, limite_personas, categoria, importancia, estado)
select * from (values
  ('Familia Rojas', 'Camila Rojas', 3, 'familia_novia'::categoria_invitado, 'principal'::nivel_importancia, 'pending'::estado_invitacion),
  ('Familia Herrera', 'Daniel Herrera', 2, 'amigos_novio'::categoria_invitado, 'estandar'::nivel_importancia, 'pending'::estado_invitacion)
) as v (nombre_grupo, invitado_principal, limite_personas, categoria, importancia, estado)
where not exists (select 1 from grupos_invitacion);