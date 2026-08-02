-- Missions, live weekly rank, attributes, streaks and idempotent weekly closing.

alter table public.goal_versions
  add column exercise_preferred_days integer[] not null default array[1,2,3,4,5],
  add column programming_preferred_days integer[] not null default array[1,3,5];

update public.weekly_cycles cycle
set scheduled_close_at = ((cycle.week_end + 1)::timestamp + time '12:00') at time zone cycle.timezone
where cycle.status = 'open';

alter table public.xp_transactions drop constraint xp_transactions_category_check;
alter table public.xp_transactions add constraint xp_transactions_category_check
  check (category in ('exercise','sleep','nutrition','hydration','focus','mission','streak'));
alter table public.xp_transactions drop constraint xp_transactions_source_type_check;
alter table public.xp_transactions add constraint xp_transactions_source_type_check
  check (source_type in ('workout','sleep_log','meal_log','hydration_entry','focus_session','daily_mission','exercise_weekly','sleep_weekly','focus_weekly','balanced_weekly','daily_streak_reward','weekly_streak_reward'));
alter table public.xp_transactions drop constraint xp_transactions_attribute_check;
alter table public.xp_transactions add constraint xp_transactions_attribute_check
  check (attribute in ('strength','endurance','vitality','intelligence','discipline'));

create table public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_date date not null,
  weekly_cycle_id uuid not null references public.weekly_cycles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','failed','excluded','protected')),
  completed_required_items integer not null default 0,
  total_required_items integer not null default 0,
  bonus_earned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_date)
);

create table public.daily_mission_items (
  id uuid primary key default gen_random_uuid(),
  daily_mission_id uuid not null references public.daily_missions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_type text not null check (mission_type in ('exercise','sleep','nutrition','hydration','focus')),
  title text not null,
  description text not null,
  target_value numeric not null,
  current_value numeric not null default 0,
  unit text not null,
  is_required boolean not null default true,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','failed','excluded','protected')),
  source_type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (daily_mission_id, mission_type)
);

create table public.weekly_live_state (
  weekly_cycle_id uuid primary key references public.weekly_cycles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  provisional_xp integer not null default 0,
  rank_score numeric(6,2) not null default 0,
  rank text not null default 'E' check (rank in ('S','A','B','C','D','E')),
  exercise_score numeric(6,2) not null default 0,
  sleep_score numeric(6,2) not null default 0,
  nutrition_score numeric(6,2) not null default 0,
  hydration_score numeric(6,2) not null default 0,
  programming_score numeric(6,2) not null default 0,
  data_coverage numeric(6,2) not null default 0,
  completed_missions integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weekly_cycle_id uuid not null unique references public.weekly_cycles(id),
  positive_xp integer not null,
  bonus_xp integer not null,
  raw_penalty_xp integer not null,
  applied_penalty_xp integer not null,
  net_xp integer not null,
  consolidated_xp integer not null check (consolidated_xp >= 0),
  rank_score numeric(6,2) not null,
  rank text not null check (rank in ('S','A','B','C','D','E')),
  exercise_score numeric(6,2) not null,
  sleep_score numeric(6,2) not null,
  nutrition_score numeric(6,2) not null,
  hydration_score numeric(6,2) not null,
  programming_score numeric(6,2) not null,
  data_coverage numeric(6,2) not null,
  previous_level integer not null,
  resulting_level integer not null,
  calculation_version text not null default 'xp-engine-1.0.0',
  calculation_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.attribute_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  attribute text not null check (attribute in ('strength','endurance','vitality','intelligence','discipline')),
  level integer not null default 1 check (level >= 1),
  total_xp bigint not null default 0 check (total_xp >= 0),
  current_level_xp integer not null default 0 check (current_level_xp >= 0),
  xp_required_for_next_level integer not null default 150 check (xp_required_for_next_level > 0),
  updated_at timestamptz not null default now(),
  unique (user_id, attribute)
);

create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  streak_type text not null check (streak_type in ('daily','weekly')),
  current_count integer not null default 0 check (current_count >= 0),
  best_count integer not null default 0 check (best_count >= 0),
  started_at date,
  last_qualified_date date,
  updated_at timestamptz not null default now(),
  unique (user_id, streak_type)
);

create table public.streak_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  streak_type text not null check (streak_type in ('daily','weekly')),
  streak_started_at date not null,
  milestone integer not null,
  reward_xp integer not null,
  weekly_cycle_id uuid not null references public.weekly_cycles(id),
  created_at timestamptz not null default now(),
  unique (user_id, streak_type, streak_started_at, milestone)
);

create trigger daily_missions_set_updated_at before update on public.daily_missions for each row execute function public.set_updated_at();
create trigger daily_mission_items_set_updated_at before update on public.daily_mission_items for each row execute function public.set_updated_at();
create trigger weekly_summaries_set_updated_at before update on public.weekly_summaries for each row execute function public.set_updated_at();
create trigger attribute_progress_set_updated_at before update on public.attribute_progress for each row execute function public.set_updated_at();
create trigger streaks_set_updated_at before update on public.streaks for each row execute function public.set_updated_at();

insert into public.attribute_progress (user_id, attribute)
select profile.id, attribute.name
from public.profiles profile
cross join (values ('strength'),('endurance'),('vitality'),('intelligence'),('discipline')) as attribute(name)
on conflict (user_id, attribute) do nothing;

insert into public.streaks (user_id, streak_type)
select profile.id, kind.name
from public.profiles profile
cross join (values ('daily'),('weekly')) as kind(name)
on conflict (user_id, streak_type) do nothing;

create or replace function public.sleep_score(p_duration integer)
returns numeric language sql immutable set search_path = '' as $$
  select case
    when p_duration between 420 and 540 then 100
    when p_duration between 390 and 419 or p_duration between 541 and 570 then 75
    when p_duration between 360 and 389 or p_duration between 571 and 600 then 50
    when p_duration between 300 and 359 then 20
    when p_duration < 300 then 0
    else 50
  end::numeric;
$$;

create or replace function public.meal_score(p_classification text)
returns numeric language sql immutable set search_path = '' as $$
  select case p_classification when 'balanced' then 100 when 'adequate' then 75 when 'flexible' then 55 when 'out_of_plan' then 20 else 0 end::numeric;
$$;

create or replace function public.workout_day_equivalent(p_duration integer, p_type text)
returns numeric language sql immutable set search_path = '' as $$
  select case
    when p_type in ('walking','mobility','yoga','active_recovery') then case when p_duration < 30 then 0 when p_duration < 45 then .25 when p_duration < 60 then .5 else .75 end
    else case when p_duration < 20 then 0 when p_duration < 30 then .5 else 1 end
  end::numeric;
$$;

create or replace function public.default_schedule_days(p_target integer)
returns integer[] language sql immutable set search_path = '' as $$
  select case greatest(0, least(7, p_target))
    when 0 then array[]::integer[] when 1 then array[1] when 2 then array[1,4]
    when 3 then array[1,3,5] when 4 then array[1,2,4,5]
    when 5 then array[1,2,3,4,5] when 6 then array[1,2,3,4,5,6]
    else array[1,2,3,4,5,6,7] end;
$$;

update public.goal_versions set
  exercise_preferred_days = public.default_schedule_days(round(exercise_days_target)::integer),
  programming_preferred_days = public.default_schedule_days(programming_days_target);

