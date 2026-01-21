const createFormTeamID = document.getElementById('create-form-teamid');
const createFormDate = document.getElementById('create-form-date');
const createFormTitle = document.getElementById('create-form-title');
const createFormCourse = document.getElementById('create-form-course');
const createFormTeacher = document.getElementById('create-form-teacher');
const createFormNotes = document.getElementById('create-form-notes');
const createFormButton = document.getElementById('create-form-button');
const createFormStatus = document.getElementById('create-form-status');
createFormButton.addEventListener('click', () => {
    fetch(APIURL+"/appointment/create", {
        method: "POST",
        body: JSON.stringify({
            token: cookieToken,
			teamid: createFormTeamID.value,
			date: createFormDate.value,
			title: createFormTitle.value,
			course: createFormCourse.value,
			teacher: createFormTeacher.value,
			notes: createFormNotes.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then((response) => response.json()).then((response) => {
        createFormStatus.innerText = response.message;
    });
});

