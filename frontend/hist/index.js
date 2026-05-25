const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('c');

async function fetchAPI() {
	let response = await fetch(APIURL+"/history/view", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
			aenderungsid: searchID,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});
	let json = await response.json();
	return await json.message;
}

const detailEl = document.getElementById('detail-view');
async function updateDashboard() {

	if (searchID) {
		let appointments = await fetchAPI();

		detailEl.innerHTML = ``;
		if (appointments.length <= 0) { // change to if appointment does not exist
			let messageEl = document.createElement('h3');
			messageEl.innerText = 'Dieser Termin existiert nicht.';
			detailEl.appendChild(messageEl)
		} else {
			let messageEl = document.createElement('h3');
			messageEl.innerText = appointments.Titel;
			detailEl.appendChild(messageEl)

			let appointmentdate_datetimelocal = new Date(appointments.Datum);
			appointmentdate_datetimelocal.setMinutes(appointmentdate_datetimelocal.getMinutes() - appointmentdate_datetimelocal.getTimezoneOffset()); // datetime-local
			let appointmentdate = new Date(appointments.Datum);
			let day = Date.parse(new Date(appointmentdate.getFullYear(), appointmentdate.getMonth(), appointmentdate.getDate()));
			let dateString = appointmentdate.toLocaleString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
			let appointmentEl = document.createElement('ul');
			let dateEl = document.createElement('li');
			let courseContainerEl = document.createElement('li');
			let courseEl = document.createElement('span');
			let teacherEl = document.createElement('li');
			let teamEl = document.createElement('li');
			let lastChangedByEl = document.createElement('li');
			dateEl.innerText = `Datum: ${dateString}`;
			courseContainerEl.innerText = `Fach: `;
			courseEl.innerText = `${appointments.Fach}`;
			teacherEl.innerText = `Lehrer: ${appointments.Lehrer}`;
			teamEl.innerText = `Team: ${appointments.TeamName}`;
			lastChangedByEl.innerText = `zuletzt geändert von: ${appointments.ZuletztGeaendertName}`;
			dateEl.classList.add('appointment-detail-date');
			courseEl.classList.add('appointment-detail-course');
			teacherEl.classList.add('appointment-detail-teacher');
			appointmentEl.classList.add('appointment-detail-view');
			courseContainerEl.appendChild(courseEl);
			appointmentEl.append(dateEl, courseContainerEl, teacherEl, teamEl, lastChangedByEl);

			let linkContainer = document.createElement('p');
			linkContainer.classList.add('appointment-detail-links');
			let editLink = document.createElement('a');
			editLink.innerText = "Termin bearbeiten"
			editLink.href = `../bearbeiten
				?termin=${appointments.TerminID}
				&datum=${appointmentdate_datetimelocal.toISOString().slice(0,16)}
				&titel=${appointments.Titel}
				&fach=${appointments.Fach}
				&lehrer=${appointments.Lehrer}
				&notizen=${appointments.Notizen}
			`;
			let logLink = document.createElement('a');
			logLink.innerText = "Änderungen"
			logLink.href = `../log?t=${appointments.TerminID}`
			linkContainer.append(editLink, logLink)

			let notesEl = document.createElement('p');
			notesEl.classList.add('appointment-detail-notes');
			notesEl.innerText = appointments.Notizen;

			detailEl.append(appointmentEl, linkContainer, notesEl);
		}

	} else {
		detailEl.innerHTML = ``;
		let messageEl = document.createElement('h3');
		messageEl.innerText = 'Fehler: Keine angegebene Termin-ID!'
		detailEl.appendChild(messageEl)
	}
}

updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes

