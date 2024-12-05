const sendEmail = require('../utils/handleMailer')
const ejs = require('ejs')
const path = require('path')

const emailTest = async () => {
  await sendEmail(
    'desarrollo.it3@electronika.info',
    'Reserva de Turno',
    'Este es un correo en texto plano',
    '<h1>Este es un correo en HTML</h1>'
  )
}

const emailConfirmReservation = async (data) => {
  ejs.renderFile(path.join(__dirname, 'confirmReserva.ejs'), data, async (err, html) => {
    if (err) {
      console.log(err)
      return res.send('Error al renderizar el HTML')
    }

    // Enviar el correo
    await sendEmail(
      data.to,
      data.subject,
      data.text,
      html
    )
  })
}

module.exports = { emailTest, emailConfirmReservation }