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

