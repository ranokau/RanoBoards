const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendWhatsAppMessage = (to, body) => {
  client.messages
    .create({
      body,
      from: 'whatsapp:+14155238886', // Tu número de WhatsApp en Twilio
      to: `whatsapp:${to}`,
    })
    .then(message => console.log('Mensaje enviado:', message.sid))
    .catch(error => console.log('Error al enviar el mensaje:', error));
};

module.exports = { sendWhatsAppMessage };
