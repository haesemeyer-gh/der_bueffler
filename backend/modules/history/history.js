import { query } from "../db/db.js";

export async function listHistory(terminid) {
    return query("SELECT AenderungsID, ZuletztGeaendert, Datum, Titel, Fach, Lehrer FROM changes WHERE TerminID = ?", [terminid])
}

export async function viewHistory(aenderungsid) {
    return query("SELECT Timestamp, ZuletztGeaendert, TerminID, Datum, Titel, Fach, Lehrer, Notizen WHERE AenderungsID = ?", [aenderungsid])
}

export async function reverseChange(/*TBD*/) {
    //Wird bei vorhandener Zeit umgesetzt
}