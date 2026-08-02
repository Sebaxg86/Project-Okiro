-- Apply the per-day count limits before the general nutrition XP caps.

create or replace function public.enforce_nutrition_transaction_caps()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from new_xp_rows
    where category = 'nutrition' and status = 'provisional'
  ) then
    return null;
  end if;

  with affected as (
    select distinct user_id, weekly_cycle_id
    from new_xp_rows
    where category = 'nutrition' and status = 'provisional'
  ), base as (
    select
      meal.id,
      meal.user_id,
      meal.weekly_cycle_id,
      meal.local_date,
      meal.occurred_at,
      meal.meal_type,
      public.meal_base_xp(meal.meal_type, meal.classification) as raw_xp,
      count(*) filter (where meal.meal_type <> 'snack') over (
        partition by meal.user_id, meal.local_date
        order by meal.occurred_at, meal.id
        rows between unbounded preceding and current row
      ) as main_meal_number,
      count(*) filter (
        where meal.meal_type = 'snack'
          and public.meal_base_xp(meal.meal_type, meal.classification) > 0
      ) over (
        partition by meal.user_id, meal.local_date
        order by meal.occurred_at, meal.id
        rows between unbounded preceding and current row
      ) as positive_snack_number,
      count(*) filter (
        where meal.meal_type = 'snack'
          and public.meal_base_xp(meal.meal_type, meal.classification) < 0
      ) over (
        partition by meal.user_id, meal.local_date
        order by meal.occurred_at, meal.id
        rows between unbounded preceding and current row
      ) as negative_snack_number
    from public.meal_logs meal
    join affected on affected.user_id = meal.user_id and affected.weekly_cycle_id = meal.weekly_cycle_id
    where meal.deleted_at is null
  ), eligible as (
    select base.*,
      case
        when meal_type <> 'snack' and main_meal_number > 3 then 0
        when meal_type = 'snack' and raw_xp > 0 and positive_snack_number > 2 then 0
        when meal_type = 'snack' and raw_xp < 0 and negative_snack_number > 2 then 0
        else raw_xp
      end as eligible_xp
    from base
  ), running as (
    select eligible.*,
      sum(greatest(eligible_xp, 0)) over (
        partition by user_id, local_date
        order by occurred_at, id
        rows between unbounded preceding and current row
      ) as positive_running,
      sum(greatest(-eligible_xp, 0)) over (
        partition by user_id, local_date
        order by occurred_at, id
        rows between unbounded preceding and current row
      ) as penalty_running
    from eligible
  ), scored as (
    select id,
      case when eligible_xp >= 0
        then greatest(0, least(eligible_xp, 30 - (positive_running - eligible_xp)))::integer
        else -greatest(0, least(-eligible_xp, 20 - (penalty_running - (-eligible_xp))))::integer
      end as final_xp,
      raw_xp,
      eligible_xp
    from running
  )
  update public.xp_transactions transaction
  set amount = scored.final_xp,
      attribute = case when scored.final_xp > 0 then 'vitality' else null end,
      metadata = transaction.metadata || jsonb_build_object(
        'count_limited', scored.eligible_xp <> scored.raw_xp,
        'eligible_xp', scored.eligible_xp
      )
  from scored
  where transaction.source_type = 'meal_log'
    and transaction.source_id = scored.id
    and transaction.status = 'provisional'
    and exists (select 1 from new_xp_rows inserted where inserted.id = transaction.id);

  return null;
end;
$$;

create trigger xp_transactions_enforce_nutrition_caps
after insert on public.xp_transactions
referencing new table as new_xp_rows
for each statement execute function public.enforce_nutrition_transaction_caps();

revoke all on function public.enforce_nutrition_transaction_caps() from public, anon, authenticated;

