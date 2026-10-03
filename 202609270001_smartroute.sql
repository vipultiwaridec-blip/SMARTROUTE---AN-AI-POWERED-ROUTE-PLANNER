-- SmartRoute Supabase schema. Apply in the Supabase SQL Editor or with Supabase CLI.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  vehicle_number text not null,
  type text not null check (type in ('truck', 'van')),
  capacity text,
  status text not null default 'available' check (status in ('available', 'on_route', 'maintenance')),
  created_at timestamptz not null default now()
);

create table if not exists public.route_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  origin text not null,
  destination text not null,
  stops text[] not null default '{}',
  vehicle_type text not null default 'truck' check (vehicle_type in ('truck', 'van')),
  selected_route_id text,
  route_result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.route_candidates (
  id uuid primary key default gen_random_uuid(),
  route_plan_id uuid not null references public.route_plans(id) on delete cascade,
  name text not null,
  label text not null,
  distance_km numeric(10, 2) not null,
  duration_minutes integer not null,
  traffic jsonb not null,
  weather jsonb not null,
  risk_level text not null check (risk_level in ('Low', 'Moderate', 'High')),
  score_breakdown jsonb not null,
  overall_score integer not null check (overall_score between 0 and 100),
  geometry jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  route_plan_id uuid references public.route_plans(id) on delete set null,
  origin text not null,
  destination text not null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  status text not null default 'planned' check (status in ('planned', 'on_route', 'delivered', 'cancelled')),
  eta timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists vehicles_user_id_idx on public.vehicles(user_id);
create index if not exists route_plans_user_created_idx on public.route_plans(user_id, created_at desc);
create index if not exists route_candidates_plan_idx on public.route_candidates(route_plan_id);
create index if not exists deliveries_user_created_idx on public.deliveries(user_id, created_at desc);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.route_plans enable row level security;
alter table public.route_candidates enable row level security;
alter table public.deliveries enable row level security;

drop policy if exists "profiles: own rows" on public.profiles;
create policy "profiles: own rows" on public.profiles for all to authenticated
using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "vehicles: own rows" on public.vehicles;
create policy "vehicles: own rows" on public.vehicles for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "route plans: own rows" on public.route_plans;
create policy "route plans: own rows" on public.route_plans for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "route candidates: owner plans only" on public.route_candidates;
create policy "route candidates: owner plans only" on public.route_candidates for all to authenticated
using (exists (select 1 from public.route_plans p where p.id = route_plan_id and p.user_id = auth.uid()))
with check (exists (select 1 from public.route_plans p where p.id = route_plan_id and p.user_id = auth.uid()));

drop policy if exists "deliveries: own rows" on public.deliveries;
create policy "deliveries: own rows" on public.deliveries for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
