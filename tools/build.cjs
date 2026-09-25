#!/usr/bin/env node
// Erzeugt die statischen Seiten aller Sprachen aus src/.
//
//   node tools/build.cjs          Seiten schreiben
//   node tools/build.cjs --check  nur prüfen, ob alles aktuell ist (Test, vor dem Push)
//
// Quellen: src/index.html (Aufbau, CSS, JavaScript mit {{Platzhaltern}}), src/lang/<sprache>.cjs (Texte),
// src/legal/<sprache>.html (Rechtstexte), src/site.cjs (Version, Sprachen).
// Ergebnis: index.html (Deutsch), fr/ it/ en/index.html, Teilen-Seiten tragwerk/ und open-mcp-cad/ pro Sprache,
// sitemap.xml und der Sprachblock in desktop-login.js.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const site = require(path.join(ROOT, 'src/site.cjs'));
const check = process.argv.includes('--check');

const LANGS = site.languages;
const lang = {};
for (const l of LANGS) {
  const file = path.join(ROOT, 'src/lang', l + '.cjs');
  delete require.cache[require.resolve(file)];
  lang[l] = require(file);
}
const version = site.tragwerkVersion, downloadUrl = site.downloadUrl(version);
const base = l => (l === 'de' ? '/' : '/' + l + '/');
const url = (l, p) => site.origin + base(l) + (p || '');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const withVersion = v => (typeof v === 'string' ? v.split('%VERSION%').join(version) : v);
const attr = v => String(v).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsStr = v => String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/<\/(script)/gi, '<\\/$1');
const json = v => JSON.stringify(v).replace(/</g, '\\u003c');

// Jede Sprache muss dieselben Schlüssel haben wie Deutsch
const problems = [];
for (const l of LANGS) {
  for (const sec of ['t', 'meta', 'langSwitch', 'share', 'og', 'desktop']) {
    for (const k of Object.keys(lang.de[sec])) {
      if (lang[l][sec] == null || lang[l][sec][k] == null) problems.push(l + ': fehlt ' + sec + '.' + k);
    }
    for (const k of Object.keys(lang[l][sec] || {})) if (lang.de[sec][k] == null) problems.push(l + ': unbekannt ' + sec + '.' + k);
  }
}
if (problems.length) fail(problems);

function fail(list) { console.error(list.join('\n')); process.exit(1); }

function langLinks(cur, kind) {
  return LANGS.map(l => {
    const d = lang[l], current = l === cur ? ' aria-current="true"' : '';
    const a = '<a href="' + base(l) + '" data-href="' + base(l) + '" data-lang="' + l + '" hreflang="' + l + '" lang="' + d.htmlLang + '"' + current + '>';
    if (kind === 'menu') return '            ' + a + d.name + '<span>' + l.toUpperCase() + '</span></a>';
    if (kind === 'short') return a + l.toUpperCase() + '</a>';
    return a + d.name + '</a>';
  }).join(kind === 'menu' ? '\n' : kind === 'footer' ? ' · ' : '');
}

function alternates(p) {
  return LANGS.map(l => '  <link rel="alternate" hreflang="' + l + '" href="' + url(l, p) + '" />').join('\n') +
    '\n  <link rel="alternate" hreflang="x-default" href="' + url('de', p) + '" />';
}

function ogImage(l, name) {   // ?v= zwingt WhatsApp und LinkedIn, ein geändertes Bild neu zu laden (site.ogVersion)
  const v = (site.ogVersion || {})[name];
  return site.origin + '/og/' + (l === 'de' ? '' : l + '/') + name + '.png' + (v ? '?v=' + v : '');
}

function headMeta(l) {
  const d = lang[l], m = d.meta;
  return [
    '  <title>' + m.title + '</title>',
    '  <meta name="description" content="' + attr(m.description) + '" />',
    '  <link rel="canonical" href="' + url(l) + '" />',
    alternates(''),
    '  <meta property="og:type" content="website" />',
    '  <meta property="og:site_name" content="LignoAI" />',
    '  <meta property="og:title" content="' + attr(m.title) + '" />',
    '  <meta property="og:description" content="Open MCP CAD · LignoPlan · LignoCAD Tragwerk" />',
    '  <meta property="og:url" content="' + url(l) + '" />',
    '  <meta property="og:locale" content="' + d.ogLocale + '" />',
    ...LANGS.filter(o => o !== l).map(o => '  <meta property="og:locale:alternate" content="' + lang[o].ogLocale + '" />'),
    '  <meta property="og:image" content="' + ogImage(l, 'lignoai') + '" />',
    '  <meta property="og:image:width" content="1200" />',
    '  <meta property="og:image:height" content="630" />',
    '  <meta property="og:image:alt" content="' + attr(m.ogImageAlt) + '" />',
  ].join('\n');
}

// Von der deutschen Startseite zur gespeicherten Sprache, bevor etwas angezeigt wird. Suchmaschinen speichern nichts.
const REDIRECT = '  <script>(function () { try { var p = localStorage.getItem(\'lignoai-lang\'); if (/^(fr|it|en)$/.test(p || \'\')) location.replace(\'/\' + p + \'/\' + location.search + location.hash); } catch (e) {} })();</script>\n';

