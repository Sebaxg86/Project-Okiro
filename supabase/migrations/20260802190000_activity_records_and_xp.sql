-- Real activity records and provisional XP engine v1.0.0.

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  occurred_at timestamptz not null,
  local_date date not null,
  duration_minutes integer not null check (duration_minutes between 1 and 1440),
  workout_type text not null check (workout_type in ('strength','cardio','walking','cycling','swimming','boxing','mma','sport','mobility','yoga','active_recovery','functional','mixed','other')),
  intensity text not null check (intensity in ('light','moderate','intense')),
  title text,
  notes text,
  source text not null default 'manual' check (source = 'manual'),
  verification_status text not null default 'unverified' check (verification_status = 'unverified'),
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sleep_started_at timestamptz not null,
  woke_up_at timestamptz not null,
  wake_local_date date not null,
  duration_minutes integer not null check (duration_minutes between 1 and 1440),
  quality integer check (quality between 1 and 5),
  interruptions integer check (interruptions between 0 and 50),
  notes text,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (woke_up_at > sleep_started_at)
);

create unique index sleep_logs_one_active_per_wake_date
  on public.sleep_logs (user_id, wake_local_date)
  where deleted_at is null;

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  occurred_at timestamptz not null,
  local_date date not null,
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack','other')),
  description text not null check (char_length(description) between 2 and 160),
  classification text not null check (classification in ('balanced','adequate','flexible','out_of_plan','considerable_excess')),
  is_flexible_meal boolean not null default false,
  notes text,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.hydration_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  occurred_at timestamptz not null,
  local_date date not null,
  amount_ml integer not null check (amount_ml between 1 and 5000),
  source text not null default 'manual' check (source = 'manual'),
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null,
  local_date date not null,
  duration_minutes integer not null check (duration_minutes between 1 and 720),
  focus_type text not null check (focus_type in ('programming','technical_study','exercises','course','technical_reading','personal_project')),
  objective text not null check (char_length(objective) between 2 and 200),
  project_name text,
  notes text,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  category text not null check (category in ('exercise','sleep','nutrition','hydration','focus')),
  source_type text not null check (source_type in ('workout','sleep_log','meal_log','hydration_entry','focus_session')),
  source_id uuid not null,
  amount integer not null,
  attribute text check (attribute in ('strength','endurance','vitality','intelligence')),
  status text not null check (status in ('provisional','consolidated','reversed','adjustment')),
  rule_code text not null,
  rule_version text not null default 'xp-engine-1.0.0',
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  reversed_transaction_id uuid references public.xp_transactions(id),
  idempotency_key text not null unique
);

create unique index xp_one_active_transaction_per_source
  on public.xp_transactions (source_type, source_id)
  where status = 'provisional';

create table public.activity_mutations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  idempotency_key text not null,
  mutation_type text not null check (mutation_type in ('save','delete')),
  source_type text not null,
  source_id uuid not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index workouts_user_date on public.workouts (user_id, local_date) where deleted_at is null;
create index sleep_logs_user_date on public.sleep_logs (user_id, wake_local_date) where deleted_at is null;
create index meal_logs_user_date on public.meal_logs (user_id, local_date) where deleted_at is null;
create index hydration_entries_user_date on public.hydration_entries (user_id, local_date) where deleted_at is null;
create index focus_sessions_user_date on public.focus_sessions (user_id, local_date) where deleted_at is null;
create index xp_transactions_user_cycle on public.xp_transactions (user_id, weekly_cycle_id, status);

create trigger workouts_set_updated_at before update on public.workouts for each row execute function public.set_updated_at();
create trigger sleep_logs_set_updated_at before update on public.sleep_logs for each row execute function public.set_updated_at();
create trigger meal_logs_set_updated_at before update on public.meal_logs for each row execute function public.set_updated_at();
create trigger hydration_entries_set_updated_at before update on public.hydration_entries for each row execute function public.set_updated_at();
create trigger focus_sessions_set_updated_at before update on public.focus_sessions for each row execute function public.set_updated_at();

