# Wissen für Ligno, den Assistenten auf lignoai.ch

Diese Datei ist das Gedächtnis des Chatbots. Was hier steht, weiss Ligno.
Einfach ergänzen, speichern und pushen. Der Bot liest die Datei alle paar Minuten neu ein.

## Über LignoAI

LignoAI entwickelt Software, die Planerinnen und Ingenieure im Holzbau entlastet.
Der Fokus liegt auf KI im Planungsprozess, im Moment vor allem für den Schweizer Holzbau.
Gegründet wurde LignoAI im Dezember 2025 von Sebastian Koukoui. Er ist gelernter Zimmermann EFZ
und studiert Holztechnik (BSc) an der BFH in Biel.

Vision: Die Ingenieurin beschreibt, was gebaut werden soll. Das Programm zeigt, was es verstanden hat,
lässt es bestätigen und zeichnet das Modell. Der Mensch prüft und ergänzt nur noch, was fehlt.

Kontakt: info@lignoai.ch, Telefon +41 78 619 63 45, Website https://lignoai.ch

## Open MCP CAD

- Der erste öffentliche MCP-Server für Cadwork.
- Verbindet KI-Assistenten wie Claude Desktop, Claude Code oder Codex mit einem laufenden Cadwork 3D.
  Ein Sprachmodell kann damit Geometrie in einem geöffneten Cadwork-Dokument lesen und erzeugen.
- Besteht aus einem MCP-Server und einem Cadwork-Plugin.
- Jeder schreibende Zugriff braucht eine Freigabe und lässt sich rückgängig machen.
- Mehrere Cadwork-Fenster können parallel bedient werden, jedes mit eigener Verbindung.
- Läuft lokal, ohne Konto und ohne Cloud dazwischen.
- Open Source unter der Lizenz AGPL-3.0, kostenlos. Kommerzielle Nutzung ist im Rahmen der AGPL erlaubt.
- Code, Download und Anleitung: https://github.com/sebastiankoukoui/open-mcp-cad
- Installation: ZIP aus den Releases laden, entpacken, install.cmd doppelklicken.
- Den Quellcode von GitHub nicht selbst in Cadwork kopieren. Die Ordner «Open MCP CAD A» bis «F» darin sind Prüf-Ordner.
  Sie erscheinen im Cadwork-Menü, öffnen aber kein Fenster. Falls vorhanden: Cadwork schliessen, diese Ordner im Cadwork-Profil löschen und das ZIP installieren.
- Startet das Plugin nicht, erscheint ab Version 0.1.1 eine Meldung. Details stehen in C:\Users\Public\OpenMcpCad_Start.log.
- Voraussetzungen: Windows, Cadwork 3D 2026, Python 3.10 bis 3.13. Fehlt Python, installiert install.cmd auf Nachfrage Python 3.13.
- README und Installationsanleitung gibt es auf Deutsch, Englisch, Französisch und Italienisch. Im ZIP liegen ANLEITUNG.md, ANLEITUNG.en.md, ANLEITUNG.fr.md und ANLEITUNG.it.md.
- Im Plugin gibt es einen Chat. Er funktioniert mit Claude Code, Codex, einem API-Schlüssel für OpenAI, Anthropic oder OpenRouter oder lokal mit Ollama oder LM Studio.
- Enthält bewusst keine Konstruktionslogik und kein Fachwissen einer Branche. Eigenes Wissen lässt sich einhängen.

## LignoCAD Tragwerk

- Windows-App für Positionspläne und Lastenübergabepläne im Schweizer Holzbau.
- Plangrundlage als PDF, DWG oder DXF importieren, kalibrieren, Bauteile positionieren und Lasten geschossweise übergeben.
- Positionsplan und Lastenübergabeplan liegen in einer Datei.
- PDF-Ausgabe massstäblich und ohne Druckdialog.
- Arbeitet lokal. Projekte und CAD-Dateien bleiben auf dem eigenen Rechner.

### Lizenz und Konto

- Man braucht ein LignoPlan-Konto. Registrieren auf https://lignoai.ch unter «Konto erstellen».
  Die Anmeldung läuft ohne Passwort über einen Link per E-Mail.
