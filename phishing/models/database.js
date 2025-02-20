// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'SEIN-user',
    password: 'epico123',
    database: 'SEIN',
    port: 3306
});

module.exports = pool;