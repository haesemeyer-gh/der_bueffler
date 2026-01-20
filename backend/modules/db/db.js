import 'dotenv/config';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.BUEFFLER_DB_HOST,
    user: process.env.BUEFFLER_DB_USER,
    password: process.env.BUEFFLER_DB_PASS,
    database: process.env.BUEFFLER_DB_NAME
});

export async function query(sqlQuery, values = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sqlQuery, values);
        return res;
    } catch (err) {
        //console.error(err);
        return err;
    } finally {
        if (conn) conn.end();
    }
}
