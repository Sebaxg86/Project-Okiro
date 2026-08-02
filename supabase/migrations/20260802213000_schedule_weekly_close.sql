-- Supabase Cron runs the idempotent close audit hourly. Each cycle closes only
-- after Monday at 12:00 in the user's configured timezone.

create extension if not exists pg_cron;

grant execute on function public.close_week(uuid) to service_role;
grant execute on function public.close_eligible_weeks() to service_role;

select cron.schedule(
  'okiro-close-eligible-weeks',
  '5 * * * *',
  'select public.close_eligible_weeks()'
);

