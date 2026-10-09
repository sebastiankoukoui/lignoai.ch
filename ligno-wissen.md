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
- Verbindet KI-Apps wie Claude Desktop oder die ChatGPT-App (mit Codex) und Claude Code mit einem laufenden Cadwork 3D.
  Ein Sprachmodell kann damit Geometrie in einem geöffneten Cadwork-Dokument lesen und erzeugen.
- Besteht aus einem MCP-Server und einem Cadwork-Plugin.
- Im Chat des Plugins bestimmt der Modus, wie viel die KI allein darf: «Nur lesen», «Fragen» (Rückfrage vor jeder Änderung), «Cadwork frei» oder «Alles automatisch». In Claude Desktop, der ChatGPT-App oder Claude Code fragt das jeweilige Programm nach seinen eigenen Regeln. Änderungen in Cadwork lassen sich rückgängig machen.
- Mehrere Cadwork-Fenster können parallel bedient werden, jedes mit eigener Verbindung.
- Datenschutz: Open MCP CAD (Plugin und MCP-Server) läuft ganz auf dem eigenen PC. LignoAI erhält keine Daten. Es gibt kein Konto, keine Anmeldung, keinen Server von LignoAI dazwischen, keine Telemetrie und keine Fehlerberichte, die irgendwohin gesendet werden.
  Aber: Was die KI im Cadwork-Modell liest und was man ihr schreibt, geht an den KI-Anbieter, den man selbst wählt (zum Beispiel Anthropic bei Claude, OpenAI bei ChatGPT), nach dessen Bedingungen. Die Verbindung zur KI läuft direkt zwischen Nutzer und KI-Anbieter.
  Mit einer lokalen KI (zum Beispiel Ollama oder LM Studio) läuft auch die KI auf dem eigenen Rechner, dann verlässt nichts den Rechner. Nie behaupten, dass ohne lokale KI nichts den Rechner verlässt.
- Open Source unter der Lizenz AGPL-3.0, kostenlos. Kommerzielle Nutzung ist im Rahmen der AGPL erlaubt.
- Code, Download und Anleitung: https://github.com/sebastiankoukoui/open-mcp-cad
- Installation: ZIP aus den Releases laden, entpacken, 1_INSTALLIEREN.cmd doppelklicken.
  Oben im entpackten Ordner liegen nur 1_INSTALLIEREN.cmd, die Anleitungen als PDF (2_ANLEITUNG.pdf und 2_GUIDE_EN.pdf) und der Ordner Programmdateien mit allem anderen.
- Der Doppelklick auf 1_INSTALLIEREN.cmd öffnet das Einrichtungsfenster «Open MCP CAD einrichten». Zuerst fragt es «Wo möchtest du mit der KI arbeiten?»: in der KI-App (Claude Desktop oder ChatGPT-App), direkt in Cadwork im Chat oder beides. Unter «Deine KI-App» ist angehakt, was auf dem PC gefunden wurde. Findet es keine, zeigt es, wo man eine holt. Für den Chat in Cadwork fragt es «Welche KI im Chat in Cadwork?»: Claude (Claude-Abo, das Fenster installiert dafür Claude Code mit dem offiziellen Befehl von Anthropic), ChatGPT (ChatGPT-Abo, das Fenster installiert dafür die Codex-CLI mit dem offiziellen Befehl von OpenAI) oder später bzw. mit eigenem Schlüssel. Die ChatGPT-App allein genügt für den Chat in Cadwork nicht. Dann «Weiter» und «Installieren», das dauert einige Minuten, eine Zeile zeigt, was gerade geladen wird. Für den Chat in Cadwork meldet man sich danach einmal an («Bei Claude anmelden»): ein kleines schwarzes Fenster und der Browser öffnen sich, man meldet sich im Browser an. «Später» geht auch, dann 1_INSTALLIEREN.cmd später nochmals starten. Das Fenster kopiert das Plugin nach Cadwork, richtet den Server ein und trägt Open MCP CAD in die KI-App ein. Fehlt ein Programmteil wie Python, fragt es vorher. Bei «Fertig eingerichtet» ist alles da. Danach die KI-App ganz beenden und neu starten. Den Chat in Cadwork öffnet in Cadwork der Klick auf «Open MCP CAD» und dann die Sprechblase in der Leiste. Wird eine KI-App erst später installiert, 1_INSTALLIEREN.cmd einfach nochmals starten. Protokoll: C:\Users\Public\OpenMcpCad_installer.log. Das Einrichtungsfenster selbst ist nur auf Deutsch, die Anleitungen gibt es auf Deutsch, Englisch, Französisch und Italienisch.
- Den Quellcode von GitHub nicht selbst in Cadwork kopieren. Die Ordner «Open MCP CAD A» bis «F» darin sind Prüf-Ordner.
  Sie erscheinen im Cadwork-Menü, öffnen aber kein Fenster. Falls vorhanden: Cadwork schliessen, diese Ordner im Cadwork-Profil löschen und das ZIP installieren.
