// db.js
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'SEIN-user',
    password: 'epico123',
    database: 'SEIN',
    // otras opciones si necesitas
});
module.exports = pool; // o sin .promise() si no usas async/await