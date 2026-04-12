-- Track required legal acceptance for account creation
alter table public.profiles
add column if not exists terms_accepted_at timestamptz,
add column if not exists privacy_accepted_at timestamptz,
add column if not exists legal_policy_version text;

-- Ensure auth signup metadata can populate legal acceptance fields
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id,
    name,
    avatar_url,
    timezone,
    terms_accepted_at,
    privacy_accepted_at,
    legal_policy_version
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'timezone', 'America/New_York'),
    nullif(new.raw_user_meta_data->>'terms_accepted_at', '')::timestamptz,
    nullif(new.raw_user_meta_data->>'privacy_accepted_at', '')::timestamptz,
    nullif(new.raw_user_meta_data->>'legal_policy_version', '')
  )
  on conflict (id) do update
    set terms_accepted_at = coalesce(public.profiles.terms_accepted_at, excluded.terms_accepted_at),
        privacy_accepted_at = coalesce(public.profiles.privacy_accepted_at, excluded.privacy_accepted_at),
        legal_policy_version = coalesce(public.profiles.legal_policy_version, excluded.legal_policy_version);

  return new;
end;
$$;
