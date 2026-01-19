const urlParams = new URLSearchParams(window.location.search);
const searchID = urlParams.get('t');

const detailEl = document.getElementById('detail-view');
async function updateDashboard() {

    if (searchID) {


        // fetch api
        const appointments = {
            date: new Date(),
            lastChangedBy: 3,
            team: 13,
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
            notes: "Dies ist ein toller langer Text der eine Beschreibung für den Termin mit möglichen Informationen wie beispielsweise was in diesem Test abgefragt wird nennt."
        }

        detailEl.innerHTML = ``;
        if (appointments.length <= 0) { // change to if appointment does not exist
            let messageEl = document.createElement('h3');
            messageEl.innerText = 'Dieser Termin existiert nicht.';
            detailEl.appendChild(messageEl)
        } else {
            let messageEl = document.createElement('h3');
            messageEl.innerText = appointments.title;
            detailEl.appendChild(messageEl)

            /* Infos die fehlen:
             * - welches Team
             * - Zuletzt Geändert durch
            */

            let nowDate = new Date();
            let todayDate = Date.parse(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()));
            let dayInMs = 8.64e+7;

            let day = Date.parse(new Date(appointments.date.getFullYear(), appointments.date.getMonth(), appointments.date.getDate()));
            let dateString = appointments.date.toLocaleString('de-DE', {weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
            let appointmentEl = document.createElement('ul');
            let dateEl = document.createElement('li');
            let courseContainerEl = document.createElement('li');
            let courseEl = document.createElement('span');
            let teacherEl = document.createElement('li');
            dateEl.innerText = `${dateString}`;
            courseEl.innerText = `${appointments.course}`;
            teacherEl.innerText = `${appointments.teacher}`;
            dateEl.classList.add('appointment-detail-date');
            courseEl.classList.add('appointment-detail-course');
            teacherEl.classList.add('appointment-detail-teacher');
            appointmentEl.classList.add('appointment-detail-view');
            courseContainerEl.appendChild(courseEl);
            appointmentEl.append(dateEl, courseContainerEl, teacherEl,);

            let notesEl = document.createElement('p');
            notesEl.innerText = appointments.notes;

            detailEl.append(appointmentEl, notesEl);

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
