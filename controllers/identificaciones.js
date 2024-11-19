const { handleHttpError } = require('../utils/handleError')
const { identificacionesModel } = require('../models')

const getItems = async (req, res) => {
    try {
        const data = await identificacionesModel.findAllData()

        if (!data[0].dataValues) return res.send({ data: null })

        const filteredData = data.filter(item => item.estado === 'ACTIVO').map(item => ({
            id: item.id,
            codigo: item.codigo,
            nombre: item.nombre,
            estado: item.estado
        }))

        res.json({ data: filteredData })

    } catch (error) {
        console.error(`ERROR GET ITEMS IDENTIFICACIONES: ${error.message}`)
        handleHttpError(res, 'Error obtaining identification data')
    }
}

module.exports = { getItems }