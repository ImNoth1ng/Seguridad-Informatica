exports.install = function() {
  ROUTE('POST /new-email', send_email);
}

async function send_email(){
  let self = this;
  let obj = {
    email: 'fernandopalmaq6@aragon.unam.mx',
    subject: 'Revisión de Falla en el SIAE - Actualización de Calificaciones',
    route: 'mails/siae',
    from: CONF.mail_address_from
  };
  MAIL(obj.email, obj.subject, obj.route, obj, (err, res) => {
    if (err) console.error(err);
    self.success();
  }).from(obj.from)
}