function renderIndex(l) {
  const d = lang[l];
  const special = {
    lang: l, htmlLang: d.htmlLang, locale: d.locale, name: d.name, langCode: l.toUpperCase(), path: base(l),
    headMeta: headMeta(l), langRedirect: l === 'de' ? REDIRECT : '', downloadUrl,
    legal: read('src/legal/' + l + '.html').replace(/\n$/, ''),
    langLinksMenu: langLinks(l, 'menu'), langLinksShort: langLinks(l, 'short'), langLinksFooter: langLinks(l, 'footer'),
    langOptions: LANGS.map(o => '<option value="' + o + '">' + lang[o].name + '</option>').join(''),
    langSuggestJson: json(Object.fromEntries(LANGS.filter(o => o !== l).map(o => [o, {
      text: lang[o].langSwitch.suggest, yes: lang[o].langSwitch.suggestYes, no: lang[o].langSwitch.suggestNo, href: base(o),
    }]))),
  };
  const RAW = new Set(['headMeta', 'langRedirect', 'legal', 'langLinksMenu', 'langLinksShort', 'langLinksFooter', 'langOptions', 'langSuggestJson']);
  const tpl = read('src/index.html');
  const cut = tpl.indexOf('<script>\n  (function () {');
  const value = key => {
    let v = key in special ? special[key] : key.startsWith('langSwitch.') ? d.langSwitch[key.slice(11)] : d.t[key];
    if (v == null) throw new Error(l + ': Platzhalter ohne Text {{' + key + '}}');
    return withVersion(v);
  };
  const html = tpl.slice(0, cut).replace(/(="?)?\{\{([\w.]+)\}\}/g, (m, pre, key) => {
    const v = value(key);
    if (pre && /"/.test(v)) throw new Error(l + ': Anführungszeichen im Attribut {{' + key + '}}');
    return (pre || '') + v;
  });
  const script = tpl.slice(cut).replace(/\{\{([\w.]+)\}\}/g, (m, key) => {
    const v = value(key);
    if (RAW.has(key)) return v;
    if (/&[a-z#0-9]+;/i.test(v)) throw new Error(l + ': HTML-Entität im JavaScript {{' + key + '}}');
    return jsStr(v);
  });
  return html + script;
}

function renderShare(l, kind) {
  const d = lang[l], s = d.share, anchor = kind === 'tragwerk' ? 'tragwerk' : 'mcp';
  const title = s[kind === 'tragwerk' ? 'tragwerkTitle' : 'mcpTitle'], desc = s[kind === 'tragwerk' ? 'tragwerkDesc' : 'mcpDesc'];
  const alt = s[kind === 'tragwerk' ? 'tragwerkAlt' : 'mcpAlt'], link = s[kind === 'tragwerk' ? 'tragwerkLink' : 'mcpLink'];
  const ogTitle = kind === 'tragwerk' ? 'LignoCAD Tragwerk' : 'Open MCP CAD';
  const target = base(l) + '#' + anchor;
  return `<!doctype html>
<html lang="${d.htmlLang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${attr(desc)}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${url(l)}#${anchor}">
<!-- Teilen-Link, erzeugt von tools/build.cjs: eigene Vorschau für WhatsApp, LinkedIn und Co., Besucher landen direkt beim Produkt -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="LignoAI">
<meta property="og:locale" content="${d.ogLocale}">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${url(l, kind)}">
<meta property="og:image" content="${ogImage(l, kind)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="icon" href="/favicon.ico?v=2" sizes="any">
</head><body style="font:17px/1.6 system-ui;padding:40px;color:#203728">
<p><a href="${target}" style="color:#16783a">${link}</a></p>
</body></html>
`;
}

function renderSitemap() {
  const alt = LANGS.map(l => '    <xhtml:link rel="alternate" hreflang="' + l + '" href="' + url(l) + '"/>').join('\n') +
    '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + url('de') + '"/>';
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    LANGS.map(l => '  <url>\n    <loc>' + url(l) + '</loc>\n' + alt + '\n  </url>').join('\n') + '\n</urlset>\n';
}

// Texte der App-Anmeldeseite stehen direkt in desktop-login.js (zwischen den Markierungen), damit der Test sie mitprüft.
function renderDesktopJs() {
  const src = read('desktop-login.js');
  const a = src.indexOf('// i18n:start'), b = src.indexOf('// i18n:end');
  if (a < 0 || b < a) throw new Error('desktop-login.js: Markierungen i18n:start/i18n:end fehlen');
  const block = '// i18n:start (erzeugt von tools/build.cjs aus src/lang, nicht von Hand ändern)\n  const I18N={\n' +
    LANGS.map(l => '    ' + l + ':' + json(Object.assign({ htmlLang: lang[l].htmlLang, home: base(l) }, lang[l].desktop))).join(',\n') + '\n  };\n  ';
  return src.slice(0, a) + block + src.slice(b);
}

const out = {};
for (const l of LANGS) {
  const dir = l === 'de' ? '' : l + '/';
  out[dir + 'index.html'] = renderIndex(l);
  out[dir + 'tragwerk/index.html'] = renderShare(l, 'tragwerk');
  out[dir + 'open-mcp-cad/index.html'] = renderShare(l, 'open-mcp-cad');
}
out['sitemap.xml'] = renderSitemap();
out['desktop-login.js'] = renderDesktopJs();

const stale = [];
for (const [f, content] of Object.entries(out)) {
  const file = path.join(ROOT, f);
  const now = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
  if (now === content) continue;
  if (check) { stale.push(f); continue; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('geschrieben: ' + f);
}
if (check && stale.length) fail(['Nicht aktuell, bitte node tools/build.cjs ausführen:', ...stale]);
if (check) console.log('PASS: alle Sprachseiten sind aktuell (' + Object.keys(out).length + ' Dateien)');
