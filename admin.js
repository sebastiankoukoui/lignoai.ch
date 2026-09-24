'use strict';
// Admin overview for LignoCAD Tragwerk licences. The page only displays data and forwards clicks.
// The edge function license-admin checks the session and the admin allowlist and does every write.
(function () {
  var SUPABASE_URL = 'https://djijagmwottlscxguimc.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_ON8omA_Oi-uwTLBkQE6_5A_35SmXxpf';
  var ENDPOINT = SUPABASE_URL + '/functions/v1/license-admin';
  var $ = function (id) { return document.getElementById(id); };
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    // Same storage key as the main site, so a login on lignoai.ch also counts here.
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'lignoplan-auth' }
  });
  var accounts = [], filter = 'provisional', session = null, sentTo = '';

  var STATUS = {
    provisional: 'Vorläufig', active: 'Aktiv', expired: 'Abgelaufen', revoked: 'Gesperrt',
    inactive: 'Inaktiv', pending: 'Startet später', none: 'Keine Lizenz'
  };
  var FILTERS = [
    ['provisional', 'Vorläufig'], ['active', 'Aktiv'], ['soon', 'Läuft bald ab'],
    ['ended', 'Abgelaufen oder gesperrt'], ['none', 'Ohne Lizenz'], ['all', 'Alle']
  ];

  function toast(text) {
    var t = $('toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function fmt(v) { return v ? new Date(v).toLocaleDateString('de-CH', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; }
  function daysLeft(v) { return v ? Math.ceil((Date.parse(v) - Date.now()) / 86400000) : null; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function soon(a) { var d = daysLeft(a.license.validUntil); return a.license.status === 'active' && d !== null && d <= 14; }
  function matches(a) {
    var s = a.license.status;
    if (filter === 'provisional' && s !== 'provisional') return false;
    if (filter === 'active' && s !== 'active') return false;
    if (filter === 'soon' && !soon(a)) return false;
    if (filter === 'ended' && ['expired', 'revoked', 'inactive'].indexOf(s) < 0) return false;
    if (filter === 'none' && s !== 'none') return false;
    var q = $('search').value.trim().toLowerCase();
    return !q || [a.name, a.email, a.organization].join(' ').toLowerCase().indexOf(q) >= 0;
  }

  async function api(body) {
    var res = await fetch(ENDPOINT, {
      method: 'POST', signal: AbortSignal.timeout(20000),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify(body)
    });
    var data = await res.json().catch(function () { return {}; });
    if (res.status === 403) throw Error('Dieses Konto hat keinen Admin-Zugriff.');
    if (!res.ok || !data.accounts) throw Error('Das hat nicht geklappt (' + (data.error || res.status) + '). Bitte nochmals versuchen.');
    return data.accounts;
  }

  async function load() {
    $('listMsg').textContent = 'Wird geladen …';
    try { accounts = await api({ type: 'admin_list' }); $('listMsg').textContent = ''; render(); }
    catch (e) { $('listMsg').textContent = e.message; $('listMsg').className = 'msg error'; }
  }

  async function act(a, body, done) {
    body.type = 'admin_action'; body.user_id = a.id;
    try { accounts = await api(body); render(); toast(done); }
    catch (e) { toast(e.message); }
  }

  function renderStats() {
    var count = function (f) { var keep = filter; filter = f; var q = $('search').value; $('search').value = ''; var n = accounts.filter(matches).length; filter = keep; $('search').value = q; return n; };
    var box = $('stats'); box.replaceChildren();
    [['provisional', 'Warten auf Prüfung'], ['active', 'Aktive Lizenzen'], ['soon', 'Laufen bald ab'], ['all', 'Konten total']].forEach(function (p) {
      var b = el('button', 'stat' + (filter === p[0] ? ' active' : '')); b.type = 'button';
      b.appendChild(el('div', 'k', p[1])); b.appendChild(el('div', 'v', String(count(p[0]))));
      b.addEventListener('click', function () { filter = p[0]; render(); });
      box.appendChild(b);
    });
  }

  function renderChips() {
    var box = $('chips'); box.replaceChildren();
    FILTERS.forEach(function (f) {
      var c = el('button', 'chip' + (filter === f[0] ? ' on' : ''), f[1]); c.type = 'button';
      c.addEventListener('click', function () { filter = f[0]; render(); });
      box.appendChild(c);
    });
  }

  function menuButton(menu, label, fn, cls) {
    var b = el('button', cls || '', label); b.type = 'button';
    b.addEventListener('click', function () { menu.closest('details').open = false; fn(); });
    menu.appendChild(b);
  }

  function renderRow(a) {
    var row = el('div', 'row'), s = a.license.status;
    var who = el('div');
    who.appendChild(el('div', 'n', a.name || a.email));
    if (a.name) who.appendChild(el('div', 'e', a.email));
    who.appendChild(el('div', 'meta', [a.accountTypeLabel, a.organization, 'über ' + a.source, 'registriert ' + fmt(a.createdAt)].filter(Boolean).join(' · ')));
    row.appendChild(who);

    var lic = el('div', 'lic');
    lic.appendChild(el('span', 'badge b-' + s, STATUS[s] || s));
    if (a.license.plan) lic.appendChild(el('div', 'plan', a.license.plan));
    if (a.license.validUntil && s !== 'none') {
      var d = daysLeft(a.license.validUntil);
      var u = el('div', 'until' + (d !== null && d >= 0 && d <= 14 ? ' soon' : ''), 'bis ' + fmt(a.license.validUntil) + (d !== null && d >= 0 ? ' (noch ' + d + (d === 1 ? ' Tag)' : ' Tage)') : ''));
      lic.appendChild(u);
    }
    row.appendChild(lic);

    var dev = el('div', 'dev', s === 'none' ? '' : 'Geräte ' + a.devices + ' von ' + (a.license.maxDevices || 1));
    if (a.lastSeenAt) dev.appendChild(el('div', 'meta', 'zuletzt ' + fmt(a.lastSeenAt)));
    row.appendChild(dev);

    var actions = el('div', 'actions');
    var main = el('button', 'btn-primary btn-sm', s === 'provisional' ? 'Freigeben, 3 Monate' : s === 'active' || s === 'pending' ? '+3 Monate' : 'Freischalten, 3 Monate'); main.type = 'button';
    main.addEventListener('click', function () { main.disabled = true; act(a, { action: 'extend', months: 3 }, 'Lizenz um 3 Monate verlängert.'); });
    actions.appendChild(main);

    var more = el('details', 'more'), sum = el('summary', '', '···'), menu = el('div', 'menu');
    sum.setAttribute('aria-label', 'Weitere Aktionen');
    more.appendChild(sum); more.appendChild(menu);
    menu.appendChild(el('div', 'lbl', 'Verlängern'));
    [[1, '+1 Monat'], [6, '+6 Monate'], [12, '+12 Monate']].forEach(function (m) {
      menuButton(menu, m[1], function () { act(a, { action: 'extend', months: m[0] }, 'Lizenz verlängert.'); });
    });
    if (s !== 'none') {
      menu.appendChild(el('div', 'sep'));
      menu.appendChild(el('div', 'lbl', 'Geräte'));
      [1, 2, 3].forEach(function (n) {
        if (n !== a.license.maxDevices) menuButton(menu, 'Auf ' + n + (n === 1 ? ' Gerät' : ' Geräte') + ' setzen', function () { act(a, { action: 'max_devices', max_devices: n }, 'Geräteanzahl geändert.'); });
      });
      if (a.devices > 0) menuButton(menu, 'Geräte zurücksetzen', function () {
        if (confirm('Alle angemeldeten Geräte von ' + (a.name || a.email) + ' abmelden? Die App meldet sich beim nächsten Start neu an.')) act(a, { action: 'reset_devices' }, 'Geräte zurückgesetzt.');
      });
      if (['revoked', 'inactive'].indexOf(s) < 0) {
        menu.appendChild(el('div', 'sep'));
        menuButton(menu, 'Lizenz sperren', function () {
          if (confirm('Lizenz von ' + (a.name || a.email) + ' sperren?')) act(a, { action: 'revoke' }, 'Lizenz gesperrt.');
        }, 'danger');
      }
    }
    menu.appendChild(el('div', 'sep'));
    var mb = el('button', '', 'E-Mail schreiben'); mb.type = 'button';
    mb.addEventListener('click', function () { location.href = 'mailto:' + a.email; });
    menu.appendChild(mb);
    actions.appendChild(more);
    row.appendChild(actions);
    return row;
  }

  function render() {
    renderStats(); renderChips();
    var list = $('list'), shown = accounts.filter(matches);
    list.replaceChildren.apply(list, shown.map(renderRow));
    if (!shown.length) list.appendChild(el('p', 'empty', 'Keine Konten in dieser Ansicht.'));
  }

  function showLogin() { $('loginView').hidden = false; $('adminView').hidden = true; $('logout').hidden = true; $('me').textContent = ''; }
  function showAdmin() {
    $('loginView').hidden = true; $('adminView').hidden = false; $('logout').hidden = false;
    $('me').textContent = session.user.email; load();
  }

  $('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button'); btn.disabled = true;
    sentTo = $('email').value.trim().toLowerCase();
    var res = await sb.auth.signInWithOtp({ email: sentTo, options: { shouldCreateUser: false, emailRedirectTo: location.origin + '/admin.html' } });
    btn.disabled = false;
    if (res.error) { $('loginMsg').textContent = 'Die E-Mail konnte nicht gesendet werden. Bitte später nochmals versuchen.'; $('loginMsg').className = 'msg error'; return; }
    $('codeForm').hidden = false; $('code').focus();
    $('loginMsg').className = 'msg'; $('loginMsg').textContent = 'Wir haben dir einen Code geschickt. Du kannst auch den Link in der E-Mail in diesem Browser öffnen.';
  });
  $('codeForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = e.target.querySelector('button'); btn.disabled = true;
    var res = await sb.auth.verifyOtp({ email: sentTo, token: $('code').value.replace(/\D/g, ''), type: 'email' });
    btn.disabled = false;
    if (res.error) { $('loginMsg').textContent = 'Der Code stimmt nicht oder ist abgelaufen.'; $('loginMsg').className = 'msg error'; }
  });
  $('logout').addEventListener('click', function () { sb.auth.signOut({ scope: 'local' }); });
  $('reload').addEventListener('click', load);
  $('search').addEventListener('input', render);
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.more[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });

  sb.auth.onAuthStateChange(function (event, s) {
    var had = !!session; session = s;               // token refreshes only swap the session
    if (event === 'INITIAL_SESSION' && location.search) history.replaceState(null, '', location.pathname);
    if (!s) { showLogin(); return; }
    if (!had) showAdmin();
  });
})();
