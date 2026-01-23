async function fetchAPI() {
	let response = await fetch(APIURL+"/appointment/list-user", {
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

const dashboardEl = document.getElementById('dashboard');
async function updateDashboard() {

	let appointments = await fetchAPI();

	dashboardEl.innerHTML = ``;
	if (appointments.length <= 0) {
		let messageEl = document.createElement('h3');
		messageEl.innerText = 'Es stehen keine Termine an! :D'
		dashboardEl.appendChild(messageEl)
	} else {
		let messageEl = document.createElement('h3');
		messageEl.innerText = 'Anstehende Termine:';
		dashboardEl.appendChild(messageEl)

		let detailsElNow = document.createElement('details');
		let summaryElNow = document.createElement('summary');
		let listElNow = document.createElement('ul');
		summaryElNow.innerText = "Termine der nächsten Woche";
		detailsElNow.appendChild(summaryElNow);
		detailsElNow.appendChild(listElNow);
		detailsElNow.open = true;
		let detailsElSoon = document.createElement('details');
		let summaryElSoon = document.createElement('summary');
		let listElSoon = document.createElement('ul');
		summaryElSoon.innerText = "Termine der nächsten 30 Tage";
		detailsElSoon.appendChild(summaryElSoon);
		detailsElSoon.appendChild(listElSoon);
		let detailsElLater = document.createElement('details');
		let summaryElLater = document.createElement('summary');
		let listElLater = document.createElement('ul');
		summaryElLater.innerText = "Zukünftige Termine";
		detailsElLater.appendChild(summaryElLater);
		detailsElLater.appendChild(listElLater);

		let nowDate = new Date();
		let todayDate = Date.parse(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()));
		let dayInMs = 8.64e+7;

		for (let i = 0; i<appointments.length; i++) {
			let appointmentdate = new Date(appointments[i].Datum);
			let day = Date.parse(new Date(appointmentdate.getFullYear(), appointmentdate.getMonth(), appointmentdate.getDate()));
			let dateString = appointmentdate.toLocaleString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
			let appointmentEl = document.createElement('li');
			let dateEl = document.createElement('span');
			let courseEl = document.createElement('span');
			let teacherEl = document.createElement('span');
			let titleEl = document.createElement('a');
			dateEl.innerText = `${dateString}:`;
			//date.innerHTML += `&shy;`;
			courseEl.innerText = `${appointments[i].Fach}`;
			teacherEl.innerText = `${appointments[i].Lehrer}`;
			titleEl.innerText = `${appointments[i].Titel}`;
			titleEl.href=`termin/index.html?t=${appointments[i].TerminID}`; //////////////////////////////////////////////////// index.html
			dateEl.classList.add('appointment-list-date');
			courseEl.classList.add('appointment-list-course');
			teacherEl.classList.add('appointment-list-teacher');
			titleEl.classList.add('appointment-list-title');
			appointmentEl.append(dateEl, courseEl, /*teacherEl,*/ titleEl);

			console.log(appointmentdate, day, todayDate)
			if (day > todayDate-dayInMs*1 && day <= todayDate+dayInMs*7) {
				listElNow.appendChild(appointmentEl);
			} else if (day > todayDate-dayInMs*1 && day <= todayDate+dayInMs*30) {
				listElSoon.appendChild(appointmentEl);
			} else if (day > todayDate-dayInMs*1) {
				listElLater.appendChild(appointmentEl);
			}
		}

		if (listElNow.innerHTML != ``) {
			dashboardEl.appendChild(detailsElNow)
		}
		if (listElSoon.innerHTML != ``) {
			dashboardEl.appendChild(detailsElSoon)
		}
		if (listElLater.innerHTML != ``) {
			dashboardEl.appendChild(detailsElLater)
		}
	}

}

updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes

