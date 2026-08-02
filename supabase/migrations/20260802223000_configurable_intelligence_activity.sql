-- Personalize the Intelligence pillar while preserving the established Focus XP economy.
alter table public.goal_versions
  add column intelligence_activity_type text not null default 'programming',
  add column intelligence_activity_label text not null default 'Programación';

alter table public.goal_versions add constraint goal_versions_intelligence_activity_type_check
  check (intelligence_activity_type in ('programming','reading','chess','study','languages','mathematics','science','writing','music_practice','online_course','research','memory_training','creative_projects','custom'));
alter table public.goal_versions add constraint goal_versions_intelligence_activity_label_check
  check (char_length(trim(intelligence_activity_label)) between 2 and 60);

alter table public.focus_sessions
  add column intelligence_activity_type text not null default 'programming';

update public.focus_sessions
set intelligence_activity_type = focus_type;

alter table public.focus_sessions add constraint focus_sessions_intelligence_activity_type_check
  check (intelligence_activity_type in ('programming','reading','chess','study','languages','mathematics','science','writing','music_practice','online_course','research','memory_training','creative_projects','custom','technical_study','exercises','course','technical_reading','personal_project'));

create or replace function public.normalize_focus_activity_type()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.focus_type <> 'programming' then
    new.intelligence_activity_type := new.focus_type;
    new.focus_type := 'programming';
  end if;
  return new;
end;
$$;

create trigger focus_sessions_normalize_activity_type
before insert or update of focus_type on public.focus_sessions
for each row execute function public.normalize_focus_activity_type();

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
    on conflict (daily_mission_id, mission_type) do update set target_value = excluded.target_value, title = excluded.title, description = excluded.description;

    if extract(isodow from v_date)::integer = any(v_goal.exercise_preferred_days) then
      insert into public.daily_mission_items (daily_mission_id,user_id,mission_type,title,description,target_value,unit,source_type)
      values (v_mission_id,v_cycle.user_id,'exercise','Entrenamiento programado','Completa una sesión estructurada válida',1,'día equivalente','workout')
      on conflict (daily_mission_id, mission_type) do update set target_value = excluded.target_value, title = excluded.title, description = excluded.description;
    end if;

    if extract(isodow from v_date)::integer = any(v_goal.programming_preferred_days) then
      insert into public.daily_mission_items (daily_mission_id,user_id,mission_type,title,description,target_value,unit,source_type)
      values (v_mission_id,v_cycle.user_id,'focus',v_goal.intelligence_activity_label || ' con enfoque','Completa al menos 25 minutos de ' || lower(v_goal.intelligence_activity_label),25,'min','focus_session')
      on conflict (daily_mission_id, mission_type) do update set target_value = excluded.target_value, title = excluded.title, description = excluded.description;
    end if;
  end loop;
end;
$$;

create or replace function public.complete_onboarding_v2(
  p_timezone text,
  p_unit_system text,
  p_exercise_days_target numeric,
  p_programming_days_target integer,
  p_intelligence_activity_type text,
  p_intelligence_activity_label text,
  p_hydration_target_ml integer,
  p_sleep_min_minutes integer,
  p_sleep_max_minutes integer,
  p_sleep_target_time time,
  p_expected_main_meals integer,
  p_flexible_meals_per_week integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_cycle_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if p_intelligence_activity_type not in ('programming','reading','chess','study','languages','mathematics','science','writing','music_practice','online_course','research','memory_training','creative_projects','custom') then
    raise exception 'Invalid intelligence activity';
  end if;
  if char_length(trim(p_intelligence_activity_label)) not between 2 and 60 then
    raise exception 'Invalid intelligence activity label';
  end if;

  perform public.complete_onboarding(
    p_timezone, p_unit_system, p_exercise_days_target, p_programming_days_target,
    p_hydration_target_ml, p_sleep_min_minutes, p_sleep_max_minutes,
    p_sleep_target_time, p_expected_main_meals, p_flexible_meals_per_week
  );

  update public.goal_versions
  set intelligence_activity_type = p_intelligence_activity_type,
      intelligence_activity_label = trim(p_intelligence_activity_label)
  where user_id = v_user_id and effective_until is null;

  select id into v_cycle_id from public.weekly_cycles
  where user_id = v_user_id and status = 'open'
  order by week_start desc limit 1;
  if v_cycle_id is not null then
    perform public.refresh_week_system(v_cycle_id);
  end if;
end;
$$;

revoke all on function public.complete_onboarding_v2(text,text,numeric,integer,text,text,integer,integer,integer,time,integer,integer) from public;
grant execute on function public.complete_onboarding_v2(text,text,numeric,integer,text,text,integer,integer,integer,time,integer,integer) to authenticated;

do $$
declare v_cycle_id uuid;
begin
  for v_cycle_id in select id from public.weekly_cycles where status = 'open' loop
    perform public.generate_daily_missions(v_cycle_id);
    perform public.update_daily_missions(v_cycle_id);
  end loop;
end $$;
