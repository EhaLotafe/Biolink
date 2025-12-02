-- -------------------------
-- RESET CLEAN
-- -------------------------
-- Supprime triggers / functions / policies / tables si elles existent
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop policy if exists users_insert on public.users;
drop policy if exists users_select on public.users;
drop policy if exists users_update on public.users;
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_select on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists links_select on public.links;
drop policy if exists links_insert on public.links;
drop policy if exists links_update on public.links;
drop policy if exists links_delete on public.links;
drop policy if exists link_clicks_insert on public.link_clicks;
drop policy if exists link_clicks_select on public.link_clicks;

drop table if exists public.link_clicks cascade;
drop table if exists public.links cascade;
drop table if exists public.themes cascade;
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;

-- -------------------------
-- CREATE TABLES
-- -------------------------

-- users : table principale liée à auth.users (utilisée dans le frontend)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  theme_id text default 'deep-space',
  views integer default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- profiles : table publique complémentaire (optionnelle, mais conservée)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- links : liens d'un utilisateur
create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  url text not null,
  icon text default 'globe',
  active boolean default true,
  position integer default 0,
  clicks integer default 0,
  created_at timestamptz default now()
);

-- link_clicks : historique (insertion publique)
create table public.link_clicks (
  id bigserial primary key,
  link_id uuid references public.links(id) on delete cascade,
  device text,
  country text,
  created_at timestamptz default now()
);

-- themes : thèmes (utilitaire)
create table public.themes (
  id serial primary key,
  name text not null,
  bg_color text not null,
  text_color text not null
);

-- Seed de thèmes (optionnel)
insert into public.themes (name, bg_color, text_color) values
('deep-space', '#050C19', '#ffffff'),
('nebula', '#0B1D3A', '#ffffff'),
('midnight', '#0b1530', '#ffffff'),
('aurora', '#0b3a23', '#ffffff');

-- -------------------------
-- ENABLE RLS
-- -------------------------
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.link_clicks enable row level security;

-- -------------------------
-- POLICIES (sécurité)
-- -------------------------

-- USERS
-- lecture publique autorisée (les profils sont publics). Si tu veux limiter, changer using() à auth.uid() = id
create policy users_select on public.users
  for select using (true);

-- insertion autorisée *uniquement* si auth.uid() = id (protéger la création d'un record pour un autre utilisateur)
create policy users_insert on public.users
  for insert with check (auth.uid() = id);

-- update autorisé uniquement pour le propriétaire
create policy users_update on public.users
  for update using (auth.uid() = id);

-- PROFILES
create policy profiles_select on public.profiles
  for select using (true);

create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = id);

create policy profiles_update on public.profiles
  for update using (auth.uid() = id);

-- LINKS
-- lecture publique (permet d'afficher les liens sur la page publique)
create policy links_select on public.links
  for select using (true);

-- insert : only owner (user must be authenticated and user_id must equal auth.uid())
create policy links_insert on public.links
  for insert with check (auth.uid() = user_id);

-- update/delete : only owner
create policy links_update on public.links
  for update using (auth.uid() = user_id);

create policy links_delete on public.links
  for delete using (auth.uid() = user_id);

-- LINK_CLICKS
-- insertion publique (pour tracker clics)
create policy link_clicks_insert on public.link_clicks
  for insert with check (true);

-- lecture des analytics : seulement si l'appelant est connecté (alternativement, on peut restreindre plus)
create policy link_clicks_select on public.link_clicks
  for select using (auth.uid() is not null);

-- -------------------------
-- TRIGGER: création automatique d'enregistrements quand auth.users ajoute un user
-- -------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert into public.users (profil principal)
  begin
    insert into public.users (id, display_name, username, avatar_url)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', new.email),
      lower(replace(coalesce(new.raw_user_meta_data->>'name', new.email), ' ', '_')),
      new.raw_user_meta_data->>'avatar_url'
    );
  exception when unique_violation then
    -- si déja présent, noop
  end;

  -- Insert into public.profiles (table complémentaire)
  begin
    insert into public.profiles (id, username, full_name, avatar_url)
    values (
      new.id,
      lower(replace(coalesce(new.raw_user_meta_data->>'name', new.email), ' ', '_')),
      coalesce(new.raw_user_meta_data->>'name', new.email),
      new.raw_user_meta_data->>'avatar_url'
    );
  exception when unique_violation then
    -- noop
  end;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------
-- CLEANUP: VACUUM ANALYZE (optionnel)
-- -------------------------
-- vacuum analyze;

