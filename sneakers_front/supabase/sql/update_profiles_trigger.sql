-- Synchronize auth.users inserts with the new public.profiles schema.
-- Run this in the Supabase SQL editor or apply it as a migration.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Keep columns aligned with actual profiles table definition
  insert into public.profiles (id, is_admin)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false)
  )
  on conflict (id) do update
    set is_admin = excluded.is_admin;

  return new;
end;
$$;

-- Ensure the trigger exists and points to the recreated function.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
