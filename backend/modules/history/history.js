import { query } from "../db/db.js";

export async function listHistory(terminid) {
    return query("SELECT ZuletztGeaendert, Datum, Titel, Fach, Lehrer FROM changes WHERE TerminID = ?", [terminid])
}