- Startet das Plugin nicht, erscheint eine Meldung. Details stehen in C:\Users\Public\OpenMcpCad_start.log.
- Voraussetzungen: Windows, Cadwork 3D 2026, Python 3.10 bis 3.13. Fehlt Python, installiert 1_INSTALLIEREN.cmd auf Nachfrage Python 3.13, per winget oder, wo winget fehlt, direkt von python.org.
- README und Installationsanleitung gibt es auf Deutsch, Englisch, Französisch und Italienisch. Im Ordner Programmdateien liegen ANLEITUNG.md, ANLEITUNG.en.md, ANLEITUNG.fr.md und ANLEITUNG.it.md, dazu im Unterordner Anleitungen die Fassungen als HTML und PDF.
- Nach dem Klick auf «Open MCP CAD» im Plugin-Menü von Cadwork erscheint oben rechts eine kleine Leiste. «Bereit» heisst: verbunden. Die Sprechblase öffnet den Chat, ein Knopf dockt das Fenster rechts an. Im Briefkasten steht, was gerade in Cadwork läuft, und man kann dort Notizen für die KI ablegen. Während die KI zeichnet, zeigt eine kleine Anzeige den Fortschritt. «Anhalten» verwirft wartende Aufträge.
- Bebilderte Anleitungen auf lignoai.ch beim Produkt Open MCP CAD: Knopf «Einrichten» (8 Schritte: ZIP entpacken und doppelklicken, wo arbeiten, KI-App wählen, KI für den Chat in Cadwork, Installieren, wird eingerichtet, bei Claude anmelden, loslegen) und Knopf «Anleitung ansehen» (4 Schritte zur Arbeit mit dem Plugin). Bei Fragen zum Einrichten darauf verweisen.
- KI hilft beim Einrichten: Im ersten Schritt der Anleitung «Einrichten» auf lignoai.ch und auf der ersten Seite des Einrichtungsfensters («Text kopieren») gibt es einen Text zum Kopieren. Man schickt ihn der eigenen KI-App am PC, sie führt dann Schritt für Schritt durch die Einrichtung (ZIP laden, entpacken, 1_INSTALLIEREN.cmd, «Installieren», App neu starten, «Bereit» in Cadwork).
- Gearbeitet wird in einer KI-App am PC: Claude Desktop (mit einem Claude-Abo) oder die ChatGPT-App von OpenAI (mit einem ChatGPT-Abo, Codex ist darin enthalten), oder direkt im Chat in Cadwork. Nicht im Browser und nicht am Handy. Nach dem Einrichten die App ganz beenden und neu starten.
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
  Angemeldet wird mit E-Mail und Passwort. Ohne Passwort geht es auch mit einem Code per E-Mail.
