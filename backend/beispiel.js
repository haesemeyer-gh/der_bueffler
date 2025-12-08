/* =================== *
 *  BEISPIEL-FUNKTION  *
 * =================== */

// Diese Funktion schickt ein SQL-Statement an die Datenbank.
// Konkret nimmt sie die angegebene Variable `teamName` und erstellt ein neues Team mit diesem Namen.
// Sie gibt zurück, was die Datenbank antwortet. Das ist vorallem nützlich für ein SELECT-Statement.
function createTeam(teamName){
    // Die Funktion `query()` akzeptiert zwei Argumente, einen 'Template String' und einen Array mit Variablen, die eingesetzt werden.
    // (Werden keine Variablen eingesetzt, kann der Array einfach leer sein.)
    return query("INSERT INTO teams (TeamName) VALUES (?)", [teamName]);
    // Warum nicht einfach die Variablen direkt in den String schreiben? z.B.:
    //      query(`INSERT INTO teams (TeamName) VALUES '${teamName}'`);
    // Ganz einfach: Der Nutzer könnte sein Team wie folgt nennen:
    //      "Mein tolles Team'; DROP TABLE user"
    // Das Statement an die Datenbank würde also so lauten:
    //      `INSERT INTO teams (TeamName) VALUES 'Mein tolles Team'; DROP TABLE user;`
    //
    // Wir wollen nicht, dass der Nutzer SQL Statements an die Datenbank schreiben kann. *(SQL Injection)*
    // Die `query` Methode von der MariaDB-Library erlaubt es uns also, anstelle von Variablen einfach ein `?` zu setzen,
    // welches dann mit Daten aus dem Array ergänzt wird. Ohne dass wir uns drum kümmern müssen, wird aber alles ordentlich escaped,
    // sodaß der Nutzer keine SQL Injection machen kann.
}

/* =================== *
 *  BEISPIEL-ENDPOINT  *
 * =================== */

// Der Server stellt hier einen API-"Endpoint" bereit, den der Nutzer unter dem Link `/teams/create` erreichen kann.
// Es gibt verschiedene HTTP-"Methoden", z.B. die Methode GET, was verwendet wird, wenn man einfach nur eine Webseite aufruft. Sie gibt keine weiteren Daten an den Server.
// Wir verwenden die POST Methode, bei der der Nutzer weitere Daten an den Server schicken kann. Wir brauchen ja seinen Anmelde-Token und ggf. weitere Daten.
//
// Beispiel-Anfrage vom Nutzer an diesen Endpoint:
//      {
//          "token": "anmeldetoken-hier-einfügen",
//          "name": "Mein tolles Team"
//      }
//
app.post('/teams/create', async (req, res) => {
    const token = req.body.token; // erwartete input daten: "token"
    const name = req.body.name; // erwartete input daten: "name"

    let response;

    // Die `verifyToken()` Funktion überprüft, welche Berechtigungen der Nutzer hat und wie seine ID lautet. Das Ergebnis schreiben wir in die `permissions` Variable.
    let permissions = await verifyToken(token);

    // Hier wird nun geprüft, ob der Nutzer existiert.
    if (permissions) {
    // Alternativ könnte man hier die Berechtigungen weiter beschränken, damit z.B. nur Lehrer etwas ausführen können. Beispiel:
    //      if (permissions.Lehrer === 1) {
    //      if (permissions.Admin === 1) {
    // Klassensprecher und Teammitglieder sind logischerweise bei jedem Team anders,
    // daher muss für diese Berechtigungen überprüft werden, ob `permissions.ID` im `Mitglieder` bzw. `Klassensprecher` Array des jeweiligen Teams ist.

        if (name && name.length > 0) { // wenn der Nutzer einen Namen angegeben hat...
            response = "Team erstellt!";
            createTeam(name); // ...erstelle ein Team in der Datenbank (siehe die Definition der Funktion oben)
        } else {
            response = "Du musst einen Namen angeben!";
        }

    } else { // (hat der Nutzer nicht die nötigen Berechtigungen, wird nur eine Fehlernachricht in die Antwort geschrieben)
        response = "Du hast nicht die nötigen Berechtigungen.";
    }

    // Zum Schluss antwortet diese Funktion dem Nutzer mit der Nachricht aus der `response` Variable.
    res.json({
        message: response
    });
});