create or replace function public.workout_base_xp(p_duration integer, p_type text)
returns integer language sql immutable set search_path = '' as $$
  select case
    when p_type in ('walking','mobility','yoga','active_recovery') then
      case when p_duration < 30 then 0 when p_duration < 45 then 20 when p_duration < 60 then 30 else 40 end
    else
      case when p_duration < 20 then 0 when p_duration < 30 then 35 when p_duration < 45 then 55 when p_duration < 75 then 70 else 80 end
  end;
$$;

create or replace function public.sleep_base_xp(p_duration integer, p_start time, p_target time, p_tolerance integer)
returns integer language sql immutable set search_path = '' as $$
  with duration_score as (
    select case
      when p_duration between 420 and 540 then 30
      when p_duration between 390 and 419 or p_duration between 541 and 570 then 20
      when p_duration between 360 and 389 or p_duration between 571 and 600 then 10
      when p_duration between 300 and 359 then -10
      when p_duration < 300 then -25
      else 0
    end as amount
  ), clock_minutes as (
    select
      extract(hour from p_start)::integer * 60 + extract(minute from p_start)::integer as start_minute,
      extract(hour from p_target)::integer * 60 + extract(minute from p_target)::integer as target_minute
  )
  select duration_score.amount + case
    when least(abs(start_minute - target_minute), 1440 - abs(start_minute - target_minute)) <= p_tolerance then 5
    else 0
  end
  from duration_score, clock_minutes;
$$;

create or replace function public.meal_base_xp(p_meal_type text, p_classification text)
returns integer language sql immutable set search_path = '' as $$
  select case
    when p_classification = 'considerable_excess' then -15
    when p_meal_type = 'snack' then case when p_classification in ('balanced','adequate','flexible') then 2 else -3 end
    when p_classification = 'balanced' then 10
    when p_classification = 'adequate' then 6
    when p_classification = 'flexible' then 2
    else -8
  end;
$$;

create or replace function public.hydration_base_xp(p_total integer, p_target integer)
returns integer language sql immutable set search_path = '' as $$
  select case
    when p_target <= 0 or p_total * 100.0 / p_target < 40 then 0
    when p_total * 100.0 / p_target < 60 then 4
    when p_total * 100.0 / p_target < 80 then 8
    when p_total * 100.0 / p_target < 100 then 12
    else 15
  end;
$$;

create or replace function public.focus_base_xp(p_duration integer)
returns integer language sql immutable set search_path = '' as $$
  select case when p_duration < 25 then 0 when p_duration < 50 then 20 when p_duration < 90 then 30 else 40 end;
$$;

