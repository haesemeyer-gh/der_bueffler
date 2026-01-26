import { query } from '../db/db.js';

export async function listTeammates(teamid) {
	return await query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [teamid]);
}

export function createTeam(teamname){
	return query("INSERT INTO teams (TeamName) VALUES (?)", [teamname]);
}

export function deleteTeam(teamid) {
	return query("DELETE FROM teams WHERE (TeamID = ?)", [teamid]);
}

export function info(teamid) {
	return query("SELECT TeamName FROM teams WHERE TeamID LIKE ?", [teamid]);
}

export async function addTeammate(userid, teamID) {
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Mitglieder
    if (!mitglieder.includes(userid)) {
       mitglieder.push(userid)
    }
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(mitglieder), teamID]);
}

export async function removeTeammate(userid, teamID) {
    console.log("3")
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);
    let mitglieder = memberarray[0].Mitglieder
        console.log(mitglieder)
    if (mitglieder.includes(userid)) {
       mitglieder = mitglieder.filter((Mitglied) => Mitglied != userid)
       console.log(mitglieder)
    }
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(mitglieder), teamID]);
}

export async function promote(userid, teamid) {
    let memberarray = await query("SELECT Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamid]);
    let mitglieder = memberarray[0].Klassensprecher
    if (!mitglieder.includes(userid)) {
        mitglieder.push(userid)
    }
    return query("UPDATE teams SET Klassensprecher = ? WHERE TeamID = ?", [JSON.stringify(mitglieder),teamid]);
}

export async function demote(userid, teamid) {
    let memberarray = await query("SELECT Klassensprecher FROM teams WHERE TeamID LIKE ?", [teamid]);
    let mitglieder = memberarray[0].Klassensprecher
    if (mitglieder.includes(userid)) {
        mitglieder = mitglieder.filter((Klassensprecher) => Klassensprecher != userid)
    }
    return query("UPDATE teams SET Klassensprecher = ? WHERE TeamID = ?", [JSON.stringify(mitglieder),teamid]);
}