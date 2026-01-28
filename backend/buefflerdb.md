# BuefflerDB Struktur

Ein Skript, um diese Datenbank einzurichten, befindet sich in [`./buefflerdb.sql`](./buefflerdb.sql).

## Table Liste

- [appointments](#appointments): aktueller Stand aller Termine
- [changes](#changes): vorherige Versionen aller bearbeiteten Termine
- [session](#session): aktuelle Login Sessions
- [teams](#teams): alle Teams
- [user](#user): Nutzerdaten, Berechtigungen und Anmeldedaten
- [push_subscriptions](#push_subscriptions): alle Subscribtions für web-push
- [grades](#grades): alle Zensuren

## appointments

Der `appointments`-Table enthält den aktuellen Stand aller Termine.

- `TerminID` ist die einzigartige ID des Termins
- `Geloescht` ist 1, wenn der Termin gelöscht ist
- `TeamID` ist die ID des Teams, in dem dieser Termin sichtbar ist
- `ZuletztGeaendert` ist die ID des Nutzers, der zuletzt diesen Termin bearbeitet hat
- `Datum` ist der Zeitpunkt, an dem dieser Termin stattfindet
- `Titel` ist eine kurze Beschreibung des Termins
- `Fach` ist z.B. das Schulfach für welches dieser Termin gedacht ist
- `Lehrer` ist der Name des Termin-Veranstalters (hier muss kein valider Nutzername angegeben werden)
- `Notizen` ist ein optionales Feld für große Beschreibungen, z.B. um den Lehrstoff zu Notieren, der in einer Klassenarbeit abgefragt wird

## changes

Der `changes`-Table enthält alle vorherigen Versionen von bearbeiteten Terminen.
Wird ein Termin bearbeitet, wird der aktuelle Stand in den `changes`-Table kopiert, dann erst wird die neue Änderung in `appointments` vorgenommen.

- `AenderungsID` ist die einzigartige ID für die Bearbeitung
- `Timestamp` ist der Zeitpunkt, an dem dieser Stand ersetzt wurde (entweder mit der nächsten neueren Bearbeitung oder dem aktuellen Stand in `appointments`)
- *alle anderen Felder sind eine Kopie aus [`appointments`](#appointments)*

## session

Der `session`-Table enthält alle aktuellen Session Tokens.

- `Token` ist der Session Token
- `NutzerID` ist die ID des Nutzers, der hiermit angemeldet wird

## teams

Der `teams`-Table enthält alle Teams (z.B. Schulklassen)

- `TeamID` ist die einzigartige ID des Teams
- `TeamName` ist eine kurze Beschreibung des Teams
- `Mitglieder` ist ein Array mit IDs von Nutzern, die dieses Team einsehen dürfen
- `Klassensprecher` ist ein Array mit IDs von Nutzern, die in diesem Team Klassensprecher sind

## user

Der `user`-Table enthält alle Nutzerprofile, Berechtigungen und Anmeldedaten.

- `ID` ist die einzigartige ID des Nutzers
- `Mail` ist die E-Mail des Nutzers zur Anmeldung
- `Passwort` ist das gehashte Passwort des Nutzers
- `Name` ist der frei wählbare Anzeigename des Nutzers
- `Lehrer` ist 1, wenn der Nutzer ein Lehrer ist
- `Admin` ist 1, wenn der Nutzer ein Administrator ist
- `online` ist der Timestamp, an dem der Nutzer sich zuletzt einen neuen Session Token generieren ließ

## push_subscriptions

Der `push_subscriptions`-Table enthält Push-Subscription Credentials für Nutzer

- `ID` ist die einzigartige ID der Push-Subscription
- `Subscription` ist die Credentials dieser Push-Subscription
- `NutzerID` ist die ID des Nutzers, der die diese Push-Subscription bestellt hat

## grades

Der `grades`-Table enthält alle Schulnoten.

- `ID` ist die einzigartige ID der Schulnoten
- `SchuelerID` ist die ID des Nutzers, der diese Note erhalten hat
- `LehrerID` ist die ID des Nutzers, der diese Note vergeben hat
- `Fach` ist das Fach, in dem diese Note vergeben wurde
- `Timestamp` ist der Zeitpunkt, an dem diese Note vergeben wurde
- `Note` ist die Schulnote

