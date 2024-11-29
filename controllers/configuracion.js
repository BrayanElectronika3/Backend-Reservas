const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require("express-validator") 
const { configuracionReservasModel } = require('../models')

const { addDays, format, parseISO } = require('date-fns')

const getServicesAndHeadquearters = async (req, res) => {
    try {
        const idTenant = req.headers.tenant

        // Validar la existencia de los datos
        const dataConfigReservation = await configuracionReservasModel.findAllDataConfig(idTenant)
        if (!dataConfigReservation || !dataConfigReservation.length) {
            return res.json({ data: null })
        }

        // Filtrar solo configuraciones activas
        const activeConfigs = dataConfigReservation.filter(config => config.estado === 'ACTIVO')

        // Transformar los datos
        const transformedData = activeConfigs.reduce((acc, config) => {
            const { servicio, sede, id } = config

            // Si el servicio no existe en la estructura, inicialízalo
            if (!acc[servicio.nombre]) {
                acc[servicio.nombre] = {
                    idServicio: servicio.id,
                    sedes: {}
                }
            }

            // Si la sede no existe bajo el servicio, inicialízala
            if (!acc[servicio.nombre].sedes[sede.nombre]) {
                acc[servicio.nombre].sedes[sede.nombre] = {
                    idSede: sede.id,
                    idConfiguracionReservas: id
                }
            }

            return acc
        }, {})

        // Envolver en el objeto esperado por el frontend
        res.json({ data: { servicios: transformedData } })

    } catch (error) {
        console.error(`ERROR GET SERVICES AND HEADQUARTERS: ${error.message}`)
        handleHttpError(res, 'Error obtaining services and headquearters data')
    }
}

const generateEnabledDates = (data) => {
    // Mapear los dias de la semana con sus claves en el objeto que se obtiene de la base de datos
    const daysWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]

    // Obtener la fecha actual
    const currentDate = new Date()

    // Arreglo para almacenar las fechas habilitadas
    const datesEnabled = []

    // Iterar los proximos 7 días
    for (let i = 0; i < 7; i++) {
        const newcurrentDate = addDays(currentDate, i) // Sumar días a la fecha actual
        const dayWeek = daysWeek[newcurrentDate.getDay()] // Obtener el día de la semana

        // Verificar si el día está habilitado
        if (data[dayWeek]) {
            datesEnabled.push({
                fecha: format(newcurrentDate, "yyyy-MM-dd"), // Formato de fecha ISO
                horaInicial: data.horaInicial,
                horaFinal: data.horaFinal,
            })
        }
    }

    return datesEnabled
}

const getServiceHours = async (req, res) => {
    try {
        // Validaciones iniciales
        const idTenant = req.headers.tenant
        const { id } = matchedData(req)

        if (!id) {
            return handleHttpError(res, 'The id is not found', 400)
        }

        const dataRecord = await configuracionReservasModel.findOneData(id, idTenant)
        if (!dataRecord) { 
            return handleHttpError(res, 'Record not found', 404)
        }

        const dates = generateEnabledDates(dataRecord)
        
        res.json({ data: dates })

    } catch (error) {
        console.error(`ERROR GET SERVICE HOURS: ${error.message}`)
        handleHttpError(res, 'Error obtaining service hours data')
    }
}

module.exports = { getServicesAndHeadquearters, getServiceHours }