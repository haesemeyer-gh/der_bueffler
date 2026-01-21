const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('t');

const detailEl = document.getElementById('detail-view');
async function updateDashboard() {

	if (searchID) {

		fetch(APIURL+"/appointment/view", {
			method: "POST",
			body: JSON.stringify({
				token: cookieToken,
				terminid: searchID,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then((response) => response.json()).then((response) => {
			let appointments = response.message;

			// dann fetche apis für teaminfo und nutzerinfo
			const teamname = "temporäre Teamnamenvariable";
			const nutzername = "hitler";

			detailEl.innerHTML = ``;
			if (appointments.length <= 0) { // change to if appointment does not exist
				let messageEl = document.createElement('h3');
				messageEl.innerText = 'Dieser Termin existiert nicht.';
				detailEl.appendChild(messageEl)
			} else {
				let messageEl = document.createElement('h3');
				messageEl.innerText = appointments.Titel;
				detailEl.appendChild(messageEl)

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
				teamEl.innerText = `Team: ${teamname}`;
				lastChangedByEl.innerText = `zuletzt geändert von: ${nutzername}`;
				dateEl.classList.add('appointment-detail-date');
				courseEl.classList.add('appointment-detail-course');
				teacherEl.classList.add('appointment-detail-teacher');
				appointmentEl.classList.add('appointment-detail-view');
				courseContainerEl.appendChild(courseEl);
				appointmentEl.append(dateEl, courseContainerEl, teacherEl, teamEl, lastChangedByEl);

				let notesEl = document.createElement('p');
				notesEl.innerText = appointments.Notizen;

				detailEl.append(appointmentEl, notesEl);
			}

		});

	} else {
		detailEl.innerHTML = ``;
		let messageEl = document.createElement('h3');
		messageEl.innerText = 'Fehler: Keine angegebene Termin-ID!'
		detailEl.appendChild(messageEl)
	}
}

updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes

