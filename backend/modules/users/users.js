import { query } from '../db/db.js';

export function getUserMail(userid) {
    return query("SELECT Mail FROM user WHERE ID LIKE ?", [userid]);
}