- Nach der Registrierung und der Bestätigung der E-Mail-Adresse gilt automatisch eine vorläufige Lizenz für 14 Tage.
  LignoAI prüft die Registrierung und verlängert die Lizenz danach, für Fachleute auf drei Monate. Für Studierende gilt der Ablauf weiter unten.
  Den Stand sieht man auf der Website unter «Mein Konto».
- Studierende: kostenlos, solange sie studieren. Bei der Registrierung gibt man an, wann das Studium voraussichtlich endet (31. Juli oder 31. Januar).
  Nachweis: Wer sich mit der Hochschul-E-Mail registriert, ist nach der Bestätigung sofort freigeschaltet. Mit einer privaten Adresse gibt man die Hochschul-Adresse zusätzlich an und bestätigt sie mit einem Code.
  Ohne Hochschul-Adresse lädt man in «Mein Konto» eine Studienbestätigung hoch (PDF, JPG oder PNG). LignoAI prüft sie und löscht das Dokument danach.
  Die Lizenz für Studierende gilt jeweils bis 30. September, nie länger als bis zum angegebenen Studienende. Jedes Jahr im September kommt eine E-Mail, dann bestätigt man das Studium in «Mein Konto» neu.
  Nach dem Studium wechselt man in «Mein Konto» mit «Ich habe abgeschlossen» zur Lizenz für Fachleute. Sie ist kostenlos bis drei Monate nach dem Semesterende, also bis 31. Oktober oder bis 30. April.
- Fachleute (Ingenieurwesen, Planung, Holzbau): Einführungsangebot. Wer sich bis 31. Dezember 2026 registriert, nutzt LignoCAD Tragwerk mindestens drei Monate kostenlos. Die Lizenz ist persönlich, pro Person.
- Firmenlizenz für mehrere Personen einer Firma: auf Anfrage per E-Mail an info@lignoai.ch, mit einer Rechnung für alle. Jede Person hat trotzdem ihr eigenes Konto.
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

## Sprachen

