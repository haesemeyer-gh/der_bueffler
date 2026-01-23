const devTeamsCreateName = document.getElementById('nv-dev-teams-create-name');
const devTeamsCreateButton = document.getElementById('nv-dev-teams-create-button');
const devTeamsCreateStatus = document.getElementById('nv-dev-teams-create-status');
devTeamsCreateButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/create", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			name: devTeamsCreateName.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsCreateStatus.innerText = response.message;
	});
});

const devTeamsDeleteID = document.getElementById('nv-dev-teams-delete-id');
const devTeamsDeleteButton = document.getElementById('nv-dev-teams-delete-button');
const devTeamsDeleteStatus = document.getElementById('nv-dev-teams-delete-status');
devTeamsDeleteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/delete", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: devTeamsDeleteID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsDeleteStatus.innerText = response.message;
	});
});

const devTeamsInfoID = document.getElementById('nv-dev-teams-info-id');
const devTeamsInfoButton = document.getElementById('nv-dev-teams-info-button');
const devTeamsInfoStatus = document.getElementById('nv-dev-teams-info-status');
devTeamsInfoButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/info", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: devTeamsInfoID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsInfoStatus.innerText = response.message;
	});
});

const devTeamsAddTeamID document.getElementById('nv-dev-teams-add-teamid');
const devTeamsAddUserID document.getElementById('nv-dev-teams-add-userid');
const devTeamsAddButton = document.getElementById('nv-dev-teams-add-button');
const devTeamsAddStatus = document.getElementById('nv-dev-teams-add-status');
devTeamsAddButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/add", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: devTeamsAddTeamID.value,
			userid: devTeamsAddUserID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsAddStatus.innerText = response.message;
	});
});

const devTeamsRemoveTeamID document.getElementById('nv-dev-teams-remove-teamid');
const devTeamsRemoveUserID document.getElementById('nv-dev-teams-remove-userid');
const devTeamsRemoveButton = document.getElementById('nv-dev-teams-remove-button');
const devTeamsRemoveStatus = document.getElementById('nv-dev-teams-remove-status');
devTeamsRemoveButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/remove", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: devTeamsRemoveTeamID.value,
			userid: devTeamsRemoveUserID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsRemoveStatus.innerText = response.message;
	});
});

const devTeamsPromoteTeamID document.getElementById('nv-dev-teams-promote-teamid');
const devTeamsPromoteUserID document.getElementById('nv-dev-teams-promote-userid');
const devTeamsPromoteButton = document.getElementById('nv-dev-teams-promote-button');
const devTeamsPromoteStatus = document.getElementById('nv-dev-teams-promote-status');
devTeamsPromoteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/promote", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: devTeamsPromoteTeamID.value,
			userid: devTeamsPromoteUserID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsPromoteStatus.innerText = response.message;
	});
});

const devTeamsDemoteTeamID document.getElementById('nv-dev-teams-demote-teamid');
const devTeamsDemoteUserID document.getElementById('nv-dev-teams-demote-userid');
const devTeamsDemoteButton = document.getElementById('nv-dev-teams-demote-button');
const devTeamsDemoteStatus = document.getElementById('nv-dev-teams-demote-status');
devTeamsDemoteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/demote", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: devTeamsDemoteTeamID.value,
			userid: devTeamsDemoteUserID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsDemoteStatus.innerText = response.message;
	});
});

const devUserMaketeacherID = document.getElementById('nv-dev-user-maketeacher-id');
const devUserMaketeacherButton = document.getElementById('nv-dev-user-maketeacher-button');
const devUserMaketeacherStatus = document.getElementById('nv-dev-user-maketeacher-status');
devUserMaketeacherButton.addEventListener('click', () => {
	fetch(APIURL+"/user/maketeacher", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: devUserMaketeacherID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserMaketeacherStatus.innerText = response.message;
	});
});

const devUserDeleteteacherID = document.getElementById('nv-dev-user-deleteteacher-id');
const devUserDeleteteacherButton = document.getElementById('nv-dev-user-deleteteacher-button');
const devUserDeleteteacherStatus = document.getElementById('nv-dev-user-deleteteacher-status');
devUserDeleteteacherButton.addEventListener('click', () => {
	fetch(APIURL+"/user/deleteteacher", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: devUserDeleteteacherID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserDeletetacherStatus.innerText = response.message;
	});
});

const devUserMakeadminID = document.getElementById('nv-dev-user-makeadmin-id');
const devUserMakeadminButton = document.getElementById('nv-dev-user-makeadmin-button');
const devUserMakeadminStatus = document.getElementById('nv-dev-user-makeadmin-status');
devUserMakeadminButton.addEventListener('click', () => {
	fetch(APIURL+"/user/makeadmin", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: devUserMakeadminID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserMakeadminStatus.innerText = response.message;
	});
});

const devUserGetuserinfoID = document.getElementById('nv-dev-user-getuserinfo-id');
const devUserGetuserinfoButton = document.getElementById('nv-dev-user-getuserinfo-button');
const devUserGetuserinfoStatus = document.getElementById('nv-dev-user-getuserinfo-status');
devUserGetuserinfoButton.addEventListener('click', () => {
	fetch(APIURL+"/user/getuserinfo", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: devUserGetuserinfoID.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserGetuserinfoStatus.innerText = response.message;
	});
});

