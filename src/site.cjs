// Gemeinsame Angaben für alle Sprachen. Nach einer Änderung: node tools/build.cjs
module.exports = {
  origin: 'https://lignoai.ch',
  // Aktuelle Version von LignoCAD Tragwerk (wird von intern/release-app.sh ersetzt)
  tragwerkVersion: '4.0.1-beta.8',
  downloadUrl: v => 'https://github.com/sebastiankoukoui/lignocad-download/releases/download/v' + v + '/LignoCAD-Tragwerk-' + v + '-x64-Setup.exe',
  // Reihenfolge der Sprachwahl. Deutsch liegt unter /, die anderen unter /fr/, /it/, /en/.
  languages: ['de', 'fr', 'it', 'en'],
};
