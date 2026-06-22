-- ===========================================================================
-- Learning Tracker — Supabase schema + Row-Level Security
-- Run this in the Supabase dashboard → SQL Editor (or `supabase db` / psql).
--
-- Model: one row per authenticated user, keyed by their auth user id. RLS makes
-- every row readable/writable ONLY by its owner, so shipping the anon key in
-- client code (config.js) is safe.
-- ===========================================================================

-- 1) Table -------------------------------------------------------------------
-- We DROP first so this script is idempotent and so it replaces any earlier
-- table — e.g. the old shared "sync code" model that used a text `id` column.
-- `create table if not exists` will NOT add the new `user_id` column to an
-- existing table, which is what causes: ERROR 42703 column "user_id" does not
-- exist. Dropping discards old rows (the shared sync-code data isn't tied to a
-- user account, so it can't be migrated automatically anyway).
drop table if exists public.tracker_state cascade;

create table public.tracker_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,   -- { custom, edits, topicEdits, order, state }
  updated_at timestamptz not null default now()
);

-- 2) Enable Row-Level Security ----------------------------------------------
alter table public.tracker_state enable row level security;

-- 3) Policies — a user may only touch their own row -------------------------
drop policy if exists "tracker_state_select_own" on public.tracker_state;
create policy "tracker_state_select_own"
  on public.tracker_state for select
  using (auth.uid() = user_id);

drop policy if exists "tracker_state_insert_own" on public.tracker_state;
create policy "tracker_state_insert_own"
  on public.tracker_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "tracker_state_update_own" on public.tracker_state;
create policy "tracker_state_update_own"
  on public.tracker_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tracker_state_delete_own" on public.tracker_state;
create policy "tracker_state_delete_own"
  on public.tracker_state for delete
  using (auth.uid() = user_id);

-- 4) Realtime — let the client subscribe to its own row's changes -----------
-- (RLS still applies to realtime, so users only receive their own updates.)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'tracker_state'
  ) then
    alter publication supabase_realtime add table public.tracker_state;
  end if;
end $$;

-- 5) Keep updated_at fresh on every write -----------------------------------
create or replace function public.tracker_state_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_tracker_state_touch on public.tracker_state;
create trigger trg_tracker_state_touch
  before update on public.tracker_state
  for each row execute function public.tracker_state_touch_updated_at();
