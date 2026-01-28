const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('t');

async function fetchAPI() {
	let response = await fetch(APIURL+"/history/list", {
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

const detailEl = document.getElementById('detail-view');
async function updateDashboard() {

	if (searchID) {
		let appointments = await fetchAPI();

		detailEl.innerHTML = ``;
		if (appointments.length <= 0) { // change to if appointment does not exist
			let messageEl = document.createElement('h3');
			messageEl.innerText = 'Für diesen Termin existieren keine vorherigen Änderungen.';
			detailEl.appendChild(messageEl)
		} else {
			let messageEl = document.createElement('h3');
			messageEl.innerText = 'Vorherige Versionen dieses Termins:';

			let histList = document.createElement('ul');

			console.log(appointments)
			appointments.forEach(appointment => {

				let dateString = new Date(appointment.Timestamp).toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});

				let listItem = document.createElement('li');
				let linkItem = document.createElement('a');
				let lastchangedSpan = document.createElement('span');
				let timestampSpan = document.createElement('span');
				let titleSpan = document.createElement('b');

				lastchangedSpan.innerText = `[Zuletzt bearbeitet von: userid ${appointment.ZuletztGeaendert}]`;
				timestampSpan.innerText = `Stand bis ${dateString} Uhr:`;
				titleSpan.innerText = `${appointment.Titel}`;

				linkItem.href = `../hist?c=${appointment.AenderungsID}`;

				linkItem.append(lastchangedSpan, timestampSpan, titleSpan)
				listItem.appendChild(linkItem);
				histList.appendChild(listItem);
				histList.classList.add('appointment-history-list')

			})

			detailEl.append(messageEl, histList);

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

