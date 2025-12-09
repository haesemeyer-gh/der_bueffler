function updateClock() {
    let today = new Date().toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    document.getElementById('date').innerText = today;
}
updateClock()
setInterval(updateClock, 10000); // 10s

const dashboardEl = document.getElementById('dashboard');
async function updateDashboard() {
    // fetch api
    const appointments = [
        {
            date: new Date(),
            datestr: new Date().toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
            title: "Toller Termin",
            course: "SQL",
            teacher: "Hitler",
        },
        {
            date: new Date(),
            datestr: new Date(1970).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
            title: "JavaScript Klassenarbeit",
            course: "JavaScript",
            teacher: "Hitler",
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
    }

    // put different dates into different lists:
    //  * today - this week (automatically visible)
    //  * next week - 3 weeks later
    //  * everything after that

    let listEl = document.createElement('ul');
    for (let i = 0; i<appointments.length; i++) {
        let appointmentEl = document.createElement("li");
        appointmentEl.innerText = `${appointments[i].datestr}: ${appointments[i].title} (${appointments[i].course}, ${appointments[i].teacher})`;
        listEl.appendChild(appointmentEl);
    }

    dashboardEl.appendChild(listEl);
}
updateDashboard()
setInterval(updateDashboard, 300000) // 3 minutes
