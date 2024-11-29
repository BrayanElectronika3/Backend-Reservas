const { handleHttpError } = require('../utils/handleError')
const { matchedData } = require("express-validator") 
const { serviciosModel, sedesModel, configuracionReservasModel } = require('../models')

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

// Funcion para construir la respuesta
const buildResponseData = (services, headquarters) => {
    const transformedData = {
        servicios: services.reduce((acc, { nombre = 'Sin servicio', id }) => {
            acc[nombre] = { id }
            return acc
        }, {}),
        sedes: headquarters
            .filter(({ estado }) => estado === 'ACTIVO')
            .reduce((acc, { nombre, id, idEmpresa, estado }) => {
                acc[nombre] = { id, idEmpresa, estado }
                return acc
            }, {})
    }
    return transformedData
}

// Controlador para obtener múltiples elementos
const getItems = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers

        const data = await configuracionReservasModel.findAllData(idTenant)
        if (!data) { 
            return handleHttpError(res, 'Records not found', 404)
        }

        res.send({ data })

    } catch (error) {
        console.error(`ERROR GET ITEMS CONFIGURATION RESERVATIONS: ${error.message}`)
        handleHttpError(res, 'Error obtaining configuration reservations data')
    }
}

// Controlador para obtener un único elemento
const getItem = async (req, res) => {
    try {
        // Validaciones iniciales
        const { tenant: idTenant } = req.headers
        const { id } = matchedData(req)

        if (!id) {
            return handleHttpError(res, 'The id is not found', 400)
        }

        const dataRecord = await configuracionReservasModel.findOneData(id, idTenant)
        if (!dataRecord) { 
            return handleHttpError(res, 'Record not found', 404)
        }

        const { idTenant: _, createdAt, updatedAt, ...data } = dataRecord.dataValues
        res.send({ data })

    } catch (error) {
        console.error(`ERROR GET ITEM CONFIGURATION RESERVATIONS: ${error.message}`)
        handleHttpError(res, 'Error retrieving item')
    }
}

// Controlador para crear un elemento
const createItem = async (req, res) => {
    try {
        // Validaciones iniciales
        const { tenant: idTenant } = req.headers

        if (!req.body || Object.keys(req.body).length === 0) { 
            return handleHttpError(res, "The request body is empty", 400)
        }

        const { data: dataReq } = req.body
        if (!dataReq) {
            return handleHttpError(res, "Request body must include 'data' key", 400)
        }

        // Validación de campos requeridos
        const requiredFields = [ 
            "idServicio", "idSede", "slots", 
            "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo", 
            "horaInicial", "horaFinal", "duracionReserva", "estado"
        ]

        const missingFields = requiredFields.filter((field) => dataReq[field] === null || dataReq[field] === undefined)
        if (missingFields.length > 0) {
            return handleHttpError(res, `Missing required fields: ${missingFields.join(", ")}`, 400)
        }

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            idServicio: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idServicio must be a positive number' },
            idSede: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idSede must be a positive number' },
            slots: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'slots must be a positive number' },
            lunes: { validate: (val) => typeof val === 'boolean', errorMessage: 'lunes must be boolean' },
            martes: { validate: (val) => typeof val === 'boolean', errorMessage: 'martes must be boolean' },
            miercoles: { validate: (val) => typeof val === 'boolean', errorMessage: 'miercoles must be boolean' },
            jueves: { validate: (val) => typeof val === 'boolean', errorMessage: 'jueves must be boolean' },
            viernes: { validate: (val) => typeof val === 'boolean', errorMessage: 'viernes must be boolean' },
            sabado: { validate: (val) => typeof val === 'boolean', errorMessage: 'sabado must be boolean' },
            domingo: { validate: (val) => typeof val === 'boolean', errorMessage: 'domingo must be boolean' },
            horaInicial: { validate: isValidTime, errorMessage: 'horaInicial must be a valid time (HH:mm:ss)' },
            horaFinal: { validate: isValidTime, errorMessage: 'horaFinal must be a valid time (HH:mm:ss)' },
            duracionReserva: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'duracionReserva must be a positive number' },
            estado: { validate: (val) => ['ACTIVO', 'INACTIVO'].includes(val), errorMessage: 'estado must be either ACTIVO or INACTIVO' },
            descripcion: { validate: (val) => typeof val === 'string', errorMessage: 'descripcion must be string' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }

        const existingConfig = await configuracionReservasModel.findAllDataByTenantServiceHeadquarters(idTenant, dataReq.idServicio, dataReq.idSede)
        if (existingConfig.length > 0) {
            return handleHttpError(res, 'Configuration with same service and headquarters already exists', 400)
        }

        const dataRecord = await configuracionReservasModel.create({ ...dataReq, idTenant })
        const { idTenant: tenant, createdAt, updatedAt, ...data } = dataRecord.dataValues
        res.status(201).json({ data })

    } catch (error) {
        console.error(`ERROR CREATE ITEM CONFIGURATION RESERVATIONS: ${error.message}`)
        handleHttpError(res,"Error creating configuration reservation")
    }
}

