const devRenameName = document.getElementById('nv-dev-rename-name');
const devRenameButton = document.getElementById('nv-dev-rename-button');
const devRenameStatus = document.getElementById('nv-dev-rename-status');
devRenameButton.addEventListener('click', () => {
	fetch(APIURL+"/auth/rename", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			name: devRenameName.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devRenameStatus.innerText = response.message;
	});
});

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

let devTeamsDeleteID = document.getElementById('nv-dev-teams-delete-id');
const devTeamsDeleteButton = document.getElementById('nv-dev-teams-delete-button');
const devTeamsDeleteStatus = document.getElementById('nv-dev-teams-delete-status');
devTeamsDeleteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/delete", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: parseInt(devTeamsDeleteID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsDeleteStatus.innerText = response.message;
	});
});

let devTeamsInfoID = document.getElementById('nv-dev-teams-info-id');
const devTeamsInfoButton = document.getElementById('nv-dev-teams-info-button');
const devTeamsInfoStatus = document.getElementById('nv-dev-teams-info-status');
devTeamsInfoButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/info", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: parseInt(devTeamsInfoID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then(async (response) => {
		let json = await response.json();
		if (response.status === 201) {
			let pre = document.createElement('pre');
			console.log(json.message);
			pre.innerText = JSON.stringify(json.message, null, 2);
			devTeamsInfoStatus.appendChild(pre);
		} else {
		devTeamsInfoStatus.innerText = json.message;
		}
	});
});

let devTeamsAddTeamID = document.getElementById('nv-dev-teams-add-teamid');
let devTeamsAddUserID = document.getElementById('nv-dev-teams-add-userid');
const devTeamsAddButton = document.getElementById('nv-dev-teams-add-button');
const devTeamsAddStatus = document.getElementById('nv-dev-teams-add-status');
devTeamsAddButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/add", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: parseInt(devTeamsAddTeamID.value),
			userid: parseInt(devTeamsAddUserID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsAddStatus.innerText = response.message;
	});
});

let devTeamsRemoveTeamID = document.getElementById('nv-dev-teams-remove-teamid');
let devTeamsRemoveUserID = document.getElementById('nv-dev-teams-remove-userid');
const devTeamsRemoveButton = document.getElementById('nv-dev-teams-remove-button');
const devTeamsRemoveStatus = document.getElementById('nv-dev-teams-remove-status');
devTeamsRemoveButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/remove", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: parseInt(devTeamsRemoveTeamID.value),
			userid: parseInt(devTeamsRemoveUserID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsRemoveStatus.innerText = response.message;
	});
});

let devTeamsPromoteTeamID = document.getElementById('nv-dev-teams-promote-teamid');
let devTeamsPromoteUserID = document.getElementById('nv-dev-teams-promote-userid');
const devTeamsPromoteButton = document.getElementById('nv-dev-teams-promote-button');
const devTeamsPromoteStatus = document.getElementById('nv-dev-teams-promote-status');
devTeamsPromoteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/promote", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: parseInt(devTeamsPromoteTeamID.value),
			userid: parseInt(devTeamsPromoteUserID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsPromoteStatus.innerText = response.message;
	});
});

let devTeamsDemoteTeamID = document.getElementById('nv-dev-teams-demote-teamid');
let devTeamsDemoteUserID = document.getElementById('nv-dev-teams-demote-userid');
const devTeamsDemoteButton = document.getElementById('nv-dev-teams-demote-button');
const devTeamsDemoteStatus = document.getElementById('nv-dev-teams-demote-status');
devTeamsDemoteButton.addEventListener('click', () => {
	fetch(APIURL+"/teams/demote", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			teamid: parseInt(devTeamsDemoteTeamID.value),
			userid: parseInt(devTeamsDemoteUserID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devTeamsDemoteStatus.innerText = response.message;
	});
});

let devUserMaketeacherID = document.getElementById('nv-dev-user-maketeacher-id');
const devUserMaketeacherButton = document.getElementById('nv-dev-user-maketeacher-button');
const devUserMaketeacherStatus = document.getElementById('nv-dev-user-maketeacher-status');
devUserMaketeacherButton.addEventListener('click', () => {
	fetch(APIURL+"/user/maketeacher", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: parseInt(devUserMaketeacherID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserMaketeacherStatus.innerText = response.message;
	});
});

let devUserDeleteteacherID = document.getElementById('nv-dev-user-deleteteacher-id');
const devUserDeleteteacherButton = document.getElementById('nv-dev-user-deleteteacher-button');
const devUserDeleteteacherStatus = document.getElementById('nv-dev-user-deleteteacher-status');
devUserDeleteteacherButton.addEventListener('click', () => {
	fetch(APIURL+"/user/deleteteacher", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: parseInt(devUserDeleteteacherID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserDeletetacherStatus.innerText = response.message;
	});
});

