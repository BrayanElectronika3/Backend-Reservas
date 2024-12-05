const { matchedData } = require("express-validator") 
const { handleHttpError } = require('../utils/handleError')
const { reservasModel, personasModel } = require('../models')
const { parseTime, convertToBogotaDate, formatTo12Hour, formatDateString } = require('../utils/handleDate')
const { emailConfirmReservation } = require('../mails/reservas')

// Consultar la persona por ID
const getPersonData = async (personId) => {
    try {
        const dataPerson = await personasModel.findOneData(personId)
        if (!dataPerson) throw new Error('Persona no encontrada')
        return dataPerson.dataValues

    } catch (error) {
        console.error('Error al obtener datos de la persona:', error.message)
        throw error
    }
}

// Consultar la reserva por ID y IDTenant
const getReservationData = async (reservationId, tenantId) => {
    try {
        const dataReservation = await reservasModel.findOneData(reservationId, tenantId)
        if (!dataReservation) throw new Error('Reserva no encontrada')
        return dataReservation.dataValues

    } catch (error) {
        console.error('Error al obtener datos de la reserva:', error.message)
        throw error
    }
}

// Construir el objeto necesario para el envio de correos de confirmacion de reservas
const buildMailData = (personData, reservationData) => {
    return {
        to: personData.email,
        subject: 'Reserva de Turno',
        text: 'Confirmación reserva de turno',
        name: `${personData?.primerNombre} ${personData?.primerApellido}`,
        service: reservationData?.servicio?.nombre ?? 'Servicio no disponible',
        headquearters: reservationData?.sede?.nombre ?? 'Sede no disponible',
        dateReservation: formatDateString(reservationData?.fechaReserva),
        timeReservation: formatTo12Hour(reservationData?.horaReserva),
    }
}

// Validar el tipo de dato de la fecha
const isValidDate = (date) => {
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    return parsedDate instanceof Date && !isNaN(parsedDate)
}

// Funcion para validar si es tiempo
const isValidTime = (time) => /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(time)

// Funcion para validar los tipos de datos
const validateDataTypes = (data, rules) => {
    const errors = Object.entries(data)
        .map(([key, value]) => {
            const rule = rules[key]
            return rule && !rule.validate(value) ? rule.errorMessage : null
        })
        .filter(Boolean)
    return errors.length > 0 ? `Validation errors: ${errors.join(', ')}` : null
}

// Controlador para obtener múltiples elementos
const getItems = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers

        const data = await reservasModel.findAllData(idTenant)
        if (!data) { 
            return handleHttpError(res, 'Records not found', 404)
        }

        res.send({ data })

    } catch (error) {
        console.error(`ERROR GET SERVICE RESERVATIONS: ${error.message}`)
        handleHttpError(res, 'Error obtaining reservations data')
    }
}

// Controlador para obtener un único elemento
const getItem = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers
        const { id } = matchedData(req)

        if (!id) {
            return handleHttpError(res, 'The id is not found', 400)
        }

        const dataRecord = await reservasModel.findOneData(id, idTenant)
        if (!dataRecord) { 
            return handleHttpError(res, 'Record not found', 404)
        }

        const { idTenant: _, createdAt, updatedAt, ...data } = dataRecord.dataValues
        res.send({ data })

    } catch (error) {
        console.error(`ERROR GET ITEM RESERVATIONS: ${error.message}`)
        handleHttpError(res, 'Error retrieving item reservations')
    }
}

