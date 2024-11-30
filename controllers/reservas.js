const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require("express-validator") 
const { reservasModel } = require('../models')

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
        const requiredFields = [ "idPersona", "idServicio", "idSede", "fechaReserva", "horaReserva",  "duracionReserva" ]

        const missingFields = requiredFields.filter((field) => dataReq[field] === null || dataReq[field] === undefined)
        if (missingFields.length > 0) {
            return handleHttpError(res, `Missing required fields: ${missingFields.join(", ")}`, 400)
        }

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            idPersona: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idPersona must be a positive number' },
            idServicio: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idServicio must be a positive number' },
            idSede: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idSede must be a positive number' },
            fechaReserva: { validate: isValidDate, errorMessage: 'fechaReserva must be a valid date' },
            horaReserva: { validate: isValidTime, errorMessage: 'horaReserva must be a valid time (HH:mm:ss)' },
            duracionReserva: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'duracionReserva must be a positive number' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }

        const existingReservation = await reservasModel.findOneDataByTenantPersonDate(idTenant, dataReq.idPersona, dataReq.fechaReserva)
        if (existingReservation) {
            return handleHttpError(res, 'There is already a reservation for the same person on the same date', 400)
        }

        const dataRecord = await reservasModel.create({ ...dataReq, idTenant })
        const { idTenant: tenant, createdAt, updatedAt, ...data } = dataRecord.dataValues
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

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            fechaReserva: { validate: isValidDate, errorMessage: 'fechaReserva must be a valid date' },
            horaReserva: { validate: isValidTime, errorMessage: 'horaReserva must be a valid time (HH:mm:ss)' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }

        await reservasModel.findByIdAndUpdate(id, dataReq)

        const updatedRecord = await reservasModel.findOneData(id, idTenant)
        const { idTenant: tenant, createdAt, updatedAt, ...data } = updatedRecord.dataValues
        res.status(200).json({ data })

    } catch (error) {
        console.error(`ERROR UPDATE ITEM RESERVATION: ${error.message}`)
        handleHttpError(res, 'Error updating reservation')
    }
}

module.exports = { getItems, getItem, createItem, updateItem }