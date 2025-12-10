const dashboardEl = document.getElementById('dashboard');
async function updateDashboard() {

    // fetch api
    const appointments = [
        {
            date: new Date(),
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
        },
        {
            date: new Date("2026-01-03"),
            title: "JavaScript Klassenarbeit",
            course: "JavaScript",
            teacher: "Klose",
        },
        {
            date: new Date("2026-01-10"),
            title: "JavaScript Klassenarbeit 2",
            course: "JavaScript",
            teacher: "aklsjdalskdm",
        },
        {
            date: new Date("2026-01-10"),
            title: "JavaScript Klassenarbeit 2",
            course: "JavaScript",
            teacher: "aklsjdalskdm",
        }
    ]

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
            let day = Date.parse(new Date(appointments[i].date.getFullYear(), appointments[i].date.getMonth(), appointments[i].date.getDate()));
            let dateString = appointments[i].date.toLocaleString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
            let appointmentEl = document.createElement('li');
            let dateEl = document.createElement('span');
            let courseEl = document.createElement('span');
            let teacherEl = document.createElement('span');
            let titleEl = document.createElement('span');
            dateEl.innerText = `${dateString}:`;
            //date.innerHTML += `&shy;`;
            courseEl.innerText = `${appointments[i].course}`;
            teacherEl.innerText = `${appointments[i].teacher}`;
            titleEl.innerText = `${appointments[i].title}`;
            dateEl.classList.add('appointment-list-date');
            courseEl.classList.add('appointment-list-course');
            teacherEl.classList.add('appointment-list-teacher');
            titleEl.classList.add('appointment-list-title');
            appointmentEl.append(dateEl, courseEl, /*teacherEl,*/ titleEl);

            if (day <= todayDate+dayInMs*7) {
                listElNow.appendChild(appointmentEl);
            } else if (day <= todayDate+dayInMs*30) {
                listElSoon.appendChild(appointmentEl);
            } else {
                listElLater.appendChild(appointmentEl);
            }
        }

        dashboardEl.append(detailsElNow, detailsElSoon, detailsElLater);
    }
}

updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes
