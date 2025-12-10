function updateClock() {
    let today = new Date().toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    document.getElementById('date').innerText = today;
}
updateClock()
setInterval(updateClock, 10000); // 10s
