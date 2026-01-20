let monthDiff = 0; // später vielleicht url parameter?

const monthviewPrevButton = document.getElementById('monthview-prev-button');
const monthviewNextButton = document.getElementById('monthview-next-button');
monthviewPrevButton.addEventListener('click', () => {
    monthDiff--;
    updateTable();
});
monthviewNextButton.addEventListener('click', () => {
    monthDiff++;
    updateTable();
});

let nowDate = new Date();
const monthviewCurrentmonth = document.getElementById('monthview-currentmonth');
const monthviewTbody = document.getElementById('monthview-tbody');
function updateTable() {

    // api fetchen
    const appointments = [
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
        for (let a = 0; a < appointments.length; a++) {
            let appointmentString = appointments[a].date.toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
            let currentString = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff, day).toLocaleString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
            if (appointmentString === currentString) {
                numberAppointments++;
            }
        }
        tableCell.innerText = `${day}${(numberAppointments ? ": "+numberAppointments : "")}`;
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

updateTable()