let devUserMakeadminID = document.getElementById('nv-dev-user-makeadmin-id');
const devUserMakeadminButton = document.getElementById('nv-dev-user-makeadmin-button');
const devUserMakeadminStatus = document.getElementById('nv-dev-user-makeadmin-status');
devUserMakeadminButton.addEventListener('click', () => {
	fetch(APIURL+"/user/makeadmin", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			id: parseInt(devUserMakeadminID.value),
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		devUserMakeadminStatus.innerText = response.message;
	});
});

let devUserGetuserinfoID = document.getElementById('nv-dev-user-getuserinfo-id');
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
	}).then(async (response) => {
		let json = await response.json();
		if (response.status === 201) {
			let pre = document.createElement('pre');
			console.log(json.message);
			pre.innerText = JSON.stringify(json.message, null, 2);
			devUserGetuserinfoStatus.appendChild(pre);
		} else {
			devUserGetuserinfoStatus.innerText = json.message;
		}
	});
});

const resetPasswordContainer = document.getElementById('user-settings-container');
let resetPassword = document.createElement('a')
resetPassword.href = `/reset?s=${cookieToken}`;
resetPassword.innerHTML = "Passwort zurücksetzen";
resetPasswordContainer.appendChild(resetPassword);

fetch(APIURL+"/teams/list", {
	method: "POST",
	body: JSON.stringify({
		token: cookieToken
	}),
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
}).then((response) => response.json()).then((response) => {

	[
		devTeamsDeleteID,
		devTeamsInfoID,
		devTeamsAddTeamID,
		devTeamsRemoveTeamID,
		devTeamsPromoteTeamID,
		devTeamsDemoteTeamID
	].forEach((inputel) => {

		const devFormTeamDropdown = document.createElement("select");
		devFormTeamDropdown.classList.add("nv-dev-dropdown");
		devFormTeamDropdown.id = inputel.id;

		response.message.forEach((team) => {
			const option = document.createElement("option");
			option.innerText = `[${team.TeamID}] ${team.TeamName}`;
			option.value = team.TeamID;
			devFormTeamDropdown.appendChild(option);
		});

		inputel.replaceWith(devFormTeamDropdown);
		// the new thing = document.getElementById(inputel.id);

	});

	devTeamsDeleteID = document.getElementById('nv-dev-teams-delete-id');
	devTeamsInfoID = document.getElementById('nv-dev-teams-info-id');
	devTeamsAddTeamID = document.getElementById('nv-dev-teams-add-teamid');
	devTeamsRemoveTeamID = document.getElementById('nv-dev-teams-remove-teamid');
	devTeamsPromoteTeamID = document.getElementById('nv-dev-teams-promote-teamid');
	devTeamsDemoteTeamID = document.getElementById('nv-dev-teams-demote-teamid');

});


fetch(APIURL+"/user/list", {
	method: "POST",
	body: JSON.stringify({
		token: cookieToken
	}),
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
}).then((response) => response.json()).then((response) => {

	[
		devTeamsAddUserID,
		devTeamsRemoveUserID,
		devTeamsPromoteUserID,
		devTeamsDemoteUserID,
		devUserMaketeacherID,
		devUserDeleteteacherID,
		devUserMakeadminID,
		devUserGetuserinfoID
	].forEach((inputel) => {

		const devFormUserDropdown = document.createElement("select");
		devFormUserDropdown.classList.add("nv-dev-dropdown");
		devFormUserDropdown.id = inputel.id;

		response.message.forEach((user) => {
			const option = document.createElement("option");
			option.innerText = `[${user.ID}] "${user.Name}" <${user.Mail}>`;
			option.value = user.ID;
			devFormUserDropdown.appendChild(option);
		});

		inputel.replaceWith(devFormUserDropdown);
		// the new thing = document.getElementById(inputel.id);

	});

	devTeamsAddUserID = document.getElementById('nv-dev-teams-add-userid');
	devTeamsRemoveUserID = document.getElementById('nv-dev-teams-remove-userid');
	devTeamsPromoteUserID = document.getElementById('nv-dev-teams-promote-userid');
	devTeamsDemoteUserID = document.getElementById('nv-dev-teams-demote-userid');
	devUserMaketeacherID = document.getElementById('nv-dev-user-maketeacher-id');
	devUserDeleteteacherID = document.getElementById('nv-dev-user-deleteteacher-id');
	devUserMakeadminID = document.getElementById('nv-dev-user-makeadmin-id');
	devUserGetuserinfoID = document.getElementById('nv-dev-user-getuserinfo-id');

});

