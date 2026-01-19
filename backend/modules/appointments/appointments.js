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

function createAppointment(teamid, date, title, course, teacher, notes) {
    return query("INSERT INTO appointments (TeamID, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?)", [teamid, date, title, course, teacher, notes]);
}

function listAppointments(teamid) {
    return query("SELECT Datum, Titel, Fach, Lehrer FROM appointments WHERE teamid = ?", [teamid]);
}

function viewAppointment(teamid) {
    return query("SELECT * FROM appointments WHERE teamid = ?", [teamid]);
}

function editAppointment(terminid, date, title, course, teacher, notes) {
    return query("UPDATE appointments SET TerminID = ?, Datum = ?, Titel = ?, Fach = ?, Lehrer = ?, Notizen = ? WHERE terminid = ?", [terminid, date, title, course, teacher, notes]);
}

async function deleteAppointment(terminid) {
    let current = await query("SELECT * FROM appointments WHERE terminid = ?", [terminid])
    //query("INSERT INTO changes (Timestamp, TerminID, Datum, Titel, Fach, Lehrer, Notizen) VALUES (?, ?, ?, ?, ?, ?, ?)", [new Date(), terminid, date, title, course, teacher, notes])
    //return query("DELETE FROM appointments WHERE terminid = ?", [terminid]);
    console.log(current[0].Titel)
}

deleteAppointment(3)