import { query } from '../db/db.js';

export async function listTeammates(teamid) {
	return await query("SELECT TeamName, Mitglieder FROM teams WHERE TeamID LIKE ?", [teamid]);
}

export function createTeam(teamName){
	return query("INSERT INTO teams (TeamName) VALUES (?)", [teamName]);
}

export function deleteTeam(teamID) {
	return query("DELETE FROM teams WHERE (TeamID = ?)", [teamID]);
}

export function info(teamid) {
	return query("SELECT TeamName FROM teams WHERE TeamID LIKE ?", [teamid]);
}

