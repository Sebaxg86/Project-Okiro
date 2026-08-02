-- Keep the mission generator warning-free after the weekly system was deployed.
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