create or replace function public.recalculate_category_xp(p_user_id uuid, p_cycle_id uuid, p_category text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_category not in ('exercise','sleep','nutrition','hydration','focus') then
    raise exception 'Invalid XP category';
  end if;

  insert into public.xp_transactions (
    user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
    status, rule_code, metadata, occurred_at, reversed_transaction_id, idempotency_key
  )
  select
    user_id, weekly_cycle_id, category, source_type, source_id, -amount, null,
    'reversed', 'record_recalculation', jsonb_build_object('reason', 'recalculation'),
    occurred_at, id, 'reverse:' || id::text || ':' || gen_random_uuid()::text
  from public.xp_transactions
  where user_id = p_user_id and weekly_cycle_id = p_cycle_id
    and category = p_category and status = 'provisional';

  update public.xp_transactions
  set status = 'reversed'
  where user_id = p_user_id and weekly_cycle_id = p_cycle_id
    and category = p_category and status = 'provisional';

  if p_category = 'exercise' then
    insert into public.xp_transactions (
      user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
      status, rule_code, metadata, occurred_at, idempotency_key
    )
    with base as (
      select w.*, public.workout_base_xp(w.duration_minutes, w.workout_type) as raw_xp
      from public.workouts w
      where w.user_id = p_user_id and w.weekly_cycle_id = p_cycle_id and w.deleted_at is null
    ), daily as (
      select base.*, case when row_number() over (partition by local_date order by raw_xp desc, occurred_at, id) = 1 then raw_xp else 0 end as daily_xp
      from base
    ), weekly as (
      select daily.*, sum(daily_xp) over (order by local_date, occurred_at, id rows between unbounded preceding and current row) as running_xp
      from daily
    )
    select
      p_user_id, p_cycle_id, 'exercise', 'workout', id,
      greatest(0, least(daily_xp, 350 - (running_xp - daily_xp)))::integer,
      case when raw_xp <= 0 then null when workout_type in ('strength','functional') then 'strength' else 'endurance' end,
      'provisional', 'exercise_duration_v1',
      jsonb_build_object('base_xp', raw_xp, 'daily_cap', 80, 'weekly_cap', 350),
      occurred_at, 'xp:' || gen_random_uuid()::text
    from weekly;

  elsif p_category = 'sleep' then
    insert into public.xp_transactions (
      user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
      status, rule_code, metadata, occurred_at, idempotency_key
    )
    select
      p_user_id, p_cycle_id, 'sleep', 'sleep_log', sleep.id,
      public.sleep_base_xp(sleep.duration_minutes, (sleep.sleep_started_at at time zone cycle.timezone)::time, goals.sleep_target_time, goals.sleep_tolerance_minutes),
      case when public.sleep_base_xp(sleep.duration_minutes, (sleep.sleep_started_at at time zone cycle.timezone)::time, goals.sleep_target_time, goals.sleep_tolerance_minutes) > 0 then 'vitality' else null end,
      'provisional', 'sleep_duration_consistency_v1',
      jsonb_build_object('duration_minutes', sleep.duration_minutes, 'target_time', goals.sleep_target_time),
      sleep.woke_up_at, 'xp:' || gen_random_uuid()::text
    from public.sleep_logs sleep
    join public.weekly_cycles cycle on cycle.id = sleep.weekly_cycle_id
    join public.goal_versions goals on goals.id = cycle.goal_version_id
    where sleep.user_id = p_user_id and sleep.weekly_cycle_id = p_cycle_id and sleep.deleted_at is null;

  elsif p_category = 'nutrition' then
    insert into public.xp_transactions (
      user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
      status, rule_code, metadata, occurred_at, idempotency_key
    )
    with base as (
      select meal.*, public.meal_base_xp(meal.meal_type, meal.classification) as raw_xp
      from public.meal_logs meal
      where meal.user_id = p_user_id and meal.weekly_cycle_id = p_cycle_id and meal.deleted_at is null
    ), running as (
      select base.*,
        sum(greatest(raw_xp, 0)) over (partition by local_date order by occurred_at, id rows between unbounded preceding and current row) as positive_running,
        sum(greatest(-raw_xp, 0)) over (partition by local_date order by occurred_at, id rows between unbounded preceding and current row) as penalty_running
      from base
    )
    select
      p_user_id, p_cycle_id, 'nutrition', 'meal_log', id,
      case when raw_xp >= 0
        then greatest(0, least(raw_xp, 30 - (positive_running - raw_xp)))::integer
        else -greatest(0, least(-raw_xp, 20 - (penalty_running - (-raw_xp))))::integer
      end,
      case when raw_xp > 0 then 'vitality' else null end,
      'provisional', 'nutrition_classification_v1',
      jsonb_build_object('base_xp', raw_xp, 'daily_positive_cap', 30, 'daily_penalty_cap', 20),
      occurred_at, 'xp:' || gen_random_uuid()::text
    from running;

  elsif p_category = 'hydration' then
    insert into public.xp_transactions (
      user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
      status, rule_code, metadata, occurred_at, idempotency_key
    )
    with entries as (
      select hydration.*,
        row_number() over (partition by local_date order by occurred_at, id) as entry_order,
        sum(amount_ml) over (partition by local_date) as daily_total
      from public.hydration_entries hydration
      where hydration.user_id = p_user_id and hydration.weekly_cycle_id = p_cycle_id and hydration.deleted_at is null
    )
    select
      p_user_id, p_cycle_id, 'hydration', 'hydration_entry', entries.id,
      case when entry_order = 1 then public.hydration_base_xp(daily_total::integer, goals.hydration_target_ml) else 0 end,
      case when entry_order = 1 and public.hydration_base_xp(daily_total::integer, goals.hydration_target_ml) > 0 then 'vitality' else null end,
      'provisional', 'hydration_daily_percentage_v1',
      jsonb_build_object('daily_total_ml', daily_total, 'target_ml', goals.hydration_target_ml, 'daily_anchor', entry_order = 1),
      entries.occurred_at, 'xp:' || gen_random_uuid()::text
    from entries
    join public.weekly_cycles cycle on cycle.id = entries.weekly_cycle_id
    join public.goal_versions goals on goals.id = cycle.goal_version_id;

  elsif p_category = 'focus' then
    insert into public.xp_transactions (
      user_id, weekly_cycle_id, category, source_type, source_id, amount, attribute,
      status, rule_code, metadata, occurred_at, idempotency_key
    )
    with sessions as (
      select focus.*,
        row_number() over (partition by local_date order by case when focus_type = 'programming' then 0 else 1 end, started_at, id) as entry_order,
        sum(case when focus_type = 'programming' then duration_minutes else 0 end) over (partition by local_date) as daily_minutes
      from public.focus_sessions focus
      where focus.user_id = p_user_id and focus.weekly_cycle_id = p_cycle_id and focus.deleted_at is null
    ), daily_scored as (
      select sessions.*,
        case when entry_order = 1 and focus_type = 'programming' then public.focus_base_xp(daily_minutes::integer) else 0 end as daily_xp
      from sessions
    ), weekly as (
      select daily_scored.*,
        sum(daily_xp) over (order by local_date, started_at, id rows between unbounded preceding and current row) as running_xp
      from daily_scored
    )
    select
      p_user_id, p_cycle_id, 'focus', 'focus_session', id,
      greatest(0, least(daily_xp, 120 - (running_xp - daily_xp)))::integer,
      case when daily_xp > 0 then 'intelligence' else null end,
      'provisional', 'focus_daily_duration_v1',
      jsonb_build_object('daily_minutes', daily_minutes, 'weekly_cap', 120, 'daily_anchor', entry_order = 1),
      started_at, 'xp:' || gen_random_uuid()::text
    from weekly;
  end if;
end;
$$;

create or replace function public.save_activity(
  p_kind text,
  p_record_id uuid,
  p_payload jsonb,
  p_idempotency_key text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_timezone text;
  v_local_date date;
  v_time time;
  v_occurred_at timestamptz;
  v_started_at timestamptz;
  v_woke_up_at timestamptz;
  v_cycle_id uuid;
  v_old_cycle_id uuid;
  v_goal_id uuid;
  v_record_id uuid;
  v_category text;
  v_source_type text;
  v_before integer := 0;
  v_after integer := 0;
  v_record_xp integer := 0;
  v_duration integer;
  v_rows integer;
  v_result jsonb;
  v_existing jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  if p_idempotency_key is null or char_length(p_idempotency_key) not between 8 and 120 then raise exception 'Invalid idempotency key'; end if;
  if p_kind not in ('workout','sleep','meal','hydration','focus') then raise exception 'Invalid activity type'; end if;

  select result into v_existing from public.activity_mutations
  where user_id = v_user_id and idempotency_key = p_idempotency_key;
  if v_existing is not null then return v_existing; end if;

  select timezone into v_timezone from public.profiles where id = v_user_id and onboarding_completed_at is not null;
  if v_timezone is null then raise exception 'Onboarding required'; end if;
  if not pg_input_is_valid(p_payload ->> 'localDate', 'date') then raise exception 'Invalid local date'; end if;
  v_local_date := (p_payload ->> 'localDate')::date;

  select id, goal_version_id into v_cycle_id, v_goal_id
  from public.weekly_cycles
  where user_id = v_user_id and status = 'open' and v_local_date between week_start and week_end
  limit 1;
  if v_cycle_id is null then raise exception 'The selected week is not open'; end if;

  if p_kind <> 'sleep' then
    if not pg_input_is_valid(p_payload ->> 'time', 'time') then raise exception 'Invalid local time'; end if;
    v_time := (p_payload ->> 'time')::time;
    v_occurred_at := (v_local_date + v_time) at time zone v_timezone;
  end if;

  if p_kind = 'workout' then
    v_category := 'exercise'; v_source_type := 'workout';
    v_duration := (p_payload ->> 'durationMinutes')::integer;
    if exists (
      select 1 from public.workouts w
      where w.user_id = v_user_id and w.deleted_at is null and (p_record_id is null or w.id <> p_record_id)
        and tstzrange(w.occurred_at, w.occurred_at + w.duration_minutes * interval '1 minute', '[)')
          && tstzrange(v_occurred_at, v_occurred_at + v_duration * interval '1 minute', '[)')
    ) or exists (
      select 1 from public.focus_sessions f
      where f.user_id = v_user_id and f.deleted_at is null
        and tstzrange(f.started_at, f.started_at + f.duration_minutes * interval '1 minute', '[)')
          && tstzrange(v_occurred_at, v_occurred_at + v_duration * interval '1 minute', '[)')
    ) then raise exception 'The activity overlaps another record'; end if;

    if p_record_id is null then
      insert into public.workouts (user_id, occurred_at, local_date, duration_minutes, workout_type, intensity, title, notes, weekly_cycle_id)
      values (v_user_id, v_occurred_at, v_local_date, v_duration, p_payload ->> 'workoutType', p_payload ->> 'intensity', nullif(trim(p_payload ->> 'title'), ''), nullif(trim(p_payload ->> 'notes'), ''), v_cycle_id)
      returning id into v_record_id;
    else
      select weekly_cycle_id into v_old_cycle_id from public.workouts where id = p_record_id and user_id = v_user_id and deleted_at is null;
      update public.workouts set occurred_at = v_occurred_at, local_date = v_local_date, duration_minutes = v_duration,
        workout_type = p_payload ->> 'workoutType', intensity = p_payload ->> 'intensity', title = nullif(trim(p_payload ->> 'title'), ''),
        notes = nullif(trim(p_payload ->> 'notes'), ''), weekly_cycle_id = v_cycle_id
      where id = p_record_id and user_id = v_user_id and deleted_at is null;
      get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if; v_record_id := p_record_id;
    end if;

  elsif p_kind = 'sleep' then
    v_category := 'sleep'; v_source_type := 'sleep_log';
    if not pg_input_is_valid(p_payload ->> 'sleepTime', 'time') or not pg_input_is_valid(p_payload ->> 'wakeTime', 'time') then raise exception 'Invalid sleep time'; end if;
    v_woke_up_at := (v_local_date + (p_payload ->> 'wakeTime')::time) at time zone v_timezone;
    v_started_at := ((case when (p_payload ->> 'sleepTime')::time >= (p_payload ->> 'wakeTime')::time then v_local_date - 1 else v_local_date end) + (p_payload ->> 'sleepTime')::time) at time zone v_timezone;
    v_duration := floor(extract(epoch from (v_woke_up_at - v_started_at)) / 60)::integer;

    if p_record_id is null then
      insert into public.sleep_logs (user_id, sleep_started_at, woke_up_at, wake_local_date, duration_minutes, quality, interruptions, notes, weekly_cycle_id)
      values (v_user_id, v_started_at, v_woke_up_at, v_local_date, v_duration, nullif(p_payload ->> 'quality', '')::integer, nullif(p_payload ->> 'interruptions', '')::integer, nullif(trim(p_payload ->> 'notes'), ''), v_cycle_id)
      returning id into v_record_id;
    else
      select weekly_cycle_id into v_old_cycle_id from public.sleep_logs where id = p_record_id and user_id = v_user_id and deleted_at is null;
      update public.sleep_logs set sleep_started_at = v_started_at, woke_up_at = v_woke_up_at, wake_local_date = v_local_date, duration_minutes = v_duration,
        quality = nullif(p_payload ->> 'quality', '')::integer, interruptions = nullif(p_payload ->> 'interruptions', '')::integer,
        notes = nullif(trim(p_payload ->> 'notes'), ''), weekly_cycle_id = v_cycle_id
      where id = p_record_id and user_id = v_user_id and deleted_at is null;
      get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if; v_record_id := p_record_id;
    end if;

  elsif p_kind = 'meal' then
    v_category := 'nutrition'; v_source_type := 'meal_log';
    if (p_payload ->> 'classification') = 'flexible' then
      if (select count(*) from public.meal_logs m where m.user_id = v_user_id and m.weekly_cycle_id = v_cycle_id and m.deleted_at is null and m.classification = 'flexible' and (p_record_id is null or m.id <> p_record_id))
        >= (select flexible_meals_per_week from public.goal_versions where id = v_goal_id)
      then raise exception 'No flexible meals remain this week'; end if;
    end if;
    if p_record_id is null then
      insert into public.meal_logs (user_id, occurred_at, local_date, meal_type, description, classification, is_flexible_meal, notes, weekly_cycle_id)
      values (v_user_id, v_occurred_at, v_local_date, p_payload ->> 'mealType', trim(p_payload ->> 'description'), p_payload ->> 'classification', (p_payload ->> 'classification') = 'flexible', nullif(trim(p_payload ->> 'notes'), ''), v_cycle_id)
      returning id into v_record_id;
    else
      select weekly_cycle_id into v_old_cycle_id from public.meal_logs where id = p_record_id and user_id = v_user_id and deleted_at is null;
      update public.meal_logs set occurred_at = v_occurred_at, local_date = v_local_date, meal_type = p_payload ->> 'mealType', description = trim(p_payload ->> 'description'),
        classification = p_payload ->> 'classification', is_flexible_meal = (p_payload ->> 'classification') = 'flexible', notes = nullif(trim(p_payload ->> 'notes'), ''), weekly_cycle_id = v_cycle_id
      where id = p_record_id and user_id = v_user_id and deleted_at is null;
      get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if; v_record_id := p_record_id;
    end if;

  elsif p_kind = 'hydration' then
    v_category := 'hydration'; v_source_type := 'hydration_entry';
    if p_record_id is null then
      insert into public.hydration_entries (user_id, occurred_at, local_date, amount_ml, weekly_cycle_id)
      values (v_user_id, v_occurred_at, v_local_date, (p_payload ->> 'amountMl')::integer, v_cycle_id)
      returning id into v_record_id;
    else
      select weekly_cycle_id into v_old_cycle_id from public.hydration_entries where id = p_record_id and user_id = v_user_id and deleted_at is null;
      update public.hydration_entries set occurred_at = v_occurred_at, local_date = v_local_date, amount_ml = (p_payload ->> 'amountMl')::integer, weekly_cycle_id = v_cycle_id
      where id = p_record_id and user_id = v_user_id and deleted_at is null;
      get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if; v_record_id := p_record_id;
    end if;

  elsif p_kind = 'focus' then
    v_category := 'focus'; v_source_type := 'focus_session';
    v_duration := (p_payload ->> 'durationMinutes')::integer;
    if exists (
      select 1 from public.focus_sessions f
      where f.user_id = v_user_id and f.deleted_at is null and (p_record_id is null or f.id <> p_record_id)
        and tstzrange(f.started_at, f.started_at + f.duration_minutes * interval '1 minute', '[)')
          && tstzrange(v_occurred_at, v_occurred_at + v_duration * interval '1 minute', '[)')
    ) or exists (
      select 1 from public.workouts w
      where w.user_id = v_user_id and w.deleted_at is null
        and tstzrange(w.occurred_at, w.occurred_at + w.duration_minutes * interval '1 minute', '[)')
          && tstzrange(v_occurred_at, v_occurred_at + v_duration * interval '1 minute', '[)')
    ) then raise exception 'The activity overlaps another record'; end if;

    if p_record_id is null then
      insert into public.focus_sessions (user_id, started_at, local_date, duration_minutes, focus_type, objective, project_name, notes, weekly_cycle_id)
      values (v_user_id, v_occurred_at, v_local_date, v_duration, p_payload ->> 'focusType', trim(p_payload ->> 'objective'), nullif(trim(p_payload ->> 'projectName'), ''), nullif(trim(p_payload ->> 'notes'), ''), v_cycle_id)
      returning id into v_record_id;
    else
      select weekly_cycle_id into v_old_cycle_id from public.focus_sessions where id = p_record_id and user_id = v_user_id and deleted_at is null;
      update public.focus_sessions set started_at = v_occurred_at, local_date = v_local_date, duration_minutes = v_duration, focus_type = p_payload ->> 'focusType',
        objective = trim(p_payload ->> 'objective'), project_name = nullif(trim(p_payload ->> 'projectName'), ''), notes = nullif(trim(p_payload ->> 'notes'), ''), weekly_cycle_id = v_cycle_id
      where id = p_record_id and user_id = v_user_id and deleted_at is null;
      get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if; v_record_id := p_record_id;
    end if;
  end if;

  select coalesce(sum(amount), 0)::integer into v_before from public.xp_transactions
  where user_id = v_user_id and weekly_cycle_id = v_cycle_id and category = v_category and status = 'provisional';

  if v_old_cycle_id is not null and v_old_cycle_id <> v_cycle_id then
    perform public.recalculate_category_xp(v_user_id, v_old_cycle_id, v_category);
  end if;
  perform public.recalculate_category_xp(v_user_id, v_cycle_id, v_category);

  select coalesce(sum(amount), 0)::integer into v_after from public.xp_transactions
  where user_id = v_user_id and weekly_cycle_id = v_cycle_id and category = v_category and status = 'provisional';
  select coalesce(amount, 0) into v_record_xp from public.xp_transactions
  where source_type = v_source_type and source_id = v_record_id and status = 'provisional';

  v_result := jsonb_build_object('id', v_record_id, 'kind', p_kind, 'xpDelta', v_after - v_before, 'recordXp', coalesce(v_record_xp, 0));
  insert into public.activity_mutations (user_id, idempotency_key, mutation_type, source_type, source_id, result)
  values (v_user_id, p_idempotency_key, 'save', v_source_type, v_record_id, v_result);
  return v_result;
end;
$$;

create or replace function public.delete_activity(p_kind text, p_record_id uuid, p_idempotency_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := auth.uid();
  v_cycle_id uuid;
  v_category text;
  v_source_type text;
  v_before integer;
  v_after integer;
  v_rows integer;
  v_result jsonb;
  v_existing jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select result into v_existing from public.activity_mutations where user_id = v_user_id and idempotency_key = p_idempotency_key;
  if v_existing is not null then return v_existing; end if;

  if p_kind = 'workout' then
    v_category := 'exercise'; v_source_type := 'workout';
    select weekly_cycle_id into v_cycle_id from public.workouts where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'sleep' then
    v_category := 'sleep'; v_source_type := 'sleep_log';
    select weekly_cycle_id into v_cycle_id from public.sleep_logs where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'meal' then
    v_category := 'nutrition'; v_source_type := 'meal_log';
    select weekly_cycle_id into v_cycle_id from public.meal_logs where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'hydration' then
    v_category := 'hydration'; v_source_type := 'hydration_entry';
    select weekly_cycle_id into v_cycle_id from public.hydration_entries where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'focus' then
    v_category := 'focus'; v_source_type := 'focus_session';
    select weekly_cycle_id into v_cycle_id from public.focus_sessions where id = p_record_id and user_id = v_user_id and deleted_at is null;
  else raise exception 'Invalid activity type';
  end if;

  if v_cycle_id is null or not exists (select 1 from public.weekly_cycles where id = v_cycle_id and user_id = v_user_id and status = 'open') then
    raise exception 'Record not found or week closed';
  end if;
  select coalesce(sum(amount), 0)::integer into v_before from public.xp_transactions where user_id = v_user_id and weekly_cycle_id = v_cycle_id and category = v_category and status = 'provisional';

  if p_kind = 'workout' then update public.workouts set deleted_at = now() where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'sleep' then update public.sleep_logs set deleted_at = now() where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'meal' then update public.meal_logs set deleted_at = now() where id = p_record_id and user_id = v_user_id and deleted_at is null;
  elsif p_kind = 'hydration' then update public.hydration_entries set deleted_at = now() where id = p_record_id and user_id = v_user_id and deleted_at is null;
  else update public.focus_sessions set deleted_at = now() where id = p_record_id and user_id = v_user_id and deleted_at is null;
  end if;
  get diagnostics v_rows = row_count; if v_rows = 0 then raise exception 'Record not found'; end if;

  perform public.recalculate_category_xp(v_user_id, v_cycle_id, v_category);
  select coalesce(sum(amount), 0)::integer into v_after from public.xp_transactions where user_id = v_user_id and weekly_cycle_id = v_cycle_id and category = v_category and status = 'provisional';
  v_result := jsonb_build_object('id', p_record_id, 'kind', p_kind, 'xpDelta', v_after - v_before, 'deleted', true);
  insert into public.activity_mutations (user_id, idempotency_key, mutation_type, source_type, source_id, result)
  values (v_user_id, p_idempotency_key, 'delete', v_source_type, p_record_id, v_result);
  return v_result;
end;
$$;

alter table public.workouts enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.meal_logs enable row level security;
alter table public.hydration_entries enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.activity_mutations enable row level security;

create policy "workouts_select_own" on public.workouts for select to authenticated using ((select auth.uid()) = user_id);
create policy "sleep_select_own" on public.sleep_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "meals_select_own" on public.meal_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "hydration_select_own" on public.hydration_entries for select to authenticated using ((select auth.uid()) = user_id);
create policy "focus_select_own" on public.focus_sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy "xp_select_own" on public.xp_transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy "mutations_select_own" on public.activity_mutations for select to authenticated using ((select auth.uid()) = user_id);

grant select on public.workouts, public.sleep_logs, public.meal_logs, public.hydration_entries, public.focus_sessions, public.xp_transactions, public.activity_mutations to authenticated;
revoke all on public.workouts, public.sleep_logs, public.meal_logs, public.hydration_entries, public.focus_sessions, public.xp_transactions, public.activity_mutations from anon;

revoke all on function public.workout_base_xp(integer, text) from public, anon, authenticated;
revoke all on function public.sleep_base_xp(integer, time, time, integer) from public, anon, authenticated;
revoke all on function public.meal_base_xp(text, text) from public, anon, authenticated;
revoke all on function public.hydration_base_xp(integer, integer) from public, anon, authenticated;
revoke all on function public.focus_base_xp(integer) from public, anon, authenticated;
revoke all on function public.recalculate_category_xp(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.save_activity(text, uuid, jsonb, text) from public, anon;
revoke all on function public.delete_activity(text, uuid, text) from public, anon;
grant execute on function public.save_activity(text, uuid, jsonb, text) to authenticated;
grant execute on function public.delete_activity(text, uuid, text) to authenticated;
