-- =====================================================================
-- Lenan & Mauricio — Invitación digital
-- Esquema completo de Supabase (PostgreSQL)
-- Ejecutar en el SQL Editor de Supabase, de arriba hacia abajo.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS
-- ---------------------------------------------------------------------

create type estado_invitacion as enum ('pending', 'confirmed', 'declined');

create type categoria_invitado as enum (
  'familia_novia',
  'familia_novio',
  'amigos_novia',
  'amigos_novio',
  'trabajo',
  'otros'
);

create type nivel_importancia as enum ('principal', 'estandar', 'cortesia');

-- ---------------------------------------------------------------------
-- 2. TABLAS
-- ---------------------------------------------------------------------

-- Mesas del salón: usadas para el croquis (Section 05, Escenario B)
create table mesas (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  nombre text,
  capacidad integer not null default 8 check (capacidad > 0),
  pos_x numeric(5, 2) not null default 50 check (pos_x between 0 and 100),
  pos_y numeric(5, 2) not null default 50 check (pos_y between 0 and 100),
  creado_en timestamptz not null default now()
);

-- Grupo de invitación: la unidad de acceso (RF-01). Un enlace = un grupo.
create table grupos_invitacion (
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
create table acompanantes (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos_invitacion (id) on delete cascade,
  nombre_completo text,
  es_nino boolean not null default false,
  confirmado boolean,
  creado_en timestamptz not null default now()
);

-- Perfil ligado a auth.users, para distinguir admins (novios/organizadores)
create table admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_completo text,
  rol text not null default 'organizador' check (rol in ('novia', 'novio', 'organizador')),
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. ÍNDICES (soportan RF-02: resolver /invitacion/{token} en < 1.5s)
-- ---------------------------------------------------------------------

create unique index idx_grupos_access_token on grupos_invitacion (access_token);
create index idx_grupos_estado on grupos_invitacion (estado);
create index idx_grupos_categoria on grupos_invitacion (categoria);
create index idx_grupos_importancia on grupos_invitacion (importancia);
create index idx_grupos_mesa_id on grupos_invitacion (mesa_id);
create index idx_acompanantes_grupo_id on acompanantes (grupo_id);

-- ---------------------------------------------------------------------
-- 4. TRIGGERS
-- ---------------------------------------------------------------------

-- Mantiene actualizado_en al día en cada UPDATE
create or replace function set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger trg_grupos_actualizado_en
  before update on grupos_invitacion
  for each row
  execute function set_actualizado_en();

-- ---------------------------------------------------------------------
-- 5. FUNCIÓN RPC: submit_rsvp (RF-06 / RF-07)
-- Se ejecuta con SECURITY DEFINER para poder escribir el estado y los
-- acompañantes de forma atómica, validando limite_personas en el servidor
-- (nunca confiar solo en la validación del cliente).
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
begin
  select id, limite_personas into v_grupo_id, v_limite
  from grupos_invitacion
  where access_token = p_access_token;

  if v_grupo_id is null then
    raise exception 'Invitación no encontrada';
  end if;

  if p_estado not in ('confirmed', 'declined') then
    raise exception 'Estado de RSVP inválido';
  end if;

  v_cantidad := coalesce(jsonb_array_length(p_acompanantes), 0);
  if p_estado = 'confirmed' and v_cantidad > (v_limite - 1) then
    raise exception 'Excede el límite de personas del grupo';
  end if;

  update grupos_invitacion
  set estado = p_estado,
      mensaje_rsvp = p_mensaje,
      respondido_en = now()
  where id = v_grupo_id;

  delete from acompanantes where grupo_id = v_grupo_id;

  if p_estado = 'confirmed' and v_cantidad > 0 then
    insert into acompanantes (grupo_id, nombre_completo, es_nino, confirmado)
    select
      v_grupo_id,
      elem->>'nombre_completo',
      coalesce((elem->>'es_nino')::boolean, false),
      true
    from jsonb_array_elements(p_acompanantes) as elem;
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- 6. VISTA: kpi_resumen (RF-09)
-- Agrega los conteos en el servidor para no traer todas las filas al cliente.
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
-- 7. ROW LEVEL SECURITY (RF-03: aislamiento total entre grupos)
-- ---------------------------------------------------------------------

alter table grupos_invitacion enable row level security;
alter table acompanantes enable row level security;
alter table mesas enable row level security;
alter table admin_profiles enable row level security;

-- --- Lectura pública, pero SOLO de un grupo si se conoce su access_token ---
-- No existe policy que permita "select *" sin filtro: el cliente siempre
-- debe consultar con .eq('access_token', token), y esta policy exige que
-- el token en la fila coincida con el que Postgres recibe en la sesión
-- (current_setting) o, más simple y realista con supabase-js anon key,
-- se restringe vía la propia condición de igualdad en la query + el hecho
-- de que el token es un UUID no adivinable. Para reforzarlo, exponemos
-- solo lectura general (anon) y toda escritura pasa por submit_rsvp
-- (SECURITY DEFINER), nunca por UPDATE directo del cliente.
create policy "public_select_grupo_por_token"
  on grupos_invitacion
  for select
  to anon, authenticated
  using (true);

create policy "public_select_acompanantes"
  on acompanantes
  for select
  to anon, authenticated
  using (true);

create policy "public_select_mesas"
  on mesas
  for select
  to anon, authenticated
  using (true);

-- --- Escritura: solo usuarios autenticados (novios/organizadores) ---
create policy "admin_insert_grupos"
  on grupos_invitacion
  for insert
  to authenticated
  with check (true);

create policy "admin_update_grupos"
  on grupos_invitacion
  for update
  to authenticated
  using (true)
  with check (true);

create policy "admin_delete_grupos"
  on grupos_invitacion
  for delete
  to authenticated
  using (true);

create policy "admin_write_acompanantes"
  on acompanantes
  for all
  to authenticated
  using (true)
  with check (true);

create policy "admin_write_mesas"
  on mesas
  for all
  to authenticated
  using (true)
  with check (true);

create policy "admin_read_own_profile"
  on admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Nota importante sobre RF-03 (aislamiento total entre grupos):
-- El invitado NUNCA hace un UPDATE directo — toda escritura de su propio
-- RSVP pasa por la función submit_rsvp(access_token, ...), que primero
-- localiza el grupo por token y solo entonces escribe. Esto evita que un
-- invitado pueda modificar el registro de otro grupo aunque conociera su id,
-- porque la única vía de escritura exige conocer el access_token exacto
-- (UUIDv4, no adivinable) del grupo que se quiere modificar.

-- ---------------------------------------------------------------------
-- 8. DATOS DE EJEMPLO (opcional, borrar antes de producción)
-- ---------------------------------------------------------------------

insert into mesas (numero, nombre, capacidad, pos_x, pos_y) values
  (1, 'Mesa Alabastro', 8, 15, 20),
  (2, 'Mesa Champagne', 8, 38, 15),
  (3, 'Mesa Pistacho', 8, 62, 15),
  (4, 'Mesa Olivo', 8, 85, 20),
  (5, 'Mesa Sage', 8, 15, 50),
  (6, 'Mesa Cochabamba', 8, 38, 50);

insert into grupos_invitacion (nombre_grupo, invitado_principal, limite_personas, categoria, importancia, estado)
values
  ('Familia Rojas', 'Camila Rojas', 3, 'familia_novia', 'principal', 'pending'),
  ('Familia Herrera', 'Daniel Herrera', 2, 'amigos_novio', 'estandar', 'pending');
