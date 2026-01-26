import { query } from "../db/db.js";

export async function listHistory(terminid) {
    return query("SELECT AenderungsID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer FROM changes WHERE TerminID = ?", [terminid])
}

export async function viewHistory(aenderungsid) {
    return query(
	   `SELECT changes.TerminID,
		changes.TeamID,
		changes.ZuletztGeaendert,
		changes.Datum,
		changes.Titel,
		changes.Fach,
		changes.Lehrer,
		changes.Notizen,
		user.Name AS ZuletztGeaendertName,
		teams.TeamName
		FROM changes
		INNER JOIN user ON changes.ZuletztGeaendert = user.ID
		INNER JOIN teams ON changes.TeamID = teams.TeamID
		WHERE AenderungsID = ?`, [aenderungsid])
}

export async function reverseChange(/*TBD*/) {
    //Wird bei vorhandener Zeit umgesetzt
}