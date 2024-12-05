const express = require('express')
const router = express.Router()
const { emailTest, emailConfirmReservation } = require('../mails/reservas')

const { personasModel, reservasModel } = require('../models')
const { formatDateString, formatTo12Hour } = require('../utils/handleDate')

router.get('/', async (req, res) => { 
    res.json({ data: 'Test succesfully'} )
})
router.get('/mail', async (req, res) => { 
    // Email test
    emailTest()

    // Para correos con registros de base de datos con confirmacion de reserva
    /*
    const dataPerson = await personasModel.findOneData(1)
    const { email, primerNombre, primerApellido } = dataPerson.dataValues
    const dataReservation = await reservasModel.findOneData(10, '290f3e25-6033-471c-b023-f47e7cf4bce6')
    const { fechaReserva, horaReserva } = dataReservation.dataValues
    const mailData = {
        to: 'desarrollo.it3@electronika.info',
        subject: 'Reserva de Turno',
        text: 'Confirmación reserva de turno',
        name: `${primerNombre} ${primerApellido}`,
        service: dataReservation.servicio.nombre,
        headquearters: dataReservation.sede.nombre,
        dateReservation: formatDateString(fechaReserva),
        timeReservation: formatTo12Hour(horaReserva),
    }
    await emailConfirmReservation(mailData)
    */

    res.json({ data: 'Test mail succesfully'})
})

module.exports = router