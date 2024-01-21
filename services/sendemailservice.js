const mailgun = require('mailgun-js');

const mg = mailgun({ apiKey: '5059ed337fbdeb1eabed3f6127500483-4c955d28-37c1ea3a', domain: 'sandbox2851c33d9a034a50b6b5a2750b3bd49d.mailgun.org' });

const sendEmail = async function(name, email){

  const data = {
    from: 'USERS NOCTUA SAPIENTIA <users@noctuasapientia.com>',
    to: email,
    subject: 'Gracias por registrarte en Noctua Sapientia',
    text: 'Hola! ' + name + ' ¡Enhorabuena por completar tu registro con nosotros! Disfuta de tu experiencia en Noctua Sapientia',
  };

  try {
    const result = await mg.messages().send(data);
    console.log('Correo enviado con éxito:', result);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = {
    "sendEmail" : sendEmail
}