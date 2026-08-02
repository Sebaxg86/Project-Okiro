-- Keep onboarding state and historical goals writable only through trusted functions.

alter function public.complete_onboarding(
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
) security definer;

drop policy if exists "goals_insert_own" on public.goal_versions;
drop policy if exists "cycles_insert_own" on public.weekly_cycles;

revoke insert on public.goal_versions from authenticated;
revoke insert on public.weekly_cycles from authenticated;
revoke update on public.profiles from authenticated;

grant update (
  full_name,
  display_name,
  username,
  avatar_path,
  birth_date,
  timezone,
  locale,
  unit_system
) on public.profiles to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.complete_onboarding(
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
) from public, anon;

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

