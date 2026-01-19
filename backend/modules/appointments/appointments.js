export function appointmentToObject(title, teamid, date, course, teacher, notes) {
    let dateString = new Date(date).toLocaleString('de-DE', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    let appointmentObject = {
        title: title,
        teamid: teamid,
        date: date,
        dateString: dateString,
        course: course,
        teacher: teacher,
        notes: notes
    };
    return appointmentObject;
}

async function createAppointment(teamid, date, title, course, teacher, notes) {
    return query("INSERT INTO appointments (TeamID, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?)", [teamid, date, title, course, teacher, notes]);
}

async function listAppointments(teamid) {
    return query("SELECT Datum, Titel, Fach, Lehrer FROM appointments WHERE teamid = ?", [teamid]);
}

async function viewAppointment(terminid) {
    return query("SELECT * FROM appointments WHERE teamid = ?", [terminid]);
}

async function editAppointment(terminid, date, title, course, teacher, notes) {
    // viewAppointment() und in variable speichern
    // vorherigen stand aus viewAppointment() in changes table schreiben
    return query("UPDATE appointments SET Datum = ?, Titel = ?, Fach = ?, Lehrer = ?, Notizen = ? WHERE terminid = ?", [terminid, date, title, course, teacher, notes]);
}

async function deleteAppointment(terminid) {
    let current = await viewAppointment(terminid);
    //query("INSERT INTO changes (Timestamp, TerminID, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?)", [new Date(), terminid, date, title, course, teacher, notes])
    //return query("DELETE FROM appointments WHERE terminid = ?", [terminid]);
    console.log(current[0].Titel)
}
