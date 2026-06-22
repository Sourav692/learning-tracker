# Cloud sync + Google sign-in setup (Supabase)

The tracker is **local-first**: it always works in the browser using
`localStorage`. When you **sign in with Google**, your progress is backed up to
Supabase in a row that only *you* can read or write (enforced by Row-Level
Security), and changes sync live across your devices (Supabase Realtime).

> **Heads up:** Google OAuth requires the app to be served over **http/https**
> (e.g. GitHub Pages, Vercel, Netlify, or `localhost`). It will not complete the
> sign-in redirect when opening `index.html` directly via `file://`. The tracker
> itself still works offline/locally in that case — you just won't get cloud sync.

---

## 1. Create a Supabase project

1. Go to https://supabase.com → **New project** (free tier is fine).
2. Open **Project Settings → API** and copy:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon / publishable** API key

## 2. Create the table + RLS

Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql),
and run it. This creates `public.tracker_state` (one row per user, keyed by
`auth.uid()`), enables RLS with owner-only policies, adds the table to Realtime,
and adds an `updated_at` trigger.

## 3. Enable Google as an auth provider

> **Note:** Google renamed/moved this. The old "APIs & Services → OAuth consent
> screen" is now the **Google Auth Platform** section (left nav: Overview,
> Branding, Audience, Clients, Data Access, …). The steps below use the new UI.

**a. Get the Supabase callback URL first.** In **Supabase → Authentication →
Providers → Google**, toggle it on and copy the **Callback URL** it shows, e.g.
`https://abcd1234.supabase.co/auth/v1/callback`. Leave this tab open.

**b. Configure the consent screen (Google Cloud Console → Google Auth Platform).**
Open https://console.cloud.google.com → search "**Google Auth Platform**" (or
**APIs & Services → OAuth consent screen**, which redirects there). If it's your
first time, click **Get started** and fill the wizard; otherwise set each tab:
   - **Branding**: App name + user support email (logo optional). Save.
   - **Audience**: set **User type = External**. You can leave **Publishing status =
     Testing**; under **Test users** click **Add users** and add your own Google
     address (only listed test users can sign in while in Testing).

**c. Create the OAuth client.** Left nav → **Clients** → **Create client** (or
**+ Create credentials → OAuth client ID** under the classic Credentials page):
   - **Application type: Web application**, give it a name.
   - **Authorized redirect URIs → Add URI** → paste the Supabase **Callback URL**
     from step (a).
   - *(Optional)* **Authorized JavaScript origins** → add your app's origin
     (e.g. `https://<you>.github.io` and/or `http://localhost:8765`).
   - **Create**, then copy the **Client ID** and **Client secret**.

**d. Paste back into Supabase.** Return to the Supabase Google provider tab from
step (a), paste the **Client ID** and **Client secret**, and **Save**.

## 4. Allow your app's URL to receive the redirect

In **Supabase → Authentication → URL Configuration**:
- **Site URL**: your deployed app URL (e.g. `https://<you>.github.io/learning-tracker/`).
- **Redirect URLs**: add the same URL (and `http://localhost:5173/` or whatever
  you use locally). The app redirects back to `window.location` after sign-in.

## 5. Point the app at your project

Edit [`config.js`](config.js):

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://abcd1234.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_...your-anon-key...',
  TABLE: 'tracker_state'
};
```

Commit & deploy (e.g. push to GitHub Pages).

## 6. Use it

- A pill appears bottom-right:
  - **Local only** — Supabase not configured in `config.js`.
  - **Sign in to sync** — configured but logged out. Click it → **Continue with Google**.
  - **Syncing… / Saving… / Synced** — signed in and syncing.
  - **Sync error** — check the browser console.
- On first sign-in, if your cloud row is empty it's **seeded from this browser's
  local data**; otherwise the cloud copy is pulled down (cloud wins).
- Edits sync automatically (debounced ~0.6s); other open tabs/devices update live.
- Click the pill while signed in to see your account and **Sign out** (local data
  stays on the device).

## Security model

- The anon key in `config.js` is **meant** to be public. Every `tracker_state`
  row is gated by RLS policies (`auth.uid() = user_id`), so one user can never
  read or write another's data, even with the key.
- Realtime also respects RLS — you only receive change events for your own row.
