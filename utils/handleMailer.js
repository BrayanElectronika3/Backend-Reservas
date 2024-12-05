const nodemailer = require('nodemailer')

// Configura el transportador
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,                    // Cambia por el host SMTP que vayas a usar
    port: process.env.MAIL_PORT,                    // Puerto SMTP (por lo general, 587 para TLS)
    secure: true,                                   // Cambia a true si usas el puerto 465 (SSL)
    auth: {
        user: process.env.MAIL_USER,                // Tu correo
        pass: process.env.MAIL_PASS,                // Tu contraseña
    },
})

// Funcion para enviar un correo
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_ALIAS}" <${process.env.MAIL_USER}>`,   // Remitente
            to,                                     // Destinatario
            subject,                                // Asunto
            text,                                   // Texto sin formato
            html,                                   // Texto en formato HTML
        })

        console.log('Correo enviado: %s', info.messageId)
        
    } catch (error) {
        console.error('Error enviando correo:', error)
    }
}

module.exports = sendEmail