Die Website gibt es auf Deutsch (https://lignoai.ch), Französisch (https://lignoai.ch/fr/),
Italienisch (https://lignoai.ch/it/) und Englisch (https://lignoai.ch/en/). Die Sprache wählt man oben rechts oder in der Fusszeile.
Die E-Mails zum Konto kommen in der Sprache, die im Konto unter «Profil» eingestellt ist.
Die Rechtstexte gibt es übersetzt, rechtlich massgebend ist die deutsche Fassung.

Antworte in der Sprache der Frage. Produktnamen bleiben gleich: LignoAI, LignoPlan, LignoCAD Tragwerk, Open MCP CAD.
Nenne Knöpfe mit ihrem Namen in der Sprache der Antwort und verlinke die Seite in dieser Sprache (z. B. https://lignoai.ch/fr/):
- «Konto erstellen»: «Créer un compte» (FR), «Crea un account» (IT), «Create account» (EN)
- «Anmelden»: «Se connecter» (FR), «Accedi» (IT), «Sign in» (EN)
- «Mein Konto»: «Mon compte» (FR), «Il mio account» (IT), «My account» (EN). Darin «Profil» mit «Sprache für E-Mails»: «Langue des e-mails» (FR), «Lingua delle e-mail» (IT), «Language for emails» (EN)
- «Passwort vergessen?»: «Mot de passe oublié ?» (FR), «Password dimenticata?» (IT), «Forgot password?» (EN)
- «LignoCAD für Windows herunterladen»: «Télécharger LignoCAD pour Windows» (FR), «Scarica LignoCAD per Windows» (IT), «Download LignoCAD for Windows» (EN)
Fachbegriffe:
- Positionsplan: plan de positions (FR), piano delle posizioni (IT), position plan (EN)
- Lastenübergabeplan: plan de transmission des charges (FR), piano di trasmissione dei carichi (IT), load transfer plan (EN)
- Holzbau: construction bois (FR), costruzione in legno (IT), timber construction (EN)
- LignoPlan-Konto: compte LignoPlan (FR), account LignoPlan (IT), LignoPlan account (EN)
- Nutzungsbedingungen: Conditions d’utilisation (FR), Condizioni d’uso (IT), Terms of Use (EN)
- Datenschutzerklärung: Déclaration de protection des données (FR), Dichiarazione sulla protezione dei dati (IT), Privacy Policy (EN)
- Studierende: étudiants (FR), studenti (IT), students (EN). Einführungsphase: phase de lancement (FR), fase di lancio (IT), introductory phase (EN)

## Nicht erwähnen

Sprich nicht über Funktionen, die es nicht gibt, und nenne keine anderen Programme oder Hersteller als Vergleich.
Wenn jemand nach etwas fragt, das nicht im Wissen steht, verweise freundlich auf die E-Mail-Adresse.

## Häufige Fragen

- Kostet Open MCP CAD etwas? Nein, es ist Open Source und kostenlos.
- Brauche ich für Open MCP CAD ein Konto? Nein.
- Wo sind meine Daten bei Open MCP CAD? Open MCP CAD läuft auf dem eigenen PC, LignoAI erhält keine Daten. Was die KI liest und was man ihr schreibt, geht nur an den gewählten KI-Anbieter (zum Beispiel Anthropic oder OpenAI), nach dessen Bedingungen. Mit einer lokalen KI (zum Beispiel Ollama) bleibt alles auf dem Rechner.
- Wo lade ich LignoCAD Tragwerk herunter? Auf lignoai.ch beim Produkt LignoCAD Tragwerk, Button «LignoCAD für Windows herunterladen».
  Aktuell ist die Studien-Beta Version 4.0.1-beta.26 für Windows x64. Zum Verwenden braucht es ein LignoPlan-Konto.
  Nach der Registrierung gilt die Lizenz sofort 14 Tage vorläufig. Nach der Prüfung wird sie verlängert.
- Windows zeigt beim Installer eine Warnung. Der Installer ist noch nicht mit einem Windows-Zertifikat signiert.
  Nur von lignoai.ch herunterladen. Bei Unsicherheit per E-Mail melden.
- Wie melde ich mich an? Auf lignoai.ch mit E-Mail und Passwort. Ohne Passwort geht es auch mit einem Code per E-Mail.
- Passwort vergessen? Auf lignoai.ch bei Anmelden auf «Passwort vergessen» klicken. Es kommt eine E-Mail mit Code und Link.
- Ich habe keine Bestätigungsmail bekommen. Spam-Ordner prüfen und auf der Website einen neuen Link anfordern.
  Hilft das nicht, per E-Mail melden.
- Funktioniert LignoCAD auf Mac? Im Moment nur Windows.
- Was macht LignoCAD Tragwerk genau? Es erstellt Positionspläne und Lastenübergabepläne für den Schweizer Holzbau.

## Ligno Builders (Coming Soon)

Ligno Builders verbindet KI mit parametrischen Holzbauteilen und befindet sich in einer frühen Beta.
Das aktuelle Beispiel zeigt Holzrahmenwände mit Öffnungen, ein 3D-Modell, daraus abgeleitete 2D-Pläne und eine bearbeitbare Cadwork-Datei.
Die separate Demo steht auf https://lignoai.ch/lignobuilders/.
Massivholz-Aussen- und Innenwände, weitere Bauteile und Konstruktionsdetails sind geplante Erweiterungen.
Ziel ist die durchgängige Planung ganzer Holzgebäude. Diese Ziele immer als Entwicklung kennzeichnen.
Für konkrete Anwendungsfälle und ein Gespräch: info@lignoai.ch.

Die Demo dient zur Veranschaulichung des aktuellen Entwicklungsstands.
Open MCP CAD verbindet in der Demo die KI mit Cadwork. Ligno Builders liefert parametrische Bauteile und Konstruktionsregeln.
Das Konzept ist CAD-unabhängig. Andere CAD-Programme sind grundsätzlich über geeignete Schnittstellen anbindbar. Das ist keine Zusage bereits verfügbarer Integrationen.
