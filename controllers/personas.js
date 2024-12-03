const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const { personasModel } = require('../models')

const getPersona = async (req, res) => {
    try {        
        req = matchedData(req)
        const { prefijo, identificacion } = req
        const data = await personasModel.findOne({ where: { tipoIdentificacion: prefijo, identificacion: identificacion } })

        if (!data.dataValues) return res.send({ data: null })

        const { createdAt, updatedAt, ...filteredData } = data.dataValues
        
        res.send({ data: filteredData })

    } catch (error) {
        console.error(`ERROR GET ITEMS PERSONAS: ${error.message}`)
        handleHttpError(res, "Error obtaining person data")
    }
}

const createItem = async (req, res) => {
    try {
        const body = matchedData(req)

        const existingRecord = await personasModel.findOneDataByDocument(body.identificacion)

        if (existingRecord) {
            return handleHttpError(res, "Error the user already exists registered", 409)
        }

        const data = await personasModel.create(body)

        if (!data) return res.status(404).send({ data: null })
        
        const { createdAt, updatedAt, ...filteredData } = data.dataValues

        return res.status(201).send({ data: filteredData })

    } catch (error) {
        console.error(`ERROR CREATE ITEM PERSONAS: ${error.message}`)
        handleHttpError(res, "Error creating the person in the database", 500)
    }
}

module.exports = { getPersona, createItem }