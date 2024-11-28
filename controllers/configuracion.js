const { handleHttpError } = require('../utils/handleError')
const { sedesModel, serviciosModel } = require('../models')

const getItems = async (req, res) => {
    try {
        const idTenant = req.headers.tenant

        // Validar la existencia de los datos
        const dataService = await serviciosModel.findAllData(idTenant)
        if (!dataService || !dataService.length) {
            return res.json({ data: null });
        }

        const dataHeadquarter = await sedesModel.findAllData(idTenant)
        if (!dataHeadquarter || !dataHeadquarter.length) {
            return res.json({ data: null });
        }

        // Objeto global de respuesta
        const transformedData = {}

        // Crear objeto de servicios
        transformedData.servicios = transformedData.servicios || {}
        dataService.filter(item => item.estado === 'ACTIVO').map(item => {
            const { nombre, id, estado } = item
            transformedData.servicios[nombre] = transformedData.servicios[nombre] || { id, estado }
        }, {})

        // Crear objeto de sedes
        transformedData.sedes = transformedData.sedes || {}
        dataHeadquarter.filter(item => item.estado === 'ACTIVO').map(item => {
            const { nombre, id, estado } = item
            transformedData.sedes[nombre] = transformedData.sedes[nombre] || { id, estado }
        }, {})

        res.json({ data: transformedData });

    } catch (error) {
        console.error(`ERROR GET ITEMS CONFIGURATION: ${error.message}`)
        handleHttpError(res, 'Error obtaining configuration data')
    }
}

module.exports = { getItems }