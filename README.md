# Der Büffler 🦬📖

## Über den Büffler

Der Büffler ist ein teambasierter Kalender für Klassenarbeiten u.Ä. -
Lehrer und Schüler können gemeinsame Termine für ihre Klassen eintragen,
sowie Schulnoten eintragen und einsehen.

Der Büffler kann außerdem wichtige Informationen speichern (z.B. was gelernt werden muss)
und verschickt Benachrichtigungen für anstehende Termine.

## Projekt lokal starten

Das Projekt besteht aus zwei Teilen:
- Backend: stellt API bereit und kümmert sich um Benachrichtigungen
- Frontend: Web-App

Für das Backend wird außerdem eine MySQL/MariaDB Datenbank benötigt.
```sql
CREATE DATABASE buefflerdb;
```
In `backend/buefflerdb.sql` befindet sich ein Skript um die Tables einzurichten.

Hat man eine Datenbank, kann man den Server starten.
```sh
cd backend/
npm install # dependencies herunterladen
node server.js # programm mit node.js starten
```
Dieser Server stellt auch das Frontend bereit.
Er ist standardgemäß unter [localhost:8080](http://localhost:8080) verfügbar.
Aktuell sind die Konfigurationen für die Datenbankverbindung, SMTP, die Schedule für das Digest und der Port, auf dem der Web Server gehostet wird, hard-coded.