create or replace function public.generate_daily_missions(p_cycle_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_cycle public.weekly_cycles%rowtype;
  v_goal public.goal_versions%rowtype;
  v_date date;
  v_mission_id uuid;
begin
  select * into v_cycle from public.weekly_cycles where id = p_cycle_id;
  if v_cycle.id is null then raise exception 'Cycle not found'; end if;
  select * into v_goal from public.goal_versions where id = v_cycle.goal_version_id;

  for v_day in 0..6 loop
    v_date := v_cycle.week_start + v_day;
    insert into public.daily_missions (user_id, mission_date, weekly_cycle_id)
    values (v_cycle.user_id, v_date, v_cycle.id)
    on conflict (user_id, mission_date) do update set weekly_cycle_id = excluded.weekly_cycle_id
    returning id into v_mission_id;

    insert into public.daily_mission_items (daily_mission_id,user_id,mission_type,title,description,target_value,unit,source_type)
    values
      (v_mission_id,v_cycle.user_id,'sleep','Sueño dentro de objetivo','Registra el sueño principal dentro de tu rango configurado',v_goal.sleep_min_minutes,'min','sleep_log'),
      (v_mission_id,v_cycle.user_id,'nutrition','Comidas principales','Registra las comidas principales esperadas',v_goal.expected_main_meals,'comidas','meal_log'),
      (v_mission_id,v_cycle.user_id,'hydration','Hidratación al 90%','Alcanza por lo menos el 90% de tu objetivo diario',round(v_goal.hydration_target_ml * .9),'ml','hydration_entry')
    on conflict (daily_mission_id, mission_type) do update set target_value = excluded.target_value, description = excluded.description;

    if extract(isodow from v_date)::integer = any(v_goal.exercise_preferred_days) then
      insert into public.daily_mission_items (daily_mission_id,user_id,mission_type,title,description,target_value,unit,source_type)
      values (v_mission_id,v_cycle.user_id,'exercise','Entrenamiento programado','Completa una sesión estructurada válida',1,'día equivalente','workout')
      on conflict (daily_mission_id, mission_type) do nothing;
    end if;

    if extract(isodow from v_date)::integer = any(v_goal.programming_preferred_days) then
      insert into public.daily_mission_items (daily_mission_id,user_id,mission_type,title,description,target_value,unit,source_type)
      values (v_mission_id,v_cycle.user_id,'focus','Programación enfocada','Completa al menos 25 minutos de programación',25,'min','focus_session')
      on conflict (daily_mission_id, mission_type) do nothing;
    end if;
  end loop;
end;
$$;

-- Forward declarations are replaced with the complete implementations below.
create or replace function public.update_daily_missions(p_cycle_id uuid)
returns void language plpgsql security definer set search_path = '' as $$ begin return; end; $$;

create or replace function public.calculate_week_metrics(p_cycle_id uuid, p_final boolean default false)
returns jsonb language sql security definer set search_path = '' as $$
  select jsonb_build_object('exerciseScore',0,'sleepScore',0,'nutritionScore',0,'hydrationScore',0,'programmingScore',0,'coverage',0,'rankScore',0,'rank','E','exerciseEquivalentDays',0,'daysEvaluated',1);
$$;

create or replace function public.refresh_week_system(p_cycle_id uuid, p_final boolean default false)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_cycle public.weekly_cycles%rowtype;
  v_goal public.goal_versions%rowtype;
  v_metrics jsonb;
  v_equivalent numeric;
  v_valid_focus integer;
  v_provisional integer;
begin
  select * into v_cycle from public.weekly_cycles where id = p_cycle_id;
  if v_cycle.id is null then return; end if;
  select * into v_goal from public.goal_versions where id = v_cycle.goal_version_id;
  perform public.generate_daily_missions(p_cycle_id);
  perform public.update_daily_missions(p_cycle_id);

  insert into public.xp_transactions (
    user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,reversed_transaction_id,idempotency_key
  )
  select user_id,weekly_cycle_id,category,source_type,source_id,-amount,null,'reversed','weekly_system_recalculation',
    jsonb_build_object('reason','weekly_system_recalculation'),occurred_at,id,'reverse:' || id::text || ':' || gen_random_uuid()::text
  from public.xp_transactions
  where weekly_cycle_id = p_cycle_id and status = 'provisional'
    and rule_code in ('daily_mission_complete_v1','exercise_goal_bonus_v1','exercise_goal_penalty_v1','sleep_consistency_bonus_v1','focus_consistency_bonus_v1','focus_zero_penalty_v1','balanced_week_bonus_v1');

  update public.xp_transactions set status = 'reversed'
  where weekly_cycle_id = p_cycle_id and status = 'provisional'
    and rule_code in ('daily_mission_complete_v1','exercise_goal_bonus_v1','exercise_goal_penalty_v1','sleep_consistency_bonus_v1','focus_consistency_bonus_v1','focus_zero_penalty_v1','balanced_week_bonus_v1');

  insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
  select mission.user_id,p_cycle_id,'mission','daily_mission',mission.id,8,'discipline','provisional','daily_mission_complete_v1',
    jsonb_build_object('mission_date',mission.mission_date),mission.mission_date::timestamp at time zone v_cycle.timezone,'xp:' || gen_random_uuid()::text
  from public.daily_missions mission where mission.weekly_cycle_id = p_cycle_id and mission.bonus_earned;

  v_metrics := public.calculate_week_metrics(p_cycle_id, p_final);
  v_equivalent := (v_metrics ->> 'exerciseEquivalentDays')::numeric;

  if v_equivalent >= v_goal.exercise_days_target then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'exercise','exercise_weekly',p_cycle_id,50,'discipline','provisional','exercise_goal_bonus_v1',
      jsonb_build_object('equivalent_days',v_equivalent,'target',v_goal.exercise_days_target),now(),'xp:' || gen_random_uuid()::text);
  elsif p_final then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'exercise','exercise_weekly',p_cycle_id,
      -(round((40 * (v_goal.exercise_days_target - v_equivalent)) / 5) * 5)::integer,null,'provisional','exercise_goal_penalty_v1',
      jsonb_build_object('equivalent_days',v_equivalent,'target',v_goal.exercise_days_target),now(),'xp:' || gen_random_uuid()::text);
  end if;

  if (select count(*) from public.sleep_logs where weekly_cycle_id = p_cycle_id and deleted_at is null and duration_minutes between 420 and 540) >= 5
    and (select avg(duration_minutes) from public.sleep_logs where weekly_cycle_id = p_cycle_id and deleted_at is null) between v_goal.sleep_min_minutes and v_goal.sleep_max_minutes
  then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'sleep','sleep_weekly',p_cycle_id,20,'discipline','provisional','sleep_consistency_bonus_v1','{}',now(),'xp:' || gen_random_uuid()::text);
  end if;

  select count(*) into v_valid_focus from (
    select local_date from public.focus_sessions where weekly_cycle_id = p_cycle_id and deleted_at is null and focus_type = 'programming'
    group by local_date having sum(duration_minutes) >= 25
  ) valid_days;
  if v_valid_focus >= v_goal.programming_days_target then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'focus','focus_weekly',p_cycle_id,20,'discipline','provisional','focus_consistency_bonus_v1',jsonb_build_object('valid_days',v_valid_focus),now(),'xp:' || gen_random_uuid()::text);
  elsif p_final and v_valid_focus = 0 then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'focus','focus_weekly',p_cycle_id,-50,null,'provisional','focus_zero_penalty_v1','{}',now(),'xp:' || gen_random_uuid()::text);
  end if;

  if (v_metrics ->> 'exerciseScore')::numeric >= 70 and (v_metrics ->> 'sleepScore')::numeric >= 70
    and (v_metrics ->> 'nutritionScore')::numeric >= 70 and (v_metrics ->> 'hydrationScore')::numeric >= 70
    and (v_metrics ->> 'programmingScore')::numeric >= 70 and (v_metrics ->> 'coverage')::numeric >= 80
  then
    insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
    values (v_cycle.user_id,p_cycle_id,'mission','balanced_weekly',p_cycle_id,20,'discipline','provisional','balanced_week_bonus_v1',v_metrics,now(),'xp:' || gen_random_uuid()::text);
  end if;

  select coalesce(sum(amount),0)::integer into v_provisional from public.xp_transactions where weekly_cycle_id = p_cycle_id and status = 'provisional';
  insert into public.weekly_live_state (
    weekly_cycle_id,user_id,provisional_xp,rank_score,rank,exercise_score,sleep_score,nutrition_score,hydration_score,programming_score,data_coverage,completed_missions,updated_at
  ) values (
    p_cycle_id,v_cycle.user_id,v_provisional,(v_metrics->>'rankScore')::numeric,v_metrics->>'rank',(v_metrics->>'exerciseScore')::numeric,
    (v_metrics->>'sleepScore')::numeric,(v_metrics->>'nutritionScore')::numeric,(v_metrics->>'hydrationScore')::numeric,
    (v_metrics->>'programmingScore')::numeric,(v_metrics->>'coverage')::numeric,
    (select count(*) from public.daily_missions where weekly_cycle_id = p_cycle_id and status = 'completed'),now()
  ) on conflict (weekly_cycle_id) do update set
    provisional_xp=excluded.provisional_xp,rank_score=excluded.rank_score,rank=excluded.rank,exercise_score=excluded.exercise_score,
    sleep_score=excluded.sleep_score,nutrition_score=excluded.nutrition_score,hydration_score=excluded.hydration_score,
    programming_score=excluded.programming_score,data_coverage=excluded.data_coverage,completed_missions=excluded.completed_missions,updated_at=now();
