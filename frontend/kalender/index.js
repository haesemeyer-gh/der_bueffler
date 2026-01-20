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
    let date = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff);
    monthviewCurrentmonth.innerText = `${date.toLocaleString('de-DE', {month: 'long', year: 'numeric'})}`;

    let daysThisMonth = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff+1, 0).getDate();
    let firstWeekDay = date.getDay();

    monthviewTbody.innerHTML = '';
    let tableRow = document.createElement('tr');

    // add empty days at beginning of month
    while (firstWeekDay > 0) {
        let tableCell = document.createElement('td');
        tableCell.innerText = "x";
        tableRow.appendChild(tableCell);
        firstWeekDay--;
    }

    // add days
    for (let i = 1; i <= daysThisMonth; i++) {
        if (tableRow.children.length < 7) {
            let tableCell = document.createElement('td');
            tableCell.innerText = `${i}`;
            tableRow.appendChild(tableCell);
        } else { // new row
            monthviewTbody.append(tableRow);
            tableRow = document.createElement('tr');
            let tableCell = document.createElement('td');
            tableCell.innerText = `${i}`;
            tableRow.appendChild(tableCell);
        }
    }

    // add empty days at end of month
    let daysInLastRow = tableRow.children.length;
    for (let i = 0; i < 7 - daysInLastRow; i++) {
        let tableCell = document.createElement('td');
        tableCell.innerText = "x";
        tableRow.appendChild(tableCell);
    }
    monthviewTbody.append(tableRow);

}

updateTable()
