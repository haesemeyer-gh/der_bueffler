import { query } from '../db/db.js';

// listet alle Teammitglieder auf
export async function listTeammates(teamid) {
	return await query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [teamid]);
}

// erstellt ein neues Team
export function createTeam(teamname){
	return query("INSERT INTO teams (TeamName) VALUES (?)", [teamname]);
}

// löscht ein bestehendes Team
export function deleteTeam(teamid) {
	return query("DELETE FROM teams WHERE (TeamID = ?)", [teamid]);
}

// zeigt den Teamnamen an
export function info(teamid) {
	return query("SELECT TeamName, Mitglieder, Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamid]);
}

// listet alle Teams auf
export function list() {
	return query("SELECT TeamID, TeamName FROM teams");
}

// fügt Nutzer einem Team hinzu
export async function addTeammate(userid, teamID) {
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Mitglieder
    if (!mitglieder.includes(userid)) {
       mitglieder.push(userid)
    }
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(mitglieder), teamID]);
}

// prüft ob Nutzer Mitglied eines Teams ist
export async function isUserMemberOfTeam(userid,teamID) {
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Mitglieder
    return mitglieder.includes(userid)
}

// prüft ob Nutzer Klassensprecher in einem Team ist
export async function isUserKlassensprecherOfTeam(userid,teamID) {
    let memberarray = await query("SELECT Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Klassensprecher
    return mitglieder.includes(userid)
}

// entfernt einen Nutzer von einem Team
export async function removeTeammate(userid, teamID) {
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Mitglieder
    if (mitglieder.includes(userid)) {
       mitglieder = mitglieder.filter((Mitglied) => Mitglied != userid)
    }
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(mitglieder), teamID]);
}

// entfernt einen Nutzer aus allen Teams
export async function purgeUserFromTeams(userid) {
	const teams = list();
	teams.forEach((team) => {
		removeTeammate(userid, team.TeamID);
		demote(userid, team.TeamID);
	});
}

// befördert ein Teammitglied zum Klassensprecher
export async function promote(userid, teamid) {
    let memberarray = await query("SELECT Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamid]);
    let mitglieder = memberarray[0].Klassensprecher
    if (!mitglieder.includes(userid)) {
        mitglieder.push(userid)
    }
    return query("UPDATE teams SET Klassensprecher = ? WHERE TeamID = ?", [JSON.stringify(mitglieder),teamid]);
}

// degradiert einen Klassensprecher zum normalen Nutzer
export async function demote(userid, teamid) {
    let memberarray = await query("SELECT Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamid]);
    let mitglieder = memberarray[0].Klassensprecher
    if (mitglieder.includes(userid)) {
        mitglieder = mitglieder.filter((Klassensprecher) => Klassensprecher != userid)
    }
    return query("UPDATE teams SET Klassensprecher = ? WHERE TeamID = ?", [JSON.stringify(mitglieder),teamid]);
}

