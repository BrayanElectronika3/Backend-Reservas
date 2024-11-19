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

module.exports = { getPersona }