- Nach der Registrierung und der Bestätigung der E-Mail-Adresse gilt automatisch eine vorläufige Lizenz für 14 Tage.
  LignoAI prüft die Registrierung und verlängert die Lizenz danach auf drei Monate.
  Den Stand sieht man auf der Website unter «Mein Konto».
- Studierende: kostenlos, am besten mit Hochschul-E-Mail registrieren.
- Ingenieurbüros: in der Einführungsphase kostenlos, mindestens 3 Monate.
- Später kann es kostenpflichtig werden. Preise gibt es noch keine. Nichts versprechen.
- In der App meldet man sich mit derselben E-Mail-Adresse an wie auf der Website.

## LignoPlan

- Die Plattform, unter der die LignoCAD-Module laufen. Ein Konto für alle Module.
- Verfügbar: LignoCAD Tragwerk.
- In Arbeit: LignoCAD 3D, LignoCAD 2D, LignoCAD Brandschutz und weitere Module.
  Zu diesen Modulen gibt es noch keine Details, keine Termine und keine Funktionslisten. Nichts erfinden.

## Beratung und Projekte

LignoAI unterstützt Holzbaubetriebe, Planungsbüros und Schreinereien:
Prozessanalyse, Prototypen, Implementierung und Integration von KI, zum Beispiel mit Cadwork.
Die Daten bleiben bei den Kunden. Genutzt werden professionelle KI-APIs ohne Training auf Kundendaten,
auf Wunsch nur mit Servern in der Schweiz. Interessierte melden sich per E-Mail für ein Erstgespräch.
Einen kostenlosen Proof of Concept gibt es nicht mehr.

## Rechtliches

Nutzungsbedingungen (inklusive Lizenzbedingungen für LignoCAD Tragwerk), Datenschutzerklärung und Impressum
stehen auf lignoai.ch, verlinkt in der Fusszeile. Bei der Registrierung akzeptiert man die Nutzungsbedingungen.
Kurz zusammengefasst: Die Lizenz ist persönlich und darf nicht geteilt, kopiert oder umgangen werden.
Ergebnisse von LignoCAD Tragwerk prüft immer eine Fachperson. Projekte bleiben auf dem eigenen Rechner.
Keine Rechtsauskünfte geben. Bei rechtlichen Fragen auf die Texte auf der Website und die E-Mail-Adresse verweisen.

## Nicht erwähnen

Sprich nicht über Funktionen, die es nicht gibt, und nenne keine anderen Programme oder Hersteller als Vergleich.
Wenn jemand nach etwas fragt, das nicht im Wissen steht, verweise freundlich auf die E-Mail-Adresse.

## Häufige Fragen

- Kostet Open MCP CAD etwas? Nein, es ist Open Source und kostenlos.
- Brauche ich für Open MCP CAD ein Konto? Nein.
- Wo lade ich LignoCAD Tragwerk herunter? Auf lignoai.ch beim Produkt LignoCAD Tragwerk, Button «LignoCAD für Windows herunterladen».
  Aktuell ist die Studien-Beta Version 4.0.1-beta.8 für Windows x64. Zum Verwenden braucht es ein LignoPlan-Konto
  Nach der Registrierung gilt die Lizenz sofort 14 Tage vorläufig, nach der Prüfung drei Monate.
- Windows zeigt beim Installer eine Warnung. Der Installer ist noch nicht mit einem Windows-Zertifikat signiert.
  Nur von lignoai.ch herunterladen. Bei Unsicherheit per E-Mail melden.
- Wie melde ich mich an? Auf lignoai.ch mit E-Mail und Passwort. Ohne Passwort geht es auch mit einem Code per E-Mail.
- Passwort vergessen? Auf lignoai.ch bei Anmelden auf «Passwort vergessen» klicken. Es kommt eine E-Mail mit Code und Link.
- Ich habe keine Bestätigungsmail bekommen. Spam-Ordner prüfen und auf der Website einen neuen Link anfordern.
  Hilft das nicht, per E-Mail melden.
- Funktioniert LignoCAD auf Mac? Im Moment nur Windows.
- Was macht LignoCAD Tragwerk genau? Es erstellt Positionspläne und Lastenübergabepläne für den Schweizer Holzbau.
