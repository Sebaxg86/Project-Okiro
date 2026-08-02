# Modelo de Datos y Políticas RLS — Project Okiro

## Control del documento

| Campo | Valor |
|---|---|
| Proyecto | Project Okiro |
| Tipo | Especificación de datos, seguridad y persistencia |
| Versión | 1.0 |
| Estado | Base para implementación |
| Motor | PostgreSQL administrado por Supabase |
| Autenticación | Supabase Auth |
| Archivos | Supabase Storage |
| Zona horaria de negocio | Configurable por usuario; IANA |
| Semana | Lunes 00:00 a domingo 23:59:59.999, hora local del usuario |

---

## 1. Propósito

Este documento especifica el modelo relacional, restricciones, índices, funciones, RPC, políticas Row Level Security, Storage, migraciones y pruebas de Project Okiro.

La fuente de verdad de las reglas matemáticas de XP, niveles, atributos, rangos, misiones, rachas y cierre semanal es `Especificación Funcional - Sistema de XP.md`. La base de datos debe aplicar esas reglas de forma atómica, auditable e idempotente.

Principio central:

> El usuario controla sus registros fuente, pero nunca escribe directamente XP, niveles, atributos, rangos, misiones, rachas, logros ni cierres semanales.

Toda consecuencia derivada se crea mediante funciones transaccionales del servidor.

---

## 2. Convenciones obligatorias

- Identificadores: `uuid` con `gen_random_uuid()`.
- Fechas de negocio: `date`.
- Instantes: `timestamptz`, siempre UTC en persistencia.
- Duraciones: minutos enteros no negativos.
- Volúmenes: mililitros enteros no negativos.
- Puntuaciones: `numeric(6,2)` entre 0 y 100.
- XP: `integer`; positiva o negativa según el tipo de transacción.
- Nombres SQL: `snake_case`, plural para tablas.
- Toda tabla mutable incluye `created_at` y `updated_at`.
- Las tablas propiedad de una persona incluyen `user_id uuid not null`.
- No se confía en `user_id` enviado por el cliente; las RPC usan `auth.uid()`.
- No se usa borrado en cascada desde datos de negocio hacia `auth.users` salvo donde se indique.
- Las funciones privilegiadas usan `security definer set search_path = ''` y nombres calificados por esquema.
- Se revoca `execute` de funciones privilegiadas a `public` y se concede explícitamente.

---

## 3. Esquemas y extensiones

```sql
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
```

`public` contiene la API de datos expuesta por Supabase. `private` contiene funciones auxiliares, tablas de control y detalles que el cliente no debe consultar.

---

## 4. Tipos enumerados

```sql
create type public.account_status as enum ('active', 'export_pending', 'deletion_pending', 'deleted');
create type public.sex_code as enum ('unspecified', 'female', 'male', 'other');
create type public.week_status as enum ('open', 'closing', 'closed', 'failed');
create type public.workout_kind as enum ('strength', 'cardio', 'walk', 'mobility', 'sport', 'recovery', 'other');
create type public.meal_kind as enum ('breakfast', 'lunch', 'dinner', 'snack', 'other');
create type public.meal_quality as enum ('balanced', 'adequate', 'flexible', 'unregistered', 'junk', 'excess');
create type public.focus_kind as enum ('programming', 'study', 'reading', 'other');
create type public.mission_status as enum ('pending', 'completed', 'failed', 'expired', 'cancelled');
create type public.mission_frequency as enum ('daily', 'weekly', 'recovery', 'special');
create type public.xp_source_type as enum (
  'workout', 'sleep', 'meal', 'hydration', 'focus', 'daily_mission',
  'weekly_bonus', 'weekly_penalty', 'recovery', 'achievement', 'adjustment'
);
create type public.attribute_code as enum ('strength', 'vitality', 'intelligence', 'discipline', 'endurance');
create type public.rank_code as enum ('E', 'D', 'C', 'B', 'A', 'S');
create type public.notification_kind as enum ('mission', 'reminder', 'weekly_close', 'level_up', 'achievement', 'system');
create type public.export_status as enum ('requested', 'processing', 'ready', 'expired', 'failed');
create type public.deletion_status as enum ('requested', 'confirmed', 'processing', 'completed', 'cancelled', 'failed');
```

---

## 5. Identidad, perfil y preferencias

### 5.1 `profiles`

Perfil 1:1 con `auth.users`.