end;
$$;

create or replace function public.initialize_week_system()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.generate_daily_missions(new.id);
  perform public.refresh_week_system(new.id, false);
  return new;
end;
$$;

create trigger weekly_cycles_initialize_system
after insert on public.weekly_cycles
for each row execute function public.initialize_week_system();

create or replace function public.refresh_after_activity_mutation()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_cycle_id uuid;
begin
  if new.source_type = 'workout' then select weekly_cycle_id into v_cycle_id from public.workouts where id = new.source_id;
  elsif new.source_type = 'sleep_log' then select weekly_cycle_id into v_cycle_id from public.sleep_logs where id = new.source_id;
  elsif new.source_type = 'meal_log' then select weekly_cycle_id into v_cycle_id from public.meal_logs where id = new.source_id;
  elsif new.source_type = 'hydration_entry' then select weekly_cycle_id into v_cycle_id from public.hydration_entries where id = new.source_id;
  elsif new.source_type = 'focus_session' then select weekly_cycle_id into v_cycle_id from public.focus_sessions where id = new.source_id;
  end if;
  if v_cycle_id is not null then perform public.refresh_week_system(v_cycle_id, false); end if;
  return new;
end;
$$;

create trigger activity_mutations_refresh_week
after insert on public.activity_mutations
for each row execute function public.refresh_after_activity_mutation();

do $$ declare cycle record; begin
  for cycle in select id from public.weekly_cycles where status = 'open' loop
    perform public.generate_daily_missions(cycle.id);
    perform public.refresh_week_system(cycle.id, false);
  end loop;
end $$;

