const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const { tenantsModel } = require('../models')

const getTenant = async (req, res) => {
    try {
        req = matchedData(req)
        const { id } = req
        const data = await tenantsModel.findOne({ where: { espacioTrabajo: id } })

        if (!data.dataValues) return res.send({ data: null })

        const filteredData = {
            id: data.id,
            idTenant: data.idTenant,
            espacioTrabajo: data.espacioTrabajo,
            estado: data.estado
        }

        res.json({ data: filteredData})

    } catch (error) {
        console.error(`ERROR GET ITEMS TENANTS: ${error.message}`)
        handleHttpError(res, "Error obtaining tenant data")
    }
} 

module.exports = { getTenant }