// Controlador para actualizar un elemento
const updateItem = async (req, res) => {
    try {
        // Validaciones iniciales
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

        const dataRecord = await configuracionReservasModel.findOneData(id, idTenant)
        if (!dataRecord) {
            return handleHttpError(res, 'Record not found in configuration reservation', 404)
        }

        // Validacion de tipos de datos
        const validationError = validateDataTypes(dataReq, {
            idServicio: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idServicio must be a positive number' },
            idSede: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'idSede must be a positive number' },
            slots: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'slots must be a positive number' },
            lunes: { validate: (val) => typeof val === 'boolean', errorMessage: 'lunes must be boolean' },
            martes: { validate: (val) => typeof val === 'boolean', errorMessage: 'martes must be boolean' },
            miercoles: { validate: (val) => typeof val === 'boolean', errorMessage: 'miercoles must be boolean' },
            jueves: { validate: (val) => typeof val === 'boolean', errorMessage: 'jueves must be boolean' },
            viernes: { validate: (val) => typeof val === 'boolean', errorMessage: 'viernes must be boolean' },
            sabado: { validate: (val) => typeof val === 'boolean', errorMessage: 'sabado must be boolean' },
            domingo: { validate: (val) => typeof val === 'boolean', errorMessage: 'domingo must be boolean' },
            horaInicial: { validate: isValidTime, errorMessage: 'horaInicial must be a valid time (HH:mm:ss)' },
            horaFinal: { validate: isValidTime, errorMessage: 'horaFinal must be a valid time (HH:mm:ss)' },
            duracionReserva: { validate: (val) => typeof val === 'number' && val > 0, errorMessage: 'duracionReserva must be a positive number' },
            estado: { validate: (val) => ['ACTIVO', 'INACTIVO'].includes(val), errorMessage: 'estado must be either ACTIVO or INACTIVO' },
            descripcion: { validate: (val) => typeof val === 'string', errorMessage: 'descripcion must be string' },
        })

        if (validationError) {
            return handleHttpError(res, validationError, 400)
        }

        await configuracionReservasModel.findByIdAndUpdate(id, dataReq)

        const updatedRecord = await configuracionReservasModel.findOneData(id, idTenant)
        const { idTenant: tenant, createdAt, updatedAt, ...data } = updatedRecord.dataValues
        res.status(200).json({ data })

    } catch (error) {
        console.error(`ERROR UPDATE ITEM CONFIGURAITON RESERVATION: ${error.message}`)
        handleHttpError(res, 'Error updating configuration reservation')
    }
}

// Controlador para obtener múltiples elementos
const getItemsConfig = async (req, res) => {
    try {
        const { tenant: idTenant } = req.headers

        const [services, headquarters] = await Promise.all([
            serviciosModel.findAllData(idTenant),
            sedesModel.findAllData(idTenant)
        ])

        if (!services?.length || !headquarters?.length) {
            return res.json({ data: null })
        }

        const data = buildResponseData(services, headquarters)
        res.json({ data })

    } catch (error) {
        console.error(`ERROR GET ITEMS CONFIG CONFIGURATION RESERVATIONS: ${error.message}`)
        handleHttpError(res, 'Error obtaining config configuration reservations data')
    }
}

module.exports = { getItems, getItem, createItem, updateItem, getItemsConfig }