// ---------------------------------------------------------------------------
// auth.js — shared sign-in gate + single Supabase client for all pages.
//
// Load order on every page:  config.js → @supabase/supabase-js → auth.js
//
// A page opts into a HARD gate (redirect to the home page unless the visitor is
// signed in) by adding the data-require-auth attribute:
//     <script src="auth.js" data-require-auth></script>
// The home page (index.html) loads it WITHOUT that attribute: it stays visible
// and drives the sign-in / account UI via window.LT_AUTH.
//
// Note: this is client-side FLOW control, not a hard security boundary — the
// real protection is Supabase Row-Level Security (see supabase/schema.sql), so
// no one can read/write another user's row regardless of this gate.
// ---------------------------------------------------------------------------
(function () {
  var CFG = window.APP_CONFIG || {};
  var RAW_URL = CFG.SUPABASE_URL || '';
  var URL = RAW_URL ? (RAW_URL.indexOf('http') === 0 ? RAW_URL : 'https://' + RAW_URL) : '';
  var KEY = CFG.SUPABASE_ANON_KEY || '';
  var configured = !!URL && !!KEY && !!window.supabase;

  var script = document.currentScript;
  var requireAuth = !!(script && script.hasAttribute('data-require-auth'));

  var client = configured ? window.supabase.createClient(URL, KEY) : null;
  var currentUser = null;
  var listeners = [];
  var resolveReady;
  var ready = new Promise(function (res) { resolveReady = res; });

  function emit() {
    listeners.forEach(function (fn) { try { fn(currentUser); } catch (e) {} });
  }

  // index.html sits next to every module page, so a plain relative path works
  // on GitHub Pages / Vercel / Netlify / localhost alike.
  function goHome() {
    var here = (location.pathname.split('/').pop() || '');
    var next = here && here !== 'index.html' ? ('?next=' + encodeURIComponent(here)) : '';
    location.replace('index.html' + next);
  }

  function reveal() { document.documentElement.classList.remove('lt-checking'); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Render a compact "Signed in as … · Sign out" chip into #lt-account on any
  // page that provides that container (the module page headers). Repaints on
  // every auth change.
  function mountAccountChip() {
    var el = document.getElementById('lt-account');
    if (!el) return;
    function paint() {
      if (!currentUser) { el.innerHTML = ''; el.hidden = true; return; }
      el.hidden = false;
      el.innerHTML =
        '<span class="lt-acct-who">Signed in as <strong>' +
        escapeHtml(currentUser.email || currentUser.id) + '</strong></span>' +
        '<button type="button" class="lt-acct-out">Sign out</button>';
      var btn = el.querySelector('.lt-acct-out');
      if (btn) btn.onclick = function () { signOut(); };
    }
    listeners.push(paint);
    paint();
  }

  function signInWithGoogle() {
    if (!client) return Promise.reject(new Error('cloud-not-configured'));
    // Come back to THIS page (no hash/query) after the Google round-trip.
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: location.origin + location.pathname }
    });
  }

  function signOut() {
    if (!client) return Promise.resolve();
    return client.auth.signOut();
  }

  function settle(user) {
    currentUser = user || null;
    if (requireAuth && !currentUser) { goHome(); return; }  // gate: bounce out
    reveal();
    resolveReady(currentUser);
    emit();
  }

  function boot() {
    if (!configured) {
      // No live backend. A gated page can never be satisfied → send home,
      // where the visitor gets a clear "sign-in not set up" message.
      if (requireAuth) { goHome(); return; }
      settle(null);
      return;
    }

    client.auth.getSession()
      .then(function (r) { settle(r && r.data && r.data.session ? r.data.session.user : null); })
      .catch(function () { settle(null); });

    client.auth.onAuthStateChange(function (_evt, session) {
      var u = session ? session.user : null;
      var changed = (!!u !== !!currentUser) || (u && currentUser && u.id !== currentUser.id);
      currentUser = u;
      if (requireAuth && !currentUser) { goHome(); return; }  // signed out mid-session
      if (changed) emit();
    });
  }

  window.LT_AUTH = {
    configured: configured,
    ready: ready,
    get client() { return client; },
    get user() { return currentUser; },
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    onChange: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
    }
  };

  mountAccountChip();
  boot();
})();