```sql
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_path text,
  locale text not null default 'es-MX',
  timezone text not null default 'America/Mexico_City',
  week_starts_on smallint not null default 1 check (week_starts_on between 0 and 6),
  account_status public.account_status not null default 'active',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 5.2 `user_preferences`

```sql
create table public.user_preferences (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  theme text not null default 'system' check (theme in ('system','light','dark')),
  reduced_motion boolean not null default false,
  sound_enabled boolean not null default true,
  haptics_enabled boolean not null default true,
  email_notifications boolean not null default true,
  push_notifications boolean not null default true,
  reminder_time time,
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 5.3 `user_goals`

Los objetivos se versionan. Nunca se sobrescribe el significado histórico de una semana cerrada.

```sql
create table public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  valid_from date not null,
  valid_to date,
  workout_days_per_week smallint not null default 5 check (workout_days_per_week between 0 and 7),
  focus_days_per_week smallint not null default 3 check (focus_days_per_week between 0 and 7),
  water_ml_per_day integer not null default 2500 check (water_ml_per_day between 250 and 15000),
  sleep_minutes_min integer not null default 420 check (sleep_minutes_min between 0 and 1440),
  sleep_minutes_max integer not null default 540 check (sleep_minutes_max between 0 and 1440),
  expected_main_meals smallint not null default 3 check (expected_main_meals between 0 and 8),
  created_at timestamptz not null default now(),
  created_by uuid not null default auth.uid(),
  check (valid_to is null or valid_to >= valid_from),
  check (sleep_minutes_max >= sleep_minutes_min)
);

create unique index user_goals_one_open_version
  on public.user_goals(user_id) where valid_to is null;
create index user_goals_lookup_idx on public.user_goals(user_id, valid_from desc);
```

Una restricción de exclusión o una RPC debe impedir intervalos superpuestos por usuario.

---

## 6. Ciclos semanales y reglas versionadas

### 6.1 `xp_rule_sets`

```sql
create table public.xp_rule_sets (
  id uuid primary key default gen_random_uuid(),
  version integer not null unique check (version > 0),
  name text not null,
  rules jsonb not null,
  checksum text not null,
  active_from timestamptz not null,
  retired_at timestamptz,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(rules) = 'object'),
  check (retired_at is null or retired_at > active_from)
);
```

### 6.2 `weekly_cycles`

```sql
create table public.weekly_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  week_start date not null,
  week_end date not null,
  timezone text not null,
  goal_id uuid not null references public.user_goals(id),
  rule_set_id uuid not null references public.xp_rule_sets(id),
  status public.week_status not null default 'open',
  positive_xp integer not null default 0 check (positive_xp >= 0),
  bonus_xp integer not null default 0 check (bonus_xp >= 0),
  penalty_xp_raw integer not null default 0 check (penalty_xp_raw >= 0),
  penalty_xp_applied integer not null default 0 check (penalty_xp_applied between 0 and 300),
  net_xp integer,
  consolidated_xp integer check (consolidated_xp >= 0),
  rank public.rank_code,
  score numeric(6,2) check (score between 0 and 100),
  data_coverage numeric(6,2) check (data_coverage between 0 and 100),
  closed_at timestamptz,
  close_attempts integer not null default 0,
  close_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start),
  check (week_end = week_start + 6),
  check ((status = 'closed') = (closed_at is not null))
);

create index weekly_cycles_user_status_idx on public.weekly_cycles(user_id, status, week_start desc);
```

### 6.3 `weekly_scores`

```sql
create table public.weekly_scores (
  weekly_cycle_id uuid primary key references public.weekly_cycles(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  exercise_score numeric(6,2) not null check (exercise_score between 0 and 100),
  sleep_score numeric(6,2) not null check (sleep_score between 0 and 100),
  nutrition_score numeric(6,2) not null check (nutrition_score between 0 and 100),
  hydration_score numeric(6,2) not null check (hydration_score between 0 and 100),
  focus_score numeric(6,2) not null check (focus_score between 0 and 100),
  weighted_score numeric(6,2) not null check (weighted_score between 0 and 100),
  data_coverage numeric(6,2) not null check (data_coverage between 0 and 100),
  calculation jsonb not null,
  created_at timestamptz not null default now()
);
```

---

## 7. Registros fuente

Los registros fuente son editables únicamente mientras el ciclo asociado esté abierto. Toda mutación llama una RPC que recalcula consecuencias y conserva auditoría.

### 7.1 `workout_logs`

```sql
create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  occurred_on date not null,
  started_at timestamptz,
  duration_minutes integer not null check (duration_minutes between 1 and 1440),
  kind public.workout_kind not null,
  intensity smallint check (intensity between 1 and 10),
  is_planned_recovery boolean not null default false,
  notes text check (char_length(notes) <= 2000),
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id)
);
create index workout_logs_user_date_idx on public.workout_logs(user_id, occurred_on desc);
```

### 7.2 `sleep_logs`

```sql
create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  sleep_date date not null,
  slept_at timestamptz,
  woke_at timestamptz,
  duration_minutes integer not null check (duration_minutes between 0 and 1440),
  quality smallint check (quality between 1 and 5),
  notes text check (char_length(notes) <= 2000),
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sleep_date),
  unique (user_id, client_request_id),
  check (woke_at is null or slept_at is null or woke_at > slept_at)
);
```

### 7.3 `meal_logs`

```sql
create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  occurred_at timestamptz not null,
  local_date date not null,
  meal_kind public.meal_kind not null,
  quality public.meal_quality not null,
  description text check (char_length(description) <= 1000),
  photo_path text,
  is_planned_free_meal boolean not null default false,
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id)
);
create index meal_logs_user_date_idx on public.meal_logs(user_id, local_date desc);
```

### 7.4 `hydration_logs`

```sql
create table public.hydration_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  occurred_at timestamptz not null,
  local_date date not null,
  amount_ml integer not null check (amount_ml between 1 and 5000),
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id)
);
create index hydration_logs_user_date_idx on public.hydration_logs(user_id, local_date desc);
```

### 7.5 `focus_logs`

```sql
create table public.focus_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  occurred_on date not null,
  started_at timestamptz,
  duration_minutes integer not null check (duration_minutes between 1 and 1440),
  kind public.focus_kind not null default 'programming',
  notes text check (char_length(notes) <= 2000),
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_request_id)
);
create index focus_logs_user_date_idx on public.focus_logs(user_id, occurred_on desc);
```

---

## 8. Misiones

```sql
create table public.mission_templates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  frequency public.mission_frequency not null,
  requirement jsonb not null,
  reward jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid references public.weekly_cycles(id),
  template_id uuid references public.mission_templates(id),
  mission_date date,
  title_snapshot text not null,
  requirement_snapshot jsonb not null,
  reward_snapshot jsonb not null,
  progress jsonb not null default '{}'::jsonb,
  status public.mission_status not null default 'pending',
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, template_id, mission_date)
);

create index user_missions_today_idx on public.user_missions(user_id, mission_date, status);
```

---

## 9. Libro mayor de XP

`xp_transactions` es append-only. No se actualiza ni elimina. Una corrección se representa con una transacción compensatoria enlazada.

```sql
create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  source_type public.xp_source_type not null,
  source_id uuid,
  amount integer not null check (amount <> 0),
  provisional boolean not null default true,
  idempotency_key text not null,
  rule_set_id uuid not null references public.xp_rule_sets(id),
  rule_code text not null,
  calculation jsonb not null,
  reverses_transaction_id uuid references public.xp_transactions(id),
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index xp_transactions_user_time_idx on public.xp_transactions(user_id, occurred_at desc);
create index xp_transactions_cycle_idx on public.xp_transactions(weekly_cycle_id, provisional);
create index xp_transactions_source_idx on public.xp_transactions(source_type, source_id);

create or replace function private.forbid_xp_mutation()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'xp_transactions is append-only';
end;
$$;

create trigger xp_transactions_immutable
before update or delete on public.xp_transactions
for each row execute function private.forbid_xp_mutation();
```

---

## 10. Progresión consolidada

```sql
create table public.user_progression (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  lifetime_xp bigint not null default 0 check (lifetime_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  current_level_xp integer not null default 0 check (current_level_xp >= 0),
  updated_at timestamptz not null default now()
);

create table public.attribute_balances (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  attribute public.attribute_code not null,
  xp bigint not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, attribute)
);

create table public.level_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  from_level integer not null,
  to_level integer not null,
  lifetime_xp bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, weekly_cycle_id, to_level),
  check (to_level > from_level)
);

create table public.weekly_rank_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  weekly_cycle_id uuid not null unique references public.weekly_cycles(id),
  rank public.rank_code not null,
  score numeric(6,2) not null check (score between 0 and 100),
  data_coverage numeric(6,2) not null check (data_coverage between 0 and 100),
  created_at timestamptz not null default now()
);
```

La fórmula de XP para avanzar desde el nivel `L` es `400 + 60 × (L − 1)`. El nivel jamás disminuye.

---

## 11. Rachas y logros

```sql
create table public.streaks (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  code text not null,
  current_count integer not null default 0 check (current_count >= 0),
  best_count integer not null default 0 check (best_count >= current_count),
  last_qualified_on date,
  updated_at timestamptz not null default now(),
  primary key (user_id, code)
);

create table public.achievement_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  criteria jsonb not null,
  reward jsonb not null default '{}'::jsonb,
  hidden boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  achievement_id uuid not null references public.achievement_definitions(id),
  weekly_cycle_id uuid references public.weekly_cycles(id),
  unlocked_at timestamptz not null default now(),
  evidence jsonb not null,
  primary key (user_id, achievement_id)
);
```

---

## 12. Notificaciones, exportación y eliminación

```sql
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  kind public.notification_kind not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_inbox_idx on public.notifications(user_id, read_at, created_at desc);

create table public.data_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  status public.export_status not null default 'requested',
  object_path text,
  requested_at timestamptz not null default now(),
  ready_at timestamptz,
  expires_at timestamptz,
  error text
);

create table public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  status public.deletion_status not null default 'requested',
  requested_at timestamptz not null default now(),
  confirmed_at timestamptz,
  scheduled_for timestamptz,
  completed_at timestamptz,
  error text
);
create unique index one_active_deletion_request
  on public.account_deletion_requests(user_id)
  where status in ('requested','confirmed','processing');
```

---

## 13. Auditoría e idempotencia

```sql
create table private.mutation_requests (
  user_id uuid not null,
  idempotency_key uuid not null,
  operation text not null,
  request_hash text not null,
  response jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, idempotency_key)
);

create table private.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid,
  user_id uuid,
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  request_id uuid,
  created_at timestamptz not null default now()
);
create index audit_events_user_time_idx on private.audit_events(user_id, created_at desc);
```

Una clave reutilizada con un cuerpo distinto debe fallar. Una clave reutilizada con el mismo cuerpo devuelve la respuesta almacenada sin duplicar consecuencias.

---

## 14. Funciones auxiliares

```sql
create or replace function private.current_user_id()
returns uuid language sql stable set search_path = '' as $$
  select auth.uid();
$$;

create or replace function private.is_cycle_open(p_cycle_id uuid, p_user_id uuid)
returns boolean language sql stable set search_path = '' as $$
  select exists (
    select 1 from public.weekly_cycles wc
    where wc.id = p_cycle_id
      and wc.user_id = p_user_id
      and wc.status = 'open'
  );
$$;

create or replace function private.xp_required_for_next_level(p_level integer)
returns integer language sql immutable set search_path = '' as $$
  select 400 + 60 * (greatest(p_level, 1) - 1);
$$;

create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Agregar el trigger `touch_updated_at` a todas las tablas mutables que tengan `updated_at`.

---

## 15. RPC públicas

El cliente usa RPC para las mutaciones que producen XP o cambian una entidad protegida.

| RPC | Propósito |
|---|---|
| `get_or_create_current_week()` | Obtiene el ciclo vigente con meta y reglas congeladas |
| `set_user_goals(jsonb, uuid)` | Cierra la versión anterior y crea otra sin solapamiento |
| `record_workout(jsonb, uuid)` | Crea entrenamiento y transacciones derivadas |
| `record_sleep(jsonb, uuid)` | Upsert de sueño y compensación de XP anterior |
| `record_meal(jsonb, uuid)` | Crea comida, valida comida libre y calcula XP |
| `record_hydration(jsonb, uuid)` | Registra agua y recalcula el umbral diario |
| `record_focus_session(jsonb, uuid)` | Registra enfoque con máximo diario |
| `update_source_record(text, uuid, jsonb, uuid)` | Actualiza un registro de ciclo abierto y compensa XP |
| `delete_source_record(text, uuid, uuid)` | Elimina fuente abierta y crea compensación |
| `complete_mission(uuid, uuid)` | Valida requisito; nunca confía en el cliente |
| `close_week(uuid)` | Cierre atómico e idempotente |
| `request_data_export(uuid)` | Crea trabajo de exportación |
| `request_account_deletion(uuid)` | Inicia proceso con periodo de gracia |

### 15.1 Patrón para `record_workout`

```sql
create or replace function public.record_workout(
  p_payload jsonb,
  p_idempotency_key uuid
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_cycle public.weekly_cycles;
  v_log public.workout_logs;
  v_hash text := encode(extensions.digest(p_payload::text, 'sha256'), 'hex');
  v_xp integer;
begin
  if v_user is null then raise exception 'authentication required' using errcode = '28000'; end if;

  insert into private.mutation_requests(user_id,idempotency_key,operation,request_hash)
  values (v_user,p_idempotency_key,'record_workout',v_hash)
  on conflict do nothing;

  if not found then
    if exists(select 1 from private.mutation_requests where user_id=v_user and idempotency_key=p_idempotency_key and request_hash<>v_hash) then
      raise exception 'idempotency key reused with different payload';
    end if;
    return (select response from private.mutation_requests where user_id=v_user and idempotency_key=p_idempotency_key);
  end if;

  select * into v_cycle
  from public.weekly_cycles
  where user_id=v_user and status='open'
  order by week_start desc limit 1
  for update;
  if not found then raise exception 'open weekly cycle not found'; end if;

  v_xp := private.calculate_workout_xp(p_payload, v_cycle.rule_set_id);

  insert into public.workout_logs(
    user_id,weekly_cycle_id,occurred_on,duration_minutes,kind,intensity,
    is_planned_recovery,notes,client_request_id
  ) values (
    v_user,v_cycle.id,(p_payload->>'occurred_on')::date,
    (p_payload->>'duration_minutes')::integer,
    (p_payload->>'kind')::public.workout_kind,
    nullif(p_payload->>'intensity','')::smallint,
    coalesce((p_payload->>'is_planned_recovery')::boolean,false),
    p_payload->>'notes',p_idempotency_key
  ) returning * into v_log;

  insert into public.xp_transactions(
    user_id,weekly_cycle_id,source_type,source_id,amount,idempotency_key,
    rule_set_id,rule_code,calculation,occurred_at
  ) values (
    v_user,v_cycle.id,'workout',v_log.id,v_xp,
    'workout:'||v_log.id::text,v_cycle.rule_set_id,'WORKOUT_BASE',
    jsonb_build_object('payload',p_payload,'xp',v_xp),now()
  );

  update private.mutation_requests
  set response=jsonb_build_object('workout_id',v_log.id,'xp',v_xp), completed_at=now()
  where user_id=v_user and idempotency_key=p_idempotency_key;

  return jsonb_build_object('workout_id',v_log.id,'xp',v_xp);
end;
$$;

revoke all on function public.record_workout(jsonb,uuid) from public;
grant execute on function public.record_workout(jsonb,uuid) to authenticated;
```

`private.calculate_workout_xp` representa la implementación versionada de las reglas del documento de XP.

### 15.2 Cierre semanal

`close_week` debe ejecutar en una sola transacción:

1. Tomar `pg_advisory_xact_lock(hashtextextended(user_id || week_start, 0))`.
2. Bloquear la fila de `weekly_cycles` con `for update`.
3. Devolver el resultado existente si ya está `closed`.
4. Cambiar temporalmente a `closing` e incrementar `close_attempts`.
5. Calcular cobertura y cinco pilares con el conjunto de reglas congelado.
6. Crear bonificaciones y penalizaciones semanales con claves idempotentes.
7. Limitar penalización aplicada a 300 XP.
8. Calcular `net_xp` y `consolidated_xp = greatest(0, net_xp)`.
9. Marcar como definitivas las transacciones provisionales.
10. Actualizar progresión sin permitir que nivel o XP histórica disminuyan.
11. Actualizar atributos, rango, rachas y logros.
12. Insertar eventos de subida de nivel y notificaciones.
13. Marcar `closed` y asignar `closed_at`.
14. Crear el siguiente ciclo con la meta y regla vigentes.

Ningún resultado parcial puede quedar confirmado si un paso falla.

---

## 16. Row Level Security

### 16.1 Matriz de acceso

| Grupo | SELECT | INSERT/UPDATE/DELETE directo |
|---|---|---|
| Perfil y preferencias | Propio | Propio, columnas limitadas |
| Objetivos | Propios | Solo mediante RPC |
| Registros fuente | Propios | Solo mediante RPC |
| Ciclos y puntuaciones | Propios | Nunca |
| Misiones asignadas | Propias | Nunca |
| XP y progresión | Propios | Nunca |
| Rangos, rachas y logros | Propios | Nunca |
| Notificaciones | Propias | Solo marcar lectura |
| Exportaciones y eliminación | Propias | Solo mediante RPC |
| Catálogos públicos | Todos autenticados | Nunca |
| Tablas `private` | Nunca | Nunca |

### 16.2 Activación

```sql
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_goals enable row level security;
alter table public.weekly_cycles enable row level security;
alter table public.weekly_scores enable row level security;
alter table public.workout_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.meal_logs enable row level security;
alter table public.hydration_logs enable row level security;
alter table public.focus_logs enable row level security;
alter table public.mission_templates enable row level security;
alter table public.user_missions enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.user_progression enable row level security;
alter table public.attribute_balances enable row level security;
alter table public.level_events enable row level security;
alter table public.weekly_rank_history enable row level security;
alter table public.streaks enable row level security;
alter table public.achievement_definitions enable row level security;
alter table public.user_achievements enable row level security;
alter table public.notifications enable row level security;
alter table public.data_exports enable row level security;
alter table public.account_deletion_requests enable row level security;
```

### 16.3 Políticas representativas

```sql
create policy profiles_select_own on public.profiles
for select to authenticated using ((select auth.uid()) = user_id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy preferences_all_own on public.user_preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy goals_select_own on public.user_goals
for select to authenticated using ((select auth.uid()) = user_id);

create policy cycles_select_own on public.weekly_cycles
for select to authenticated using ((select auth.uid()) = user_id);

create policy scores_select_own on public.weekly_scores
for select to authenticated using ((select auth.uid()) = user_id);

create policy workout_select_own on public.workout_logs
for select to authenticated using ((select auth.uid()) = user_id);
create policy sleep_select_own on public.sleep_logs
for select to authenticated using ((select auth.uid()) = user_id);
create policy meal_select_own on public.meal_logs
for select to authenticated using ((select auth.uid()) = user_id);
create policy hydration_select_own on public.hydration_logs
for select to authenticated using ((select auth.uid()) = user_id);
create policy focus_select_own on public.focus_logs
for select to authenticated using ((select auth.uid()) = user_id);

create policy mission_templates_read on public.mission_templates
for select to authenticated using (active);
create policy user_missions_select_own on public.user_missions
for select to authenticated using ((select auth.uid()) = user_id);

create policy xp_select_own on public.xp_transactions
for select to authenticated using ((select auth.uid()) = user_id);
create policy progression_select_own on public.user_progression
for select to authenticated using ((select auth.uid()) = user_id);
create policy attributes_select_own on public.attribute_balances
for select to authenticated using ((select auth.uid()) = user_id);
create policy levels_select_own on public.level_events
for select to authenticated using ((select auth.uid()) = user_id);
create policy ranks_select_own on public.weekly_rank_history
for select to authenticated using ((select auth.uid()) = user_id);
create policy streaks_select_own on public.streaks
for select to authenticated using ((select auth.uid()) = user_id);

create policy achievement_catalog_read on public.achievement_definitions
for select to authenticated using (active and not hidden);
create policy user_achievements_select_own on public.user_achievements
for select to authenticated using ((select auth.uid()) = user_id);

create policy notifications_select_own on public.notifications
for select to authenticated using ((select auth.uid()) = user_id);
create policy notifications_update_own on public.notifications
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy exports_select_own on public.data_exports
for select to authenticated using ((select auth.uid()) = user_id);
create policy deletions_select_own on public.account_deletion_requests
for select to authenticated using ((select auth.uid()) = user_id);
```

No crear políticas de escritura para tablas derivadas. Que una fila tenga `user_id = auth.uid()` no significa que el usuario pueda alterar su XP.

### 16.4 Privilegios de columnas

RLS controla filas, no columnas. Para perfiles y notificaciones se debe:

- Revocar `update` general.
- Conceder solo columnas editables, o preferir RPC.
- Impedir que el cliente cambie `account_status`, `created_at`, propiedad y campos de sistema.

```sql
revoke update on public.profiles from authenticated;
grant update(display_name, avatar_path, locale, timezone, week_starts_on) on public.profiles to authenticated;

revoke update on public.notifications from authenticated;
grant update(read_at) on public.notifications to authenticated;
```

---

## 17. Supabase Storage

Buckets privados:

| Bucket | Ruta | Límite | Tipos |
|---|---|---:|---|
| `avatars` | `{user_id}/avatar.{ext}` | 5 MB | JPEG, PNG, WebP |
| `meal-photos` | `{user_id}/{year}/{month}/{uuid}.{ext}` | 10 MB | JPEG, PNG, WebP |
| `exports` | `{user_id}/{export_id}.zip` | 250 MB | ZIP |

```sql
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values
('avatars','avatars',false,5242880,array['image/jpeg','image/png','image/webp']),
('meal-photos','meal-photos',false,10485760,array['image/jpeg','image/png','image/webp']),
('exports','exports',false,262144000,array['application/zip'])
on conflict (id) do nothing;
```

### 17.1 Avatares

```sql
create policy avatars_select_own on storage.objects
for select to authenticated
using (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);

create policy avatars_insert_own on storage.objects
for insert to authenticated
with check (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);

create policy avatars_update_own on storage.objects
for update to authenticated
using (bucket_id='avatars' and owner_id=(select auth.uid())::text)
with check (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);

create policy avatars_delete_own on storage.objects
for delete to authenticated
using (bucket_id='avatars' and owner_id=(select auth.uid())::text);
```

### 17.2 Fotos de comida

Aplicar el mismo patrón de carpeta y propietario para `meal-photos`. La RPC que asocia la imagen debe validar que la ruta pertenece al usuario y que el registro está en un ciclo abierto.

### 17.3 Exportaciones

El usuario solo tiene `select` sobre su carpeta. La escritura y eliminación corresponden a un proceso de servidor. La descarga usa una URL firmada de corta duración; nunca se hace público el bucket.

```sql
create policy exports_select_own on storage.objects
for select to authenticated
using (bucket_id='exports' and (storage.foldername(name))[1]=(select auth.uid())::text);
```

---

## 18. Alta de usuario

Un trigger mínimo crea perfil, preferencias, progresión y atributos. No debe depender de datos no confiables sin validarlos.

```sql
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(user_id,display_name)
  values (new.id, left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1), 'Jugador'),80));
  insert into public.user_preferences(user_id) values (new.id);
  insert into public.user_progression(user_id) values (new.id);
  insert into public.attribute_balances(user_id,attribute)
  select new.id, x from unnest(enum_range(null::public.attribute_code)) x;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();
