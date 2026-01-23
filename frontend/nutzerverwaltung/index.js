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

