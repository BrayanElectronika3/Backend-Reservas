const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require("express-validator") 
const { configuracionReservasModel, reservasModel } = require('../models')
const { generateEnabledDates, generateSchedule } = require('../utils/handleDate')
const { removeOccupiedSlots } = require('../utils/handleSchedule')

// Contralador para obtener los servicios y las sedes
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

// Controlador para obtener los dias y horas de servicio de reservas
const getDaysHoursService = async (req, res) => {
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

        const datesEnabled = generateEnabledDates(dataRecord)
        const schedule = generateSchedule(datesEnabled, dataRecord.horaInicial, dataRecord.horaFinal, dataRecord.duracionReserva)
        const datesBusy = await reservasModel.findAllDataByTenantDates(idTenant, Object.keys(schedule), 'ACTIVO')
        
        // Actualizar `schedule` eliminando horas ocupadas
        const updatedSchedule = removeOccupiedSlots(schedule, datesBusy, dataRecord.slots)

        res.json({ data: { fechas: updatedSchedule, duracionReserva: dataRecord.duracionReserva } })

    } catch (error) {
        console.error(`ERROR GET SERVICE HOURS: ${error.message}`)
        handleHttpError(res, 'Error obtaining service hours data')
    }
}

module.exports = { getServicesAndHeadquearters, getDaysHoursService }