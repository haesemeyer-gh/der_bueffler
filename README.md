# Der Büffler 🦬📖

## Über den Büffler

Der Büffler ist ein teambasierter Kalender für Klassenarbeiten u.Ä. -
Lehrer und Schüler können gemeinsame Termine für ihre Klassen eintragen,
sowie Schulnoten eintragen und einsehen.

Der Büffler kann außerdem wichtige Informationen speichern (z.B. was gelernt werden muss)
und verschickt Benachrichtigungen für anstehende Termine.

## Projekt lokal starten

**Anmerkung:**
Es sind nun auch eine `Dockerfile` und eine `docker-compose.yml` verfügbar.

Das Projekt besteht aus zwei Teilen:
- Backend: stellt API bereit und kümmert sich um Benachrichtigungen
- Frontend: Web-App

Für das Backend wird außerdem eine MariaDB Datenbank benötigt.
```sql
CREATE DATABASE buefflerdb;
```
In `backend/buefflerdb.sql` befindet sich ein Skript um die Tables einzurichten.
In [`backend/buefflerdb.md`](backend/buefflerdb.md) ist die Struktur der Datenbank dokumentiert.

Hat man eine Datenbank, kann man den Server starten.
```sh
cd backend/
npm install # dependencies herunterladen
npm run dev # server.js mit nodemon starten
```
Dieser Server stellt auch das Frontend bereit.
Er ist standardgemäß unter [localhost:3000](http://localhost:3000) verfügbar.

Der Server kann mit Umgebungsvariablen konfiguriert werden.
Eine Beispiel-Konfiguration ist unter `dist.env` verfügbar.

Die API URL für das Frontend muss ebenfalls angepasst werden.
`scripts/dist.api.js` Wird dann zu `scripts/api.js` umbenannt.

**Anmerkung:**
`web-push` erzwingt eine "`https://`" (oder "`mailto://`") URL in `setVapidDetails()`.
Für Testzwecke generiert `setupWebpush()` automatisch eine `https://`-URL, wenn keine als Frontend Link angegeben wurde.
Es ist trotzdem empfehlenswert, den Büffler hinter einem HTTPS Proxy verfügbar zu machen und den Frontend Link entsprechend in der `.env` anzupassen.

**WINDOWS:**
Auf Windows funktioniert der Code unter Node.js aktuell ggf. nicht richtig.
Das liegt daran, dass wir `crypto.randomUUID()` nutzen. `crypto` kann `undefined` sein.
Wir haben dieses Problem in einem anderen Projekt mit der folgenden Zeile behoben:
```js
globalThis.crypto ??= require("node:crypto").webcryptos
```
Da wir allerdings ES6' `import` statt CommonJS' `require()` verwenden, funktioniert das hier nicht.
Es wird empfohlen auf Windows WSL zu installieren und/oder Docker zu verwenden.

## Entwickeln

### Backend

[`server.js`](backend/server.js) ist die primäre Datei des Backends.
Es importiert alle  module, startet den ExpressJS-Web-Server und die Schedules für die Benachrichtigungen.

Die Module sind unter [`modules`](backend/modules/) zu finden.
Exportieren Module Endpoints, sind diese in einer `route.js` zu finden.
In den Endpoints finden grundsätzlich auch Error Handling und Berechtigungsabfragen statt.

Datenbankabfragen werden mit dem `query()` Wrapper aus [`db.js`](backend/modules/db/db.js) getätigt.

Der Server stürzt ab, wenn er versucht E-Mails ohne einen validen SMTP Server zu versenden und startet nicht, wenn es keinen SMTP Server gibt.
[smtp4dev](https://github.com/rnwood/smtp4dev)

In [`beispiel.js`](backend/beispiel.js) ist eine *(veraltete)* kommentierte Version eines Endpoints.

### Frontend

Das Frontend ist einfaches HTML/CSS/JS.

Fast jede Seite hat eine `index.html` Datei mit einer identischen Anmeldemaske, einem identischen Header und einem Hauptpart.
Jede Seite hat eine eigene `index.js` mit Seitenspezifischer Logik.
Die Seite unter [`/`](frontend/index.html) ist die Dashboard-Ansicht, alle anderen Seiten sollten sich schon aus dem Namen ergeben.

Außerdem gibt es in [`scripts`](frontend/scripts) mehrere JS Dateien, die von allen Seiten geladen werden.

In [`assets`](frontend/assets) befinden sich grafische Dinge, die für die Funktion der Seite nicht relevant sind (z.B. CSS Dateien oder Icons)

[`worker.js`](frontend/worker.js) ist der Worker für die Push-Benachrichtigungen.

## Anwenden

Nutzer können Accounts nur mit einer validen E-Mail Adresse erstellen.
Valide Domains sind:
- `@bbw-fi.de`
- `@bbw-azubi.de`
- `@sfz-net.de`
- `@sfz-chemnitz.de`
- `@sfz.de`

Standardgemäß gibt es keine Administratoren. Der einzige Weg zum Admin zu werden ist es also, manuell die Datenbank zu bearbeiten und einen Nutzer zum Admin zu ernennen.
Danach kann dieser Admin weitere Nutzer zu Admins und/oder Lehrern ernennen.

Der Büffler ist **teambasiert**. Termine sind immer einem Team zugewiesen.
Lehrer können Teams erstellen und Nutzer zu diesen hinzufügen.
Teammitglieder können dann Termine erstellen.

Die Felder "Fach" und "Lehrer" sind nur Textfelder, in die etwas beliebiges eingetragen werden kann.
Hier muss kein Lehrer-Nutzer angegeben werden und aktuell gibt es keine Sortierung nach Fächern.

Termine sind einsehbar im **Dashboard**, wo Termine in 3 Listen sortiert aufgelistet werden, sowie in der **Kalenderansicht**, wo man eine Monatsübersicht sieht.
Klickt man einen Termin an, sieht man in einer **Detailansicht** alle Informationen über diesen Termin und kann ihn **bearbeiten** sowie **vorherige Versionen** einsehen.

Jeder Nutzer erhält am Samstag um 6 Uhr morgens eine **E-Mail** mit allen Terminen der kommenden Woche.
Außerdem erhält jeder Nutzer morgens um 6 Uhr **Push-Benachrichtigungen** für alle Termine, die an diesem Tag anstehen werden, sofern der Nutzer diese aktiviert hat.

