const { matchedData } = require("express-validator") 
const { handleHttpError } = require('../utils/handleError')
const { reservasModel } = require('../models')

const { getCurrentDateColombiaV2 } = require('../utils/handleDate')

// Controlador para obtener la reserva de una persona en la fecha actual al llegar al Kiosco
const getItem = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers
        const { idPerson } = matchedData(req)
        const currentDate = getCurrentDateColombiaV2()
        const status = 'ACTIVO'

        if (!idPerson) {
            return handleHttpError(res, 'The id is not found', 400)
        }

        const dataRecord = await reservasModel.findOneDataByTenantPersonDate(idTenant, idPerson, currentDate, status)
        if (!dataRecord) { 
            return handleHttpError(res, 'Record not found', 404)
        }

        const object = {
            id: dataRecord?.id,
            idServicio: dataRecord?.idServicio,
            nombreServicio: dataRecord?.servicio?.nombre,
            idSede: dataRecord?.idSede,
            nombreSede: dataRecord?.sede?.nombre,
            fechaReserva: dataRecord?.fechaReserva,
            horaReserva: dataRecord?.horaReserva,
            duracionReserva: dataRecord?.duracionReserva,
            estado: dataRecord?.estado,
        }

        res.send({ data: object })

    } catch (error) {
        console.error(`ERROR GET ITEM RESERVATIONS ON THE CURRENT DATE: ${error.message}`)
        handleHttpError(res, 'Error get item reservations on the current date')
    }
}

module.exports = { getItem }