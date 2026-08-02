-- Allow every account to replace its initial goals exactly once.
alter table public.profiles
  add column if not exists goal_change_used_at timestamptz;

create or replace function public.update_goal_configuration_once(
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
  v_profile public.profiles%rowtype;
  v_current_goal public.goal_versions%rowtype;
  v_new_goal_id uuid;
  v_today date;
  v_cycle_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into v_profile
  from public.profiles
  where id = v_user_id
  for update;

  if v_profile.id is null or v_profile.onboarding_completed_at is null then
    raise exception 'Onboarding required';
  end if;

  if v_profile.goal_change_used_at is not null then
    raise exception 'Goal configuration change already used';
  end if;

  if p_exercise_days_target not between 0 and 7
    or p_programming_days_target not between 0 and 7
    or p_hydration_target_ml not between 250 and 10000
    or p_sleep_min_minutes not between 180 and 900
    or p_sleep_max_minutes not between 180 and 900
    or p_sleep_max_minutes < p_sleep_min_minutes
    or p_expected_main_meals not between 1 and 8
    or p_flexible_meals_per_week not between 0 and 21 then
    raise exception 'Invalid goal configuration';
  end if;

  if p_intelligence_activity_type not in (
    'programming','reading','chess','study','languages','mathematics','science',
    'writing','music_practice','online_course','research','memory_training',
    'creative_projects','custom'
  ) or char_length(trim(p_intelligence_activity_label)) not between 2 and 60 then
    raise exception 'Invalid intelligence activity';
  end if;

  select * into v_current_goal
  from public.goal_versions
  where user_id = v_user_id and effective_until is null
  for update;

  if v_current_goal.id is null then
    raise exception 'Current goal configuration not found';
  end if;

  v_today := (now() at time zone v_profile.timezone)::date;

  update public.goal_versions
  set effective_until = v_today
  where id = v_current_goal.id;

  insert into public.goal_versions (
    user_id,
    effective_from,
    exercise_days_target,
    programming_days_target,
    intelligence_activity_type,
    intelligence_activity_label,
    hydration_target_ml,
    sleep_min_minutes,
    sleep_max_minutes,
    sleep_target_time,
    sleep_tolerance_minutes,
    expected_main_meals,
    flexible_meals_per_week,
    exercise_preferred_days,
    programming_preferred_days
  ) values (
    v_user_id,
    v_today,
    p_exercise_days_target,
    p_programming_days_target,
    p_intelligence_activity_type,
    trim(p_intelligence_activity_label),
    p_hydration_target_ml,
    p_sleep_min_minutes,
    p_sleep_max_minutes,
    p_sleep_target_time,
    v_current_goal.sleep_tolerance_minutes,
    p_expected_main_meals,
    p_flexible_meals_per_week,
    public.default_schedule_days(round(p_exercise_days_target)::integer),
    public.default_schedule_days(p_programming_days_target)
  ) returning id into v_new_goal_id;

  update public.profiles
  set goal_change_used_at = now()
  where id = v_user_id;

  for v_cycle_id in
    select id
    from public.weekly_cycles
    where user_id = v_user_id and status = 'open'
    for update
  loop
    update public.weekly_cycles
    set goal_version_id = v_new_goal_id
    where id = v_cycle_id;

    delete from public.daily_mission_items
    where daily_mission_id in (
      select id from public.daily_missions where weekly_cycle_id = v_cycle_id
    ) and mission_type in ('exercise', 'focus');

    perform public.refresh_week_system(v_cycle_id);
  end loop;
end;
$$;

revoke all on function public.update_goal_configuration_once(
  numeric,integer,text,text,integer,integer,integer,time,integer,integer
) from public;

grant execute on function public.update_goal_configuration_once(
  numeric,integer,text,text,integer,integer,integer,time,integer,integer
) to authenticated;
