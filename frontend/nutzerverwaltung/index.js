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
