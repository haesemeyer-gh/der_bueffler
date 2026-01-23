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
   
    if (!memberarray[0].Mitglieder.includes(userid)) {
        memberarray[0].Mitglieder.push(userid)
    }
    console.log(memberarray[0].Mitglieder)
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(memberarray[0].Mitglieder), teamID]);
}

export async function removeTeammate(userid, teamID) {
    let memberarray = await query("SELECT Mitglieder FROM teams WHERE TeamID LIKE ?", [teamID]);

    if (!memberarray[0].Mitglieder.includes(userid)) {
       memberarray[0].Mitglieder = memberarray[0].Mitglieder.filter((Mitglied) => Mitglied != userid)
    }
    return query("UPDATE teams SET Mitglieder = ? WHERE TeamID = ?", [JSON.stringify(memberarray[0].Mitglieder), teamID]);
}
