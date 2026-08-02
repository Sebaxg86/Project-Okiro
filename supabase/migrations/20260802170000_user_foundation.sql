-- Okiro user foundation: profile, onboarding goals, weekly cycle and weight history.

create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  display_name text not null check (char_length(display_name) between 2 and 40),
  username text,
  avatar_path text,
  birth_date date check (birth_date is null or birth_date >= date '1900-01-01'),
  timezone text not null default 'UTC' check (char_length(timezone) between 1 and 64),
  locale text not null default 'es-MX',
  unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')),
  onboarding_completed_at timestamptz,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'system' check (theme in ('system', 'dark')),
  week_starts_on smallint not null default 1 check (week_starts_on between 1 and 7),
  time_format text not null default '24h' check (time_format in ('12h', '24h')),
  date_format text not null default 'dd/MM/yyyy',
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goal_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  effective_from date not null,
  effective_until date,
  exercise_days_target numeric(2,1) not null default 5 check (exercise_days_target between 0 and 7),
  programming_days_target integer not null default 3 check (programming_days_target between 0 and 7),
  hydration_target_ml integer not null default 2500 check (hydration_target_ml between 250 and 10000),
  sleep_min_minutes integer not null default 420 check (sleep_min_minutes between 180 and 900),
  sleep_max_minutes integer not null default 540 check (sleep_max_minutes between 180 and 900),
  sleep_target_time time not null default time '23:30',
  sleep_tolerance_minutes integer not null default 45 check (sleep_tolerance_minutes between 0 and 240),
  expected_main_meals integer not null default 3 check (expected_main_meals between 1 and 8),
  flexible_meals_per_week integer not null default 2 check (flexible_meals_per_week between 0 and 21),
  created_at timestamptz not null default now(),
  check (effective_until is null or effective_until >= effective_from),
  check (sleep_max_minutes >= sleep_min_minutes)
);

create unique index goal_versions_one_current_per_user
  on public.goal_versions (user_id)
  where effective_until is null;

create index goal_versions_user_effective_from
  on public.goal_versions (user_id, effective_from desc);

create table public.weekly_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  timezone text not null,
  goal_version_id uuid not null references public.goal_versions(id),
  status text not null default 'open' check (status in ('open', 'pending_close', 'closed', 'adjusted')),
  opened_at timestamptz not null default now(),
  scheduled_close_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start),
  check (week_end >= week_start)
);

create index weekly_cycles_user_status
  on public.weekly_cycles (user_id, status);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(5,2) not null check (weight_kg between 20 and 500),
  source text not null default 'manual' check (source in ('signup', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

create index weight_entries_user_date
  on public.weight_entries (user_id, measured_on desc);

create table public.user_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_level integer not null default 1 check (current_level >= 1),
  total_consolidated_xp bigint not null default 0 check (total_consolidated_xp >= 0),
  current_level_xp integer not null default 0 check (current_level_xp >= 0),
  xp_required_for_next_level integer not null default 400 check (xp_required_for_next_level > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

create trigger weekly_cycles_set_updated_at
before update on public.weekly_cycles
for each row execute function public.set_updated_at();

create trigger weight_entries_set_updated_at
before update on public.weight_entries
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_full_name text;
  v_display_name text;
  v_birth_date date;
  v_weight_kg numeric(5,2);
  v_timezone text;
begin
  v_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(new.email, '@', 1)
  );
  v_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    v_full_name
  );
  v_timezone := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'timezone'), ''),
    'UTC'
  );

  if pg_input_is_valid(new.raw_user_meta_data ->> 'birth_date', 'date') then
    v_birth_date := (new.raw_user_meta_data ->> 'birth_date')::date;
  end if;

  if pg_input_is_valid(new.raw_user_meta_data ->> 'weight_kg', 'numeric') then
    v_weight_kg := (new.raw_user_meta_data ->> 'weight_kg')::numeric(5,2);
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    display_name,
    birth_date,
    timezone,
    terms_accepted_at,
    privacy_accepted_at,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    left(v_full_name, 120),
    left(v_display_name, 40),
    v_birth_date,
    left(v_timezone, 64),
    now(),
    now(),
    new.created_at,
    now()
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  if v_weight_kg between 20 and 500 then
    insert into public.weight_entries (user_id, measured_on, weight_kg, source)
    values (new.id, (now() at time zone v_timezone)::date, v_weight_kg, 'signup')
    on conflict (user_id, measured_on) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill accounts created before this migration.
