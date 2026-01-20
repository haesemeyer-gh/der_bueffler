# BuefflerDB Struktur

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

tbd

## teams

Der `teams`-Table enthält alle Teams (z.B. Schulklassen)

- `TeamID` ist die einzigartige ID des Teams
- `TeamName` ist eine kurze Beschreibung des Teams
- `Mitglieder` ist ein Array mit IDs von Nutzern, die dieses Team einsehen dürfen
- `Klassensprecher` ist ein Array mit IDs von Nutzern, die in diesem Team Klassensprecher sind