create or replace function public.apply_week_streaks(p_cycle_id uuid, p_rank text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_cycle public.weekly_cycles%rowtype;
  v_mission record;
  v_streak public.streaks%rowtype;
  v_reward_id uuid;
  v_milestone integer;
  v_reward integer;
begin
  select * into v_cycle from public.weekly_cycles where id = p_cycle_id;
  select * into v_streak from public.streaks where user_id = v_cycle.user_id and streak_type = 'daily' for update;
  for v_mission in select mission_date,status from public.daily_missions where weekly_cycle_id = p_cycle_id order by mission_date loop
    if v_mission.status = 'completed' then
      if v_streak.last_qualified_date = v_mission.mission_date - 1 then v_streak.current_count := v_streak.current_count + 1;
      else v_streak.current_count := 1; v_streak.started_at := v_mission.mission_date; end if;
      v_streak.last_qualified_date := v_mission.mission_date;
      v_streak.best_count := greatest(v_streak.best_count, v_streak.current_count);
      foreach v_milestone in array array[3,7,14,30,60,100,365] loop
        if v_streak.current_count = v_milestone then
          v_reward := case v_milestone when 3 then 10 when 7 then 25 when 14 then 40 when 30 then 75 when 60 then 100 when 100 then 150 else 500 end;
          insert into public.streak_rewards (user_id,streak_type,streak_started_at,milestone,reward_xp,weekly_cycle_id)
          values (v_cycle.user_id,'daily',v_streak.started_at,v_milestone,v_reward,p_cycle_id)
          on conflict do nothing returning id into v_reward_id;
          if v_reward_id is not null then
            insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
            values (v_cycle.user_id,p_cycle_id,'streak','daily_streak_reward',v_reward_id,v_reward,'discipline','provisional','daily_streak_milestone_v1',jsonb_build_object('milestone',v_milestone),now(),'xp:'||gen_random_uuid()::text);
          end if;
        end if;
      end loop;
    else
      v_streak.current_count := 0; v_streak.started_at := null;
    end if;
  end loop;
  update public.streaks set current_count=v_streak.current_count,best_count=v_streak.best_count,started_at=v_streak.started_at,last_qualified_date=v_streak.last_qualified_date where id=v_streak.id;

  v_reward_id := null;
  select * into v_streak from public.streaks where user_id = v_cycle.user_id and streak_type = 'weekly' for update;
  if p_rank in ('S','A','B') then
    if v_streak.last_qualified_date = v_cycle.week_start - 7 then v_streak.current_count := v_streak.current_count + 1;
    else v_streak.current_count := 1; v_streak.started_at := v_cycle.week_start; end if;
    v_streak.last_qualified_date := v_cycle.week_start;
    v_streak.best_count := greatest(v_streak.best_count,v_streak.current_count);
    foreach v_milestone in array array[4,8,12,26,52] loop
      if v_streak.current_count = v_milestone then
        v_reward := case v_milestone when 4 then 100 when 8 then 200 when 12 then 300 when 26 then 600 else 1200 end;
        insert into public.streak_rewards (user_id,streak_type,streak_started_at,milestone,reward_xp,weekly_cycle_id)
        values (v_cycle.user_id,'weekly',v_streak.started_at,v_milestone,v_reward,p_cycle_id)
        on conflict do nothing returning id into v_reward_id;
        if v_reward_id is not null then
          insert into public.xp_transactions (user_id,weekly_cycle_id,category,source_type,source_id,amount,attribute,status,rule_code,metadata,occurred_at,idempotency_key)
          values (v_cycle.user_id,p_cycle_id,'streak','weekly_streak_reward',v_reward_id,v_reward,'discipline','provisional','weekly_streak_milestone_v1',jsonb_build_object('milestone',v_milestone),now(),'xp:'||gen_random_uuid()::text);
        end if;
      end if;
    end loop;
  else
    v_streak.current_count := 0; v_streak.started_at := null;
  end if;
  update public.streaks set current_count=v_streak.current_count,best_count=v_streak.best_count,started_at=v_streak.started_at,last_qualified_date=v_streak.last_qualified_date where id=v_streak.id;
end;
$$;

create or replace function public.close_week(p_cycle_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_cycle public.weekly_cycles%rowtype;
  v_live public.weekly_live_state%rowtype;
  v_summary_id uuid;
  v_positive integer := 0;
  v_bonus integer := 0;
  v_behavior_penalty integer := 0;
  v_other_penalty integer := 0;
  v_raw_penalty integer := 0;
  v_applied_penalty integer := 0;
  v_net integer := 0;
  v_consolidated integer := 0;
  v_previous_level integer;
  v_level integer;
  v_level_xp integer;
  v_required integer;
  v_attribute record;
  v_attribute_progress public.attribute_progress%rowtype;
begin
  select * into v_cycle from public.weekly_cycles where id = p_cycle_id for update;
  if v_cycle.id is null then raise exception 'Cycle not found'; end if;
  select id into v_summary_id from public.weekly_summaries where weekly_cycle_id = p_cycle_id;
  if v_summary_id is not null then return v_summary_id; end if;
  if now() < v_cycle.scheduled_close_at then raise exception 'Correction period is still open'; end if;
  if v_cycle.status not in ('open','pending_close') then raise exception 'Cycle is not open'; end if;
  update public.weekly_cycles set status='pending_close' where id=p_cycle_id;

  perform public.refresh_week_system(p_cycle_id,true);
  select * into v_live from public.weekly_live_state where weekly_cycle_id=p_cycle_id;
  perform public.apply_week_streaks(p_cycle_id,v_live.rank);

  select coalesce(sum(amount),0)::integer into v_positive from public.xp_transactions
  where weekly_cycle_id=p_cycle_id and status='provisional' and amount>0
    and rule_code in ('exercise_duration_v1','sleep_duration_consistency_v1','nutrition_classification_v1','hydration_daily_percentage_v1','focus_daily_duration_v1');
  select coalesce(sum(amount),0)::integer into v_bonus from public.xp_transactions
  where weekly_cycle_id=p_cycle_id and status='provisional' and amount>0
    and rule_code not in ('exercise_duration_v1','sleep_duration_consistency_v1','nutrition_classification_v1','hydration_daily_percentage_v1','focus_daily_duration_v1');
  select coalesce(sum(least(40, penalty)),0)::integer into v_behavior_penalty from (
    select (occurred_at at time zone v_cycle.timezone)::date as local_date, abs(sum(amount)) as penalty
    from public.xp_transactions where weekly_cycle_id=p_cycle_id and status='provisional' and amount<0 and category in ('sleep','nutrition')
    group by (occurred_at at time zone v_cycle.timezone)::date
  ) daily_penalties;
  select coalesce(abs(sum(amount)),0)::integer into v_other_penalty from public.xp_transactions
  where weekly_cycle_id=p_cycle_id and status='provisional' and amount<0 and category not in ('sleep','nutrition');
  v_raw_penalty := v_behavior_penalty + v_other_penalty;
  v_applied_penalty := least(v_raw_penalty,300);
  v_net := v_positive + v_bonus - v_applied_penalty;
  v_consolidated := greatest(0,v_net);

  select current_level,current_level_xp,xp_required_for_next_level into v_level,v_level_xp,v_required from public.user_progress where user_id=v_cycle.user_id for update;
  v_previous_level := v_level; v_level_xp := v_level_xp + v_consolidated;
  while v_level_xp >= v_required loop
    v_level_xp := v_level_xp - v_required; v_level := v_level + 1; v_required := 400 + 60 * (v_level - 1);
  end loop;
  update public.user_progress set current_level=v_level,total_consolidated_xp=total_consolidated_xp+v_consolidated,current_level_xp=v_level_xp,xp_required_for_next_level=v_required,updated_at=now() where user_id=v_cycle.user_id;

  for v_attribute in select attribute,sum(amount)::integer as earned from public.xp_transactions where weekly_cycle_id=p_cycle_id and status='provisional' and amount>0 and attribute is not null group by attribute loop
    select * into v_attribute_progress from public.attribute_progress where user_id=v_cycle.user_id and attribute=v_attribute.attribute for update;
    v_attribute_progress.current_level_xp := v_attribute_progress.current_level_xp + v_attribute.earned;
    v_attribute_progress.total_xp := v_attribute_progress.total_xp + v_attribute.earned;
    while v_attribute_progress.current_level_xp >= v_attribute_progress.xp_required_for_next_level loop
      v_attribute_progress.current_level_xp := v_attribute_progress.current_level_xp - v_attribute_progress.xp_required_for_next_level;
      v_attribute_progress.level := v_attribute_progress.level + 1;
      v_attribute_progress.xp_required_for_next_level := 150 + 25 * (v_attribute_progress.level - 1);
    end loop;
    update public.attribute_progress set level=v_attribute_progress.level,total_xp=v_attribute_progress.total_xp,current_level_xp=v_attribute_progress.current_level_xp,xp_required_for_next_level=v_attribute_progress.xp_required_for_next_level,updated_at=now() where id=v_attribute_progress.id;
  end loop;

  insert into public.weekly_summaries (
    user_id,weekly_cycle_id,positive_xp,bonus_xp,raw_penalty_xp,applied_penalty_xp,net_xp,consolidated_xp,rank_score,rank,
    exercise_score,sleep_score,nutrition_score,hydration_score,programming_score,data_coverage,previous_level,resulting_level,calculation_snapshot
  ) values (
    v_cycle.user_id,p_cycle_id,v_positive,v_bonus,v_raw_penalty,v_applied_penalty,v_net,v_consolidated,v_live.rank_score,v_live.rank,
    v_live.exercise_score,v_live.sleep_score,v_live.nutrition_score,v_live.hydration_score,v_live.programming_score,v_live.data_coverage,
    v_previous_level,v_level,jsonb_build_object('closed_at',now(),'provisional_xp_before_close',v_live.provisional_xp)
  ) returning id into v_summary_id;

  update public.xp_transactions set status='consolidated' where weekly_cycle_id=p_cycle_id and status='provisional';
  update public.weekly_cycles set status='closed',closed_at=now() where id=p_cycle_id;

  insert into public.weekly_cycles (user_id,week_start,week_end,timezone,goal_version_id,scheduled_close_at)
  values (v_cycle.user_id,v_cycle.week_start+7,v_cycle.week_end+7,v_cycle.timezone,v_cycle.goal_version_id,
    ((v_cycle.week_end+8)::timestamp + time '12:00') at time zone v_cycle.timezone)
  on conflict (user_id,week_start) do nothing;
  return v_summary_id;
end;
$$;

create or replace function public.close_eligible_weeks()
returns integer language plpgsql security definer set search_path = '' as $$
declare cycle record; closed_count integer:=0;
begin
  for cycle in select id from public.weekly_cycles where status='open' and scheduled_close_at<=now() order by scheduled_close_at loop
    perform public.close_week(cycle.id); closed_count:=closed_count+1;
  end loop;
  return closed_count;
end;
$$;

create or replace function public.initialize_profile_progression()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.attribute_progress (user_id,attribute)
  select new.id,attribute.name from (values ('strength'),('endurance'),('vitality'),('intelligence'),('discipline')) attribute(name)
  on conflict (user_id,attribute) do nothing;
  insert into public.streaks (user_id,streak_type) values (new.id,'daily'),(new.id,'weekly') on conflict (user_id,streak_type) do nothing;
  return new;
end;
$$;

create trigger profiles_initialize_progression
after insert on public.profiles
for each row execute function public.initialize_profile_progression();

alter table public.daily_missions enable row level security;
alter table public.daily_mission_items enable row level security;
alter table public.weekly_live_state enable row level security;
alter table public.weekly_summaries enable row level security;
alter table public.attribute_progress enable row level security;
alter table public.streaks enable row level security;
alter table public.streak_rewards enable row level security;

create policy "daily_missions_select_own" on public.daily_missions for select to authenticated using ((select auth.uid())=user_id);
create policy "daily_mission_items_select_own" on public.daily_mission_items for select to authenticated using ((select auth.uid())=user_id);
create policy "weekly_live_select_own" on public.weekly_live_state for select to authenticated using ((select auth.uid())=user_id);
create policy "weekly_summaries_select_own" on public.weekly_summaries for select to authenticated using ((select auth.uid())=user_id);
create policy "attributes_select_own" on public.attribute_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "streaks_select_own" on public.streaks for select to authenticated using ((select auth.uid())=user_id);
create policy "streak_rewards_select_own" on public.streak_rewards for select to authenticated using ((select auth.uid())=user_id);

grant select on public.daily_missions,public.daily_mission_items,public.weekly_live_state,public.weekly_summaries,public.attribute_progress,public.streaks,public.streak_rewards to authenticated;
revoke all on public.daily_missions,public.daily_mission_items,public.weekly_live_state,public.weekly_summaries,public.attribute_progress,public.streaks,public.streak_rewards from anon;

revoke all on function public.sleep_score(integer) from public,anon,authenticated;
revoke all on function public.meal_score(text) from public,anon,authenticated;
revoke all on function public.workout_day_equivalent(integer,text) from public,anon,authenticated;
revoke all on function public.default_schedule_days(integer) from public,anon,authenticated;
revoke all on function public.generate_daily_missions(uuid) from public,anon,authenticated;
revoke all on function public.update_daily_missions(uuid) from public,anon,authenticated;
revoke all on function public.calculate_week_metrics(uuid,boolean) from public,anon,authenticated;
revoke all on function public.refresh_week_system(uuid,boolean) from public,anon,authenticated;
revoke all on function public.initialize_week_system() from public,anon,authenticated;
revoke all on function public.refresh_after_activity_mutation() from public,anon,authenticated;
revoke all on function public.apply_week_streaks(uuid,text) from public,anon,authenticated;
revoke all on function public.close_week(uuid) from public,anon,authenticated;
revoke all on function public.close_eligible_weeks() from public,anon,authenticated;
revoke all on function public.initialize_profile_progression() from public,anon,authenticated;

do $$ declare cycle record; begin
  for cycle in select id from public.weekly_cycles where status = 'open' loop
    perform public.refresh_week_system(cycle.id, false);
  end loop;
end $$;



create or replace function public.update_daily_missions(p_cycle_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_timezone text;
  v_today date;
begin
  select timezone into v_timezone from public.weekly_cycles where id = p_cycle_id;
  v_today := (now() at time zone coalesce(v_timezone, 'UTC'))::date;

  update public.daily_mission_items item
  set current_value = case item.mission_type
    when 'sleep' then coalesce((select sleep.duration_minutes from public.sleep_logs sleep join public.daily_missions mission on mission.id = item.daily_mission_id where sleep.user_id = item.user_id and sleep.weekly_cycle_id = p_cycle_id and sleep.wake_local_date = mission.mission_date and sleep.deleted_at is null limit 1), 0)
    when 'nutrition' then coalesce((select count(*) from public.meal_logs meal join public.daily_missions mission on mission.id = item.daily_mission_id where meal.user_id = item.user_id and meal.weekly_cycle_id = p_cycle_id and meal.local_date = mission.mission_date and meal.meal_type <> 'snack' and meal.deleted_at is null), 0)
    when 'hydration' then coalesce((select sum(hydration.amount_ml) from public.hydration_entries hydration join public.daily_missions mission on mission.id = item.daily_mission_id where hydration.user_id = item.user_id and hydration.weekly_cycle_id = p_cycle_id and hydration.local_date = mission.mission_date and hydration.deleted_at is null), 0)
    when 'exercise' then coalesce((select max(public.workout_day_equivalent(workout.duration_minutes, workout.workout_type)) from public.workouts workout join public.daily_missions mission on mission.id = item.daily_mission_id where workout.user_id = item.user_id and workout.weekly_cycle_id = p_cycle_id and workout.local_date = mission.mission_date and workout.workout_type not in ('walking','mobility','yoga','active_recovery') and workout.deleted_at is null), 0)
    when 'focus' then coalesce((select sum(focus.duration_minutes) from public.focus_sessions focus join public.daily_missions mission on mission.id = item.daily_mission_id where focus.user_id = item.user_id and focus.weekly_cycle_id = p_cycle_id and focus.local_date = mission.mission_date and focus.focus_type = 'programming' and focus.deleted_at is null), 0)
    else 0 end
  where item.daily_mission_id in (select id from public.daily_missions where weekly_cycle_id = p_cycle_id);

  update public.daily_mission_items item
  set status = case
    when item.mission_type = 'sleep' then case when item.current_value between item.target_value and (select goals.sleep_max_minutes from public.daily_missions mission join public.weekly_cycles cycle on cycle.id = mission.weekly_cycle_id join public.goal_versions goals on goals.id = cycle.goal_version_id where mission.id = item.daily_mission_id) then 'completed' when item.current_value > 0 then 'in_progress' else 'pending' end
    when item.current_value >= item.target_value then 'completed'
    when item.current_value > 0 then 'in_progress'
    else 'pending' end
  where item.daily_mission_id in (select id from public.daily_missions where weekly_cycle_id = p_cycle_id);

  update public.daily_missions mission
  set completed_required_items = summary.completed,
      total_required_items = summary.total,
      status = case when summary.completed = summary.total then 'completed' when summary.progressed > 0 then 'in_progress' when mission.mission_date < v_today then 'failed' else 'pending' end,
      bonus_earned = false
  from (
    select daily_mission_id, count(*) filter (where status = 'completed')::integer as completed,
      count(*)::integer as total, count(*) filter (where status in ('completed','in_progress'))::integer as progressed
    from public.daily_mission_items
    where daily_mission_id in (select id from public.daily_missions where weekly_cycle_id = p_cycle_id)
    group by daily_mission_id
  ) summary
  where mission.id = summary.daily_mission_id;

  with completed as (
    select id, row_number() over (order by mission_date) as position
    from public.daily_missions where weekly_cycle_id = p_cycle_id and status = 'completed'
  )
  update public.daily_missions mission set bonus_earned = completed.position <= 5
  from completed where mission.id = completed.id;
end;
$$;

create or replace function public.calculate_week_metrics(p_cycle_id uuid, p_final boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_cycle public.weekly_cycles%rowtype;
  v_goal public.goal_versions%rowtype;
  v_today date;
  v_days integer;
  v_exercise_equivalent numeric := 0;
  v_exercise numeric := 0;
  v_sleep numeric := 0;
  v_nutrition numeric := 0;
  v_hydration numeric := 0;
  v_programming numeric := 0;
  v_coverage numeric := 0;
  v_score numeric := 0;
  v_rank text := 'E';
  v_expected integer := 0;
  v_actual integer := 0;
  v_expected_meals integer := 0;
  v_actual_meals integer := 0;
  v_expected_exercise integer := 0;
  v_actual_exercise integer := 0;
  v_expected_focus integer := 0;
  v_actual_focus integer := 0;
begin
  select * into v_cycle from public.weekly_cycles where id = p_cycle_id;
  if v_cycle.id is null then raise exception 'Cycle not found'; end if;
  select * into v_goal from public.goal_versions where id = v_cycle.goal_version_id;
  v_today := (now() at time zone v_cycle.timezone)::date;
  v_days := case when p_final or v_today > v_cycle.week_end then 7 when v_today < v_cycle.week_start then 1 else (v_today - v_cycle.week_start + 1) end;

  with day_values as (
    select workout.local_date,
      max(public.workout_day_equivalent(workout.duration_minutes, workout.workout_type)) filter (where workout.workout_type not in ('walking','mobility','yoga','active_recovery')) as structured_value,
      max(public.workout_day_equivalent(workout.duration_minutes, workout.workout_type)) filter (where workout.workout_type in ('walking','mobility','yoga','active_recovery')) as recovery_value
    from public.workouts workout where workout.weekly_cycle_id = p_cycle_id and workout.deleted_at is null group by workout.local_date
  ), recovery_ranked as (
    select coalesce(structured_value, 0) as structured_value, coalesce(recovery_value, 0) as recovery_value,
      row_number() over (order by recovery_value desc nulls last) as recovery_position from day_values
  )
  select coalesce(sum(structured_value + case when structured_value = 0 and recovery_position <= 2 then recovery_value else 0 end), 0)
  into v_exercise_equivalent from recovery_ranked;
  v_exercise := least(100, case when v_goal.exercise_days_target > 0 then v_exercise_equivalent / v_goal.exercise_days_target * 100 else 100 end);

  select coalesce(sum(public.sleep_score(sleep.duration_minutes)), 0) / v_days
  into v_sleep from public.sleep_logs sleep where sleep.weekly_cycle_id = p_cycle_id and sleep.deleted_at is null and sleep.wake_local_date < v_cycle.week_start + v_days;

  v_expected_meals := v_goal.expected_main_meals * v_days;
  with ranked_meals as (
    select meal.*, row_number() over (partition by local_date order by occurred_at, id) as meal_number
    from public.meal_logs meal where meal.weekly_cycle_id = p_cycle_id and meal.deleted_at is null and meal.meal_type <> 'snack' and meal.local_date < v_cycle.week_start + v_days
  ), main_points as (
    select coalesce(sum(public.meal_score(classification)), 0) as points, count(*)::integer as registered
    from ranked_meals where meal_number <= v_goal.expected_main_meals
  ), snack_points as (
    select coalesce(sum(greatest(-5, least(5, daily_points))), 0) as points from (
      select local_date, sum(public.meal_base_xp(meal_type, classification)) as daily_points
      from public.meal_logs where weekly_cycle_id = p_cycle_id and deleted_at is null and meal_type = 'snack' and local_date < v_cycle.week_start + v_days group by local_date
    ) snacks
  )
  select main_points.registered, least(100, greatest(0, (main_points.points + (v_expected_meals - main_points.registered) * 40 + snack_points.points) / greatest(v_expected_meals, 1)))
  into v_actual_meals, v_nutrition from main_points, snack_points;

  select coalesce(sum(least(100, daily_total * 100.0 / v_goal.hydration_target_ml)), 0) / v_days
  into v_hydration from (
    select local_date, sum(amount_ml) as daily_total from public.hydration_entries
    where weekly_cycle_id = p_cycle_id and deleted_at is null and local_date < v_cycle.week_start + v_days group by local_date
  ) hydration_days;

  select count(*) into v_actual_focus from (
    select local_date from public.focus_sessions where weekly_cycle_id = p_cycle_id and deleted_at is null and focus_type = 'programming'
    group by local_date having sum(duration_minutes) >= 25
  ) valid_focus;
  v_programming := least(100, case when v_goal.programming_days_target > 0 then v_actual_focus * 100.0 / v_goal.programming_days_target else 100 end);

  select count(*) into v_expected_exercise from unnest(v_goal.exercise_preferred_days) day where day <= v_days;
  select count(*) into v_expected_focus from unnest(v_goal.programming_preferred_days) day where day <= v_days;
  select count(*) into v_actual_exercise from (
    select local_date from public.workouts where weekly_cycle_id = p_cycle_id and deleted_at is null
      and extract(isodow from local_date)::integer = any(v_goal.exercise_preferred_days) and local_date < v_cycle.week_start + v_days group by local_date
  ) exercise_days;
  select count(*) into v_actual_focus from (
    select local_date from public.focus_sessions where weekly_cycle_id = p_cycle_id and deleted_at is null and focus_type = 'programming'
      and extract(isodow from local_date)::integer = any(v_goal.programming_preferred_days) and local_date < v_cycle.week_start + v_days group by local_date having sum(duration_minutes) >= 25
  ) focus_days;
  v_expected := v_days + v_expected_meals + v_days + v_expected_exercise + v_expected_focus;
  v_actual := least(v_days, (select count(*) from public.sleep_logs where weekly_cycle_id = p_cycle_id and deleted_at is null and wake_local_date < v_cycle.week_start + v_days))
    + least(v_expected_meals, v_actual_meals)
    + least(v_days, (select count(distinct local_date) from public.hydration_entries where weekly_cycle_id = p_cycle_id and deleted_at is null and local_date < v_cycle.week_start + v_days))
    + least(v_expected_exercise, v_actual_exercise) + least(v_expected_focus, v_actual_focus);
  v_coverage := least(100, v_actual * 100.0 / greatest(v_expected, 1));

  v_score := least(100, greatest(0, v_exercise * .35 + v_sleep * .25 + v_nutrition * .20 + v_hydration * .10 + v_programming * .10));
  v_rank := case when v_score >= 95 then 'S' when v_score >= 85 then 'A' when v_score >= 70 then 'B' when v_score >= 55 then 'C' when v_score >= 40 then 'D' else 'E' end;
  if v_coverage < 60 and v_rank in ('S','A','B') then v_rank := 'C';
  elsif v_coverage < 80 and v_rank in ('S','A') then v_rank := 'B'; end if;

  return jsonb_build_object(
    'exerciseScore', round(v_exercise,2), 'sleepScore', round(v_sleep,2), 'nutritionScore', round(v_nutrition,2),
    'hydrationScore', round(v_hydration,2), 'programmingScore', round(v_programming,2), 'coverage', round(v_coverage,2),
    'rankScore', round(v_score,2), 'rank', v_rank, 'exerciseEquivalentDays', round(v_exercise_equivalent,2), 'daysEvaluated', v_days
  );
end;
$$;

-- Recompute open weeks after the complete mission and metric functions replace
-- their forward declarations.
do $$ declare cycle record; begin
  for cycle in select id from public.weekly_cycles where status = 'open' loop
    perform public.refresh_week_system(cycle.id, false);
  end loop;
end $$;
