const mariadb = require('mariadb');
const vals = require('./consts.js');
 
const pool = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    connectionLimit: 5
});
 
async function GetUserList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE nodejs_db');
        rows = await conn.query('SELECT * FROM guestbook');
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        return rows;
    }
}

async function InsertList(title, email, content){
    let conn;
    try{
        conn = await pool.getConnection();
        await conn.query('USE nodejs_db');
        const sql = 'INSERT INTO guestbook (title, email, content) VALUES (?, ?, ?)';
        await conn.query(sql, [title, email, content]);
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
    }
}
 
module.exports = {
    getUserList: GetUserList,
    insertList: InsertList
};
