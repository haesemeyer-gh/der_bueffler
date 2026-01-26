const createFormTerminID = document.getElementById('create-form-terminid');
const createFormDate = document.getElementById('create-form-date');
const createFormTitle = document.getElementById('create-form-title');
const createFormCourse = document.getElementById('create-form-course');
const createFormTeacher = document.getElementById('create-form-teacher');
const createFormNotes = document.getElementById('create-form-notes');
const createFormButton = document.getElementById('create-form-button');
const createFormDelete = document.getElementById('create-form-delete');
const createFormStatus = document.getElementById('create-form-status');
createFormButton.addEventListener('click', () => {
	fetch(APIURL+"/appointment/edit", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			terminid: createFormTerminID.value,
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
createFormDelete.addEventListener('click', () => {
	fetch(APIURL+"/appointment/delete", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			terminid: createFormTerminID.value
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then((response) => response.json()).then((response) => {
		createFormStatus.innerText = response.message;
		createFormTerminID.value = "";
	});
});

const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('t');

async function fetchAPI() {
	let response = await fetch(APIURL+"/appointment/view", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			terminid: searchID,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});
	let json = await response.json();
	return await json.message;
}

async function updateDashboard() {

	let appointments = await fetchAPI();

	if (appointments.length <= 0) { // change to if appointment does not exist
		console.log("appointment length 0")
	} else {
		let appointmentdate = new Date(appointments.Datum);
		appointmentdate.setMinutes(appointmentdate.getMinutes() - appointmentdate.getTimezoneOffset()); // datetime-local

		createFormTerminID.value = searchID;
		createFormDate.value = appointmentdate.toISOString().slice(0,16);
		createFormTitle.value = appointments.Titel;
		createFormCourse.value = appointments.Fach;
		createFormTeacher.value = appointments.Lehrer;
		createFormNotes.value = appointments.Notizen;

	}

}

updateDashboard()

