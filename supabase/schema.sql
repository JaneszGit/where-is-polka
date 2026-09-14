-- Futtasd le a Supabase projekt SQL Editor-jában.

create table if not exists settings (
  id int primary key default 1,
  reference_sunday date not null,
  owner_at_reference text not null check (owner_at_reference in ('me', 'rita')),
  owner_me_name text default 'Nálam',
  owner_rita_name text default 'Ritánál',
  constraint single_row check (id = 1)
);

-- Csak egy sor legyen benne: állítsd be a saját adataidra.
insert into settings (id, reference_sunday, owner_at_reference, owner_me_name, owner_rita_name)
values (1, '2026-01-04', 'me', 'Nálam', 'Ritánál')
on conflict (id) do nothing;

create table if not exists overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  owner text not null check (owner in ('me', 'rita')),
  note text,
  created_at timestamptz default now()
);

create table if not exists game_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null default 'Polka',
  score int not null,
  created_at timestamptz default now()
);

-- Row Level Security: mivel ez egy privát, kettesben használt app,
-- egyszerűség kedvéért engedjük az anon key-es olvasást/írást.
-- (Ha publikusra teszed, ezt szigorítsd!)
alter table settings enable row level security;
alter table overrides enable row level security;
alter table game_scores enable row level security;

create policy "public read settings" on settings for select using (true);
create policy "public update settings" on settings for update using (true);

create policy "public read overrides" on overrides for select using (true);
create policy "public write overrides" on overrides for insert with check (true);
create policy "public update overrides" on overrides for update using (true);
create policy "public delete overrides" on overrides for delete using (true);

create policy "public read scores" on game_scores for select using (true);
create policy "public write scores" on game_scores for insert with check (true);
