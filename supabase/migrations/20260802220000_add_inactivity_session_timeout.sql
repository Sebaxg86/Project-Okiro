-- Keep the Supabase refresh session, but enforce Okiro's rolling 15-day inactivity policy.
alter table public.profiles
  add column last_active_at timestamptz not null default now();

update public.profiles
set last_active_at = now()
where last_active_at is null;

create or replace function public.touch_session_activity()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.profiles
  set last_active_at = now()
  where id = auth.uid()
    and last_active_at < now() - interval '5 minutes';
end;
$$;

revoke all on function public.touch_session_activity() from public;
grant execute on function public.touch_session_activity() to authenticated;
