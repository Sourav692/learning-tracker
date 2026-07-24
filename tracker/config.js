// ---------------------------------------------------------------------------
// Supabase project configuration.
//
// The anon / publishable key below is SAFE to ship in client code: every row in
// `tracker_state` is protected by Row-Level Security (see supabase/schema.sql),
// so a user can only ever read or write their OWN row once authenticated.
//
// Replace these with your own project's values (Supabase dashboard → Settings → API).
// ---------------------------------------------------------------------------
window.APP_CONFIG = {
  SUPABASE_URL: 'xkdbwpsmoayncsfvlkum.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_NuISUMUPJ89Oj0YybEiF7Q_tw7aY9h7',
  TABLE: 'tracker_state'
};
