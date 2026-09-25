'use strict';
// Prüft die Sprachseiten: Build aktuell, Textregeln, Kopfzeilen, JavaScript lauffähig.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), { execFileSync } = require('node:child_process');
const ROOT = path.join(__dirname, '..'), read = f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n');
const site = require(path.join(ROOT, 'src/site.cjs'));

// 1. Alle erzeugten Dateien entsprechen den Quellen
execFileSync(process.execPath, [path.join(ROOT, 'tools/build.cjs'), '--check'], { stdio: 'inherit' });

// 2. Textregeln: keine Gedankenstriche, keine Semikolons (HTML-Entitäten ausgenommen)
const rule = (where, text) => {
  assert.doesNotMatch(text, /[–—]/, where + ': Gedankenstrich');
  assert.doesNotMatch(text.replace(/&[a-z#0-9]+;/gi, ''), /;/, where + ': Semikolon');
};
const walk = (where, v) => {
  if (typeof v === 'string') rule(where, v);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(where + '.' + k, x);
};
for (const l of site.languages) {
  walk(l, require(path.join(ROOT, 'src/lang', l + '.cjs')));
  rule('legal/' + l, read('src/legal/' + l + '.html').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' '));
}

// 3. Seiten: Sprache, hreflang, keine offenen Platzhalter, Skript ohne Syntaxfehler
for (const l of site.languages) {
  const file = (l === 'de' ? '' : l + '/') + 'index.html', html = read(file), d = require(path.join(ROOT, 'src/lang', l + '.cjs'));
  assert.ok(html.startsWith('<!doctype html>\n<html lang="' + d.htmlLang + '">'), file + ': lang');
  assert.equal((html.match(/<link rel="alternate" hreflang=/g) || []).length, site.languages.length + 1, file + ': hreflang');
  assert.ok(html.includes('<link rel="canonical" href="https://lignoai.ch/' + (l === 'de' ? '' : l + '/') + '" />'), file + ': canonical');
  assert.doesNotMatch(html, /\{\{\s*[\w.]+\s*\}\}|%VERSION%/, file + ': offener Platzhalter');
  assert.ok(html.includes(site.downloadUrl(site.tragwerkVersion)), file + ': Download-Link');
  assert.ok(html.includes("var LANG = '" + l + "'"), file + ': LANG');
  assert.ok(html.includes('<span data-addr></span>'), file + ': Postanschrift nur per JavaScript');
  assert.equal((html.match(/Giesserei/gi) || []).length, 0, file + ': Postanschrift im Klartext');
  const script = html.slice(html.indexOf('<script>\n  (function () {') + 8, html.lastIndexOf('</script>'));
  new Function(script);   // wirft bei Syntaxfehlern
  for (const view of ['view-home', 'view-anmelden', 'view-registrieren', 'view-passwort-vergessen', 'view-passwort-neu', 'view-konto', 'view-nutzungsbedingungen', 'view-datenschutz', 'view-impressum'])
    assert.ok(html.includes('id="' + view + '"'), file + ': ' + view);
  if (l !== 'de') assert.equal((html.match(/class="legal-lang-note"/g) || []).length, 3, file + ': Hinweis deutsche Fassung massgebend');
}

// 4. Gleiche Version der Nutzungsbedingungen auf Website und App-Anmeldeseite
const tv = s => s.match(/TERMS_VERSION\s*=\s*'([^']+)'/)[1];
assert.equal(tv(read('src/index.html')), tv(read('desktop-login.js')), 'TERMS_VERSION');

console.log('PASS: ' + site.languages.join(', ') + ' aktuell, Textregeln, hreflang, Platzhalter, Skripte, Konto-Ansichten, TERMS_VERSION');
