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
    var date = new Date(nowDate.getFullYear(), nowDate.getMonth()+monthDiff);
    monthviewCurrentmonth.innerText = `${date.toLocaleString('de-DE', {month: 'long', year: 'numeric'})}`;
}

updateTable()