insert into public.profiles (
  id,
  email,
  full_name,
  display_name,
  timezone,
  terms_accepted_at,
  privacy_accepted_at,
  created_at,
  updated_at
)
select
  users.id,
  users.email,
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''), split_part(users.email, '@', 1)), 120),
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'display_name'), ''), split_part(users.email, '@', 1)), 40),
  left(coalesce(nullif(trim(users.raw_user_meta_data ->> 'timezone'), ''), 'UTC'), 64),
  users.created_at,
  users.created_at,
  users.created_at,
  now()
from auth.users as users
on conflict (id) do nothing;

insert into public.user_preferences (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

insert into public.user_progress (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

create or replace function public.complete_onboarding(
  p_timezone text,
  p_unit_system text,
  p_exercise_days_target numeric,
  p_programming_days_target integer,
  p_hydration_target_ml integer,
  p_sleep_min_minutes integer,
  p_sleep_max_minutes integer,
  p_sleep_target_time time,
  p_expected_main_meals integer,
  p_flexible_meals_per_week integer
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date;
  v_week_start date;
  v_goal_version_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_timezone is null or char_length(p_timezone) not between 1 and 64 then
    raise exception 'Invalid timezone';
  end if;

  if exists (
    select 1 from public.profiles
    where id = v_user_id and onboarding_completed_at is not null
  ) then
    return;
  end if;

  v_today := (now() at time zone p_timezone)::date;
  v_week_start := v_today - (extract(isodow from v_today)::integer - 1);

  update public.profiles
  set timezone = p_timezone,
      unit_system = p_unit_system,
      onboarding_completed_at = now()
  where id = v_user_id;

  insert into public.goal_versions (
    user_id,
    effective_from,
    exercise_days_target,
    programming_days_target,
    hydration_target_ml,
    sleep_min_minutes,
    sleep_max_minutes,
    sleep_target_time,
    expected_main_meals,
    flexible_meals_per_week
  )
  values (
    v_user_id,
    v_today,
    p_exercise_days_target,
    p_programming_days_target,
    p_hydration_target_ml,
    p_sleep_min_minutes,
    p_sleep_max_minutes,
    p_sleep_target_time,
    p_expected_main_meals,
    p_flexible_meals_per_week
  )
  returning id into v_goal_version_id;

  insert into public.weekly_cycles (
    user_id,
    week_start,
    week_end,
    timezone,
    goal_version_id,
    scheduled_close_at
  )
  values (
    v_user_id,
    v_week_start,
    v_week_start + 6,
    p_timezone,
    v_goal_version_id,
    ((v_week_start + 7)::timestamp at time zone p_timezone)
  )
  on conflict (user_id, week_start) do nothing;
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.goal_versions enable row level security;
alter table public.weekly_cycles enable row level security;
alter table public.weight_entries enable row level security;
alter table public.user_progress enable row level security;

create policy "profiles_select_own"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "preferences_select_own"
on public.user_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy "preferences_update_own"
on public.user_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "goals_select_own"
on public.goal_versions for select to authenticated
using ((select auth.uid()) = user_id);

create policy "goals_insert_own"
on public.goal_versions for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "cycles_select_own"
on public.weekly_cycles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "cycles_insert_own"
on public.weekly_cycles for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "weights_select_own"
on public.weight_entries for select to authenticated
using ((select auth.uid()) = user_id);

create policy "weights_insert_own"
on public.weight_entries for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "weights_update_own"
on public.weight_entries for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "weights_delete_own"
on public.weight_entries for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "progress_select_own"
on public.user_progress for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.profiles from anon;
revoke all on public.user_preferences from anon;
revoke all on public.goal_versions from anon;
revoke all on public.weekly_cycles from anon;
revoke all on public.weight_entries from anon;
revoke all on public.user_progress from anon;

grant select, update on public.profiles to authenticated;
grant select, update on public.user_preferences to authenticated;
grant select, insert on public.goal_versions to authenticated;
grant select, insert on public.weekly_cycles to authenticated;
grant select, insert, update, delete on public.weight_entries to authenticated;
grant select on public.user_progress to authenticated;
grant execute on function public.complete_onboarding(
  text,
  text,
  numeric,
  integer,
  integer,
  integer,
  integer,
  time,
  integer,
  integer
) to authenticated;

