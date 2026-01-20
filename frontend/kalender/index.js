let monthDiff = 0; // später vielleicht url parameter?

function fetchAPI() {
    // api fetchen
    return [
        {
            id: 1,
            date: new Date(),
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
        },
        {
            id: 1,
            date: new Date(),
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
        },
        {
            id: 1,
            date: new Date(),
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
        },
        {
            id: 1,
            date: new Date(),
            title: "Toller Termin",
            course: "SQL",
            teacher: "asjdn",
        },
        {
            id: 2,
            date: new Date("2026-01-03"),
            title: "JavaScript Klassenarbeit",
            course: "JavaScript",
            teacher: "Klose",
        },
        {
            id: 3,
            date: new Date("2026-01-10"),
            title: "JavaScript Klassenarbeit 2",
            course: "JavaScript",
            teacher: "aklsjdalskdm",
        },
        {
            id: 4,
            date: new Date("2026-01-10"),
            title: "JavaScript Klassenarbeit 2",
            course: "JavaScript",
            teacher: "aklsjdalskdm",
        }
    ]
}

const monthviewPrevButton = document.getElementById('monthview-prev-button');
const monthviewNextButton = document.getElementById('monthview-next-button');
monthviewPrevButton.addEventListener('click', () => {
    monthDiff--;
    updateDailyAppointmentList();
    updateTable();
});
monthviewNextButton.addEventListener('click', () => {
    monthDiff++;
    updateDailyAppointmentList();
    updateTable();
});

let nowDate = new Date();
const monthviewCurrentmonth = document.getElementById('monthview-currentmonth');
const monthviewTbody = document.getElementById('monthview-tbody');
function updateTable() {
    let appointments = fetchAPI();

    let date = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff);
    monthviewCurrentmonth.innerText = `${date.toLocaleString('de-DE', {month: 'long', year: 'numeric'})}`;

    let daysThisMonth = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff+1, 0).getDate();
    let firstWeekDay = date.getDay();

    monthviewTbody.innerHTML = '';
    let tableRow = document.createElement('tr');

    // adds an empty day to the current row
    function addEmptyCell() {
        let tableCell = document.createElement('td');
        //tableCell.innerText = "x";
        tableRow.appendChild(tableCell);
        firstWeekDay--;
    }

    // add a day to the current ray
    function addRealDay(day) {
        let tableCell = document.createElement('td');
        let numberAppointments = 0;
        let currentString = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff, day).toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
        for (let a = 0; a < appointments.length; a++) {
            let appointmentString = appointments[a].date.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
            if (appointmentString === currentString) {
                numberAppointments++;
            }
        }
        let daySpan = document.createElement('span');
        let appointmentSeperatorSpan = document.createElement('span');
        let appointmentNumberSpan = document.createElement('button');
        let flexContainer = document.createElement('div');
        daySpan.innerText = `${day}`.padStart(2, '0');;
        let todayString = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
        if (currentString === todayString) {
            tableCell.classList.add('calendar-today');
        }
        let currentWeekday = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff, day).getDay();
        if (currentWeekday === 0 || currentWeekday === 6) {
            daySpan.classList.add('calendar-weekend');
        }
        flexContainer.appendChild(daySpan);
        appointmentNumberSpan.classList.add('calendar-date');
        if (numberAppointments > 0) {
            appointmentSeperatorSpan.innerText = ": ";
            appointmentSeperatorSpan.classList.add('screenreader');
            appointmentNumberSpan.innerText = numberAppointments;
            switch (true) {
                case (numberAppointments === 1):
                    appointmentNumberSpan.classList.add('calendar-date-1');
                    break;
                case (numberAppointments === 2):
                    appointmentNumberSpan.classList.add('calendar-date-2');
                    break;
                case (numberAppointments >= 3):
                    appointmentNumberSpan.classList.add('calendar-date-3');
                    break;
            }
            appointmentNumberSpan.addEventListener('click', () => {
                updateDailyAppointmentList(day);
            });
            flexContainer.append(appointmentSeperatorSpan, appointmentNumberSpan);
        }
        tableCell.addEventListener('click', () => {
            updateDailyAppointmentList(day);
        });
        tableCell.appendChild(flexContainer);
        tableRow.appendChild(tableCell);
    }

    // add empty days at beginning of month
    while (firstWeekDay > 0) {
        addEmptyCell();
    }

    // add days
    for (let i = 1; i <= daysThisMonth; i++) {
        if (tableRow.children.length < 7) {
            addRealDay(i);
        } else { // new row
            monthviewTbody.append(tableRow);
            tableRow = document.createElement('tr');
            addRealDay(i);
        }
    }

    // add empty days at end of month
    let daysInLastRow = tableRow.children.length;
    for (let i = 0; i < 7 - daysInLastRow; i++) {
        addEmptyCell();
    }
    monthviewTbody.append(tableRow);

}

const dailyAppointmentList = document.getElementById('calendar-daily-appointment-list');
function updateDailyAppointmentList(day) {
    if (day) {
        let appointments = fetchAPI();

        let dateToDisplay = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff, day)
        let dateToDisplayString = dateToDisplay.toLocaleString('de-DE', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'});
        dailyAppointmentList.classList.remove('hidden');

        let listHeader = document.createElement('div');
        let listHeaderText = document.createElement('h3');
        listHeaderText.innerText = `Termine am ${dateToDisplayString}:`;
        listHeader.appendChild(listHeaderText);

        let listList = document.createElement('ul');
        for (let i = 0; i < appointments.length; i++) {
            let appointmentsDateString = appointments[i].date.toLocaleString('de-DE', {weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'});
            if (appointmentsDateString === dateToDisplayString) {
                let listItem = document.createElement('li');

                let listItemCourse = document.createElement('span');
                listItemCourse.innerText = appointments[i].course;
                listItemCourse.classList.add('appointment-list-course');

                let listItemLink = document.createElement('a');
                listItemLink.innerText = appointments[i].title;
                listItemLink.href = "/termin/index.html?t=" + appointments[i].id; //////////////////////////////////////////////////// index.html
                listItemLink.classList.add('appointment-list-title');

                listItem.append(listItemCourse, listItemLink);
                listList.appendChild(listItem);
            }
        }
        if (listList.children.length === 0) {
            let listItem = document.createElement('li');
            listItem.innerText = "Es stehen keine Termine an!";
            listList.appendChild(listItem);
        }

        dailyAppointmentList.innerHTML = "";
        dailyAppointmentList.append(listHeader, listList);
    } else {
        dailyAppointmentList.innerHTML = "";
        dailyAppointmentList.classList.add('hidden');
    }
}

updateTable()