```

El onboarding crea la primera versión de objetivos y el primer ciclo mediante una RPC idempotente.

---

## 19. Cron y operaciones programadas

El trabajo programado corre cada hora para cubrir zonas horarias y llama una función privada que:

- Encuentra ciclos abiertos cuyo domingo local ya terminó.
- Procesa lotes limitados con `for update skip locked`.
- Ejecuta `close_week` por ciclo.
- Registra fallos sin duplicar resultados.
- Reintenta con backoff.
- Emite una alerta tras el máximo de intentos.

La clave idempotente de cierre es `weekly-close:{cycle_id}`.

---

## 20. Estrategia de migraciones

Orden obligatorio:

1. Extensiones y esquemas.
2. Enumeraciones.
3. Tablas de identidad y objetivos.
4. Ciclos y reglas.
5. Registros fuente.
6. Misiones.
7. Libro mayor y progresión.
8. Rachas, logros y notificaciones.
9. Exportación, eliminación y auditoría.
10. Índices y restricciones.
11. Funciones privadas.
12. RPC públicas.
13. Triggers.
14. RLS y privilegios.
15. Storage.
16. Seeds.
17. Cron.

Reglas:

- Una migración aplicada nunca se modifica; se crea otra.
- Cada migración tiene `up` verificable y plan de reversión documentado.
- Cambios destructivos usan expandir/migrar/contraer.
- Los backfills son reanudables e idempotentes.
- Se prueba desde una base vacía y desde una copia anonimizada de la versión anterior.
- Los tipos generados de TypeScript se actualizan después de migrar.
- El CI falla ante diferencias no versionadas del esquema.

---

## 21. Seeds

Los seeds incluyen:

- Conjunto de reglas XP versión 1 con checksum estable.
- Plantillas de misiones diarias y semanales.
- Definiciones de logros.
- Usuario A y usuario B solo en entorno local.
- Ciclos abiertos, cerrados y casos límite.

Los seeds no contienen secretos ni datos personales reales y pueden ejecutarse más de una vez.

---

## 22. Pruebas obligatorias

### 22.1 RLS con dos usuarios

Para Usuario A y Usuario B:

1. A puede leer sus filas.
2. A no puede leer ninguna fila de B.
3. A no puede insertar una fila con `user_id = B`.
4. A no puede cambiar propiedad de una fila.
5. A no puede escribir XP, nivel, atributos, rango, misiones, rachas o logros.
6. `anon` no accede a datos privados.
7. Los catálogos muestran únicamente entradas activas permitidas.
8. Una URL firmada de A no revela listados ni rutas de B.

### 22.2 Integridad e idempotencia

- Repetir la misma RPC con misma clave y payload devuelve la misma respuesta.
- Reutilizar clave con payload distinto falla.
- Dos cierres concurrentes producen un único resultado.
- Reejecutar un cierre cerrado no altera saldos.
- Una edición crea compensación; no modifica el ledger.
- No se puede editar un registro de una semana cerrada.
- Una excepción a mitad de cierre revierte toda la transacción.
- El máximo semanal de penalización es 300.
- La XP consolidada nunca es negativa.
- El nivel nunca disminuye.

### 22.3 Fechas y zona horaria

- Cambio de horario de verano.
- Registro cerca de medianoche.
- Viaje y cambio posterior de zona horaria.
- Año nuevo y semana ISO.
- Febrero bisiesto.
- Domingo 23:59 y lunes 00:00 local.
- La semana histórica conserva la zona con la que fue creada.

### 22.4 Storage

- Rechazo por MIME no permitido.
- Rechazo por tamaño.
- Rechazo por carpeta de otro usuario.
- Eliminación de archivo propio.
- Exportación inaccesible tras expirar.
- Limpieza de objetos huérfanos.

### 22.5 Rendimiento

- Dashboard diario con menos de 20 consultas y sin N+1.
- Historial paginado por cursor.
- Índices utilizados en consultas por usuario/fecha.
- Cierre masivo procesado por lotes.
- `explain analyze` guardado para consultas críticas.

---

## 23. Observabilidad y recuperación

- Toda RPC registra `request_id`, duración y código de error sin contenido sensible.
- Los fallos de cierre incluyen `cycle_id`, intento y etapa.
- Se alertan errores repetidos de Cron y exportaciones.
- Se habilitan respaldos administrados y recuperación a un punto en el tiempo según el plan.
- Se ensaya restauración periódicamente.
- Los logs no contienen notas privadas, tokens, fotos ni payloads completos.
- El rol de servicio solo vive en procesos del servidor; jamás en el navegador.

---

## 24. Criterios de aceptación

La implementación se acepta cuando:

- [ ] Todas las tablas, claves, restricciones e índices definidos existen.
- [ ] RLS está activa en toda tabla expuesta.
- [ ] Usuario A no puede consultar ni mutar datos de Usuario B.
- [ ] El cliente no puede escribir directamente datos derivados.
- [ ] Las RPC derivan identidad exclusivamente de `auth.uid()`.
- [ ] Las funciones privilegiadas fijan `search_path` vacío y califican nombres.
- [ ] El ledger es inmutable y las correcciones son compensatorias.
- [ ] El cierre semanal es atómico, concurrentemente seguro e idempotente.
- [ ] Semanas cerradas preservan regla, meta y zona horaria histórica.
- [ ] XP consolidada y nivel nunca disminuyen.
- [ ] Storage valida bucket, carpeta, propietario, tamaño y MIME.
- [ ] Exportaciones son privadas, firmadas y expiran.
- [ ] Migraciones funcionan desde cero y sobre la versión anterior.
- [ ] Seeds son repetibles.
- [ ] Pruebas unitarias, integración, RLS y concurrencia pasan en CI.
- [ ] Existe monitoreo para cierres, exportaciones y eliminaciones fallidas.
- [ ] La eliminación de cuenta retira datos y objetos de Storage conforme a la política definida.
- [ ] No existen secretos de servidor en el frontend.
- [ ] Los tipos de base de datos de TypeScript están actualizados.

---

## 25. Instrucciones para agentes de implementación

1. Leer este documento y la especificación del sistema de XP antes de editar el esquema.
2. No simplificar el ledger a un contador mutable.
3. No crear políticas generales `for all` en tablas derivadas.
4. No aceptar `user_id`, XP, nivel, rango o estado calculado desde el cliente.
5. No usar `service_role` para operaciones normales del usuario.
6. Implementar primero migraciones y pruebas RLS; después la interfaz.
7. Mantener cada cambio de regla versionado y reproducible.
8. Agregar pruebas con dos usuarios a cada tabla nueva.
9. Documentar toda desviación mediante una decisión arquitectónica.
10. Considerar incompleta cualquier función sin prueba de idempotencia y concurrencia cuando corresponda.

---

## 26. Decisiones invariables

- El nivel histórico es permanente.
- El rango refleja la semana, no la trayectoria completa.
- La falta de datos se distingue del incumplimiento.
- Una semana cerrada es inmutable.
- Un cambio futuro de reglas no reescribe semanas anteriores.
- Un mal día no crea deuda de XP para semanas futuras.
- La seguridad se aplica en PostgreSQL, no solo en la interfaz.
- El ledger explica cada punto de XP mediante fuente, regla, cálculo e idempotencia.
- El sistema privilegia consistencia, auditabilidad y recuperación sobre atajos de implementación.

