async function fetchAPI() {
	let response = await fetch(APIURL+"/appointment/list-deleted", {
		method: "POST",
		body: JSON.stringify({
			token: cookieToken,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});
	let json = await response.json();
	return await json.message.sort((a, b) => {
		return new Date(a.Datum) - new Date(b.Datum)
	});
}

const detailEl = document.getElementById('detail-view');
async function updateDashboard() {

	let appointments = await fetchAPI();

	detailEl.innerHTML = ``;
	if (appointments.length <= 0) {
		let messageEl = document.createElement('h3');
		messageEl.innerText = 'Du hast keine gelöschten Termine.'
		detailEl.appendChild(messageEl)
	} else {
		let listEl = document.createElement('ul');

		appointments.forEach((appointment) => {
			console.log(appointment);
			let listItem = document.createElement('li');
			let listLink = document.createElement('a');
			let lastchangedSpan = document.createElement('span');
			let timestampSpan = document.createElement('span');
			let titleSpan = document.createElement('b');

			lastchangedSpan.innerText = `[Gelöscht von: ${appointment.ZuletztGeaendertName}]`;
			timestampSpan.innerText = `<Termin ${appointment.TerminID}>`;
			titleSpan.innerText = `${appointment.Titel}`;

			listLink.href = `../log?t=${appointment.TerminID}`;

			listLink.append(lastchangedSpan, timestampSpan, titleSpan)
			listItem.appendChild(listLink);
			listEl.appendChild(listItem);
			listEl.classList.add('appointment-history-list')
		});

		detailEl.appendChild(listEl);
	}

}

updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes

