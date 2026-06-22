# Cloud sync setup (Supabase)

The tracker stores your progress in the browser's `localStorage`, which is why
different browsers showed different progress. With Supabase configured, every
browser/device that uses the **same sync code** shares one copy of your progress,
and changes propagate live (Supabase Realtime).

## 1. Create a project

1. Go to https://supabase.com → sign in → **New project** (the free tier is fine).
2. Once it's ready, open **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon / public** API key

## 2. Create the table

Open **SQL Editor** in the Supabase dashboard, paste this, and run it:

```sql
create table if not exists public.tracker_state (
  id          text primary key,           -- your sync code
  data        jsonb not null default '{}', -- { custom, edits, state }
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.tracker_state enable row level security;

-- Allow the anonymous (public) key to read/write.
-- Privacy comes from the sync code being the primary key: rows are only
-- reachable if you know the code. Use a long, hard-to-guess code.
create policy "anon read"   on public.tracker_state for select using (true);
create policy "anon insert" on public.tracker_state for insert with check (true);
create policy "anon update" on public.tracker_state for update using (true) with check (true);
```

Then enable Realtime for the table:
**Database → Replication → `supabase_realtime`** → add `public.tracker_state`
(or in newer dashboards: **Database → Publications**).

## 3. Paste your credentials into `index.html`

Near the top of the main `<script>` block (search for `SUPABASE_URL`):

```js
const SUPABASE_URL      = 'https://abcd1234.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...your-anon-key...';
```

Commit & push to GitHub Pages.

## 4. Use it

- A pill appears bottom-right. Click it and enter a **sync code** (e.g. a long
  passphrase like `sourav-learning-9f3a2c`). Use the **same code** on every
  browser/device.
- First browser seeds the cloud from its current local data; others pull it down.
- Edits sync automatically (debounced ~0.6s) and other open tabs update live.

Pill states: `Local only` (not configured) · `Set sync code` · `Syncing…` ·
`Saving…` · `Synced` · `Sync error` (check the browser console).

## Security note

The anon key is visible in the page source — that's normal for Supabase, but it
means the only thing protecting your data is the secrecy of the **sync code**
(it's the row's primary key). For a personal learning tracker that's a reasonable
trade-off. If you want stronger isolation later, move reads/writes behind a
`security definer` RPC that takes the code as an argument and lock the table down,
or switch to Supabase Auth.