// Controlador para crear un elemento
const createItem = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers

        if (!req.body || Object.keys(req.body).length === 0) { 
            return handleHttpError(res, "The request body is empty", 400)
        }

        const { data: dataReq } = req.body
        if (!dataReq) {
            return handleHttpError(res, "Request body must include 'data' key", 400)
        }

        // Validación de campos requeridos
        const requiredFields = [ "idPersona", "idServicio", "idSede", "fechaReserva", "horaReserva",  "duracionReserva", "estado" ]

        const missingFields = requiredFields.filter((field) => dataReq[field] === null || dataReq[field] === undefined)
        if (missingFields.length > 0) {
            return handleHttpError(res, `Missing required fields: ${missingFields.join(", ")}`, 400)
        }

        // Transformar time a un valor valido
        dataReq.horaReserva =  parseTime(dataReq.horaReserva)

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            idPersona: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idPersona must be a positive number' },
            idServicio: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idServicio must be a positive number' },
            idSede: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idSede must be a positive number' },
            fechaReserva: { validate: isValidDate, errorMessage: 'fechaReserva must be a valid date' },
            horaReserva: { validate: isValidTime, errorMessage: 'horaReserva must be a valid time (HH:mm:ss)' },
            duracionReserva: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'duracionReserva must be a positive number' },
            estado: { validate: (val) => typeof val === 'string' && val !== '', errorMessage: 'estado must be a string' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }
        
        // Consultar si ya existe una reserva
        const existingReservation = await reservasModel.findOneDataByTenantPersonDate(idTenant, dataReq.idPersona, dataReq.fechaReserva, 'ACTIVO')
        if (existingReservation) {
            return handleHttpError(res, 'There is already a reservation for the same person on the same date', 400)
        }

        // Transformar date a un valor valido
        dataReq.fechaReserva = convertToBogotaDate(dataReq.fechaReserva)

        // Guardar el registro y retornar los datos
        const dataRecord = await reservasModel.create({ ...dataReq, idTenant })
        const { idTenant: tenant, createdAt, updatedAt, ...data } = dataRecord.dataValues

        // Enviar la confirmacion de la reserva por correo
        if (data?.idPersona && data?.id && idTenant) {
            const [personData, reservationData] = await Promise.all([
                getPersonData(data.idPersona),
                getReservationData(data.id, idTenant),
            ])

            const mailData = buildMailData(personData, reservationData)
            await emailConfirmReservation(mailData)
        }

        res.status(201).json({ data })

    } catch (error) {
        console.error(`ERROR CREATE ITEM RESERVATION: ${error.message}`)
        handleHttpError(res,"Error creating reservation")
    }
}

// Controlador para actualizar un elemento
const updateItem = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers

        if (!req.body || Object.keys(req.body).length === 0) { 
            return handleHttpError(res, "The request body is empty", 400)
        }

        const { id } = req.params
        if (!id) {
            return handleHttpError(res, 'The id is not found', 400)
        }
        
        const { data: dataReq } = req.body
        if (!dataReq) {
            return handleHttpError(res, "Request body must include 'data' key", 400)
        }

        const dataRecord = await reservasModel.findOneData(id, idTenant)
        if (!dataRecord) {
            return handleHttpError(res, 'Record not found in reservation', 404)
        }

        // Transformar time a un valor valido
        dataReq.horaReserva =  parseTime(dataReq.horaReserva)

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            fechaReserva: { validate: isValidDate, errorMessage: 'fechaReserva must be a valid date' },
            horaReserva: { validate: isValidTime, errorMessage: 'horaReserva must be a valid time (HH:mm:ss)' },
            estado: { validate: (val) => typeof val === 'string' && val !== '', errorMessage: 'estado must be a string' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }

        // Transformar date a un valor valido
        dataReq.fechaReserva = convertToBogotaDate(dataReq.fechaReserva)

        // Actualizar el registro
        await reservasModel.findByIdAndUpdate(id, dataReq)

        // Consultar el registro actualizado de la reserva
        const updatedRecord = await reservasModel.findOneData(id, idTenant)
        const { idTenant: tenant, createdAt, updatedAt, ...data } = updatedRecord.dataValues

        // Enviar la confirmacion de la actualizacion de la reserva por correo
        if (data?.idPersona && data?.id && idTenant) {
            const [personData, reservationData] = await Promise.all([
                getPersonData(data.idPersona),
                getReservationData(data.id, idTenant),
            ])

            const mailData = buildMailData(personData, reservationData)
            await emailConfirmReservation(mailData)
        }

        res.status(200).json({ data })

    } catch (error) {
        console.error(`ERROR UPDATE ITEM RESERVATION: ${error.message}`)
        handleHttpError(res, 'Error updating reservation')
    }
}

// Controlador para obtener las reservas por persona y tenant
const getItemsPerson = async (req, res) => {
    try {        
        const { tenant: idTenant } = req.headers
        const { idPerson } = matchedData(req)

        if (!idPerson) {
            return handleHttpError(res, 'The idPerson is not found', 400)
        }

        const data = await reservasModel.findAllDataByTenantPerson(idTenant, idPerson, 'ACTIVO')

        if (!data) { 
            return handleHttpError(res, 'Records by person not found', 404)
        }

        const transformedData = data.map((item) => item.get({ plain: true }))
        const transformData = transformedData.map((item) => ({
            ...item,
            horaReserva: formatTo12Hour(item.horaReserva),
        }))

        res.send({ data: transformData })

    } catch (error) {
        console.error(`ERROR GET ITEM RESERVATIONS BY PERSON: ${error.message}`)
        handleHttpError(res, 'Error retrieving item reservations by person')
    }
}

module.exports = { getItems, getItem, createItem, updateItem, getItemsPerson }