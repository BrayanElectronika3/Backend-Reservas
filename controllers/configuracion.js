const { handleHttpError } = require('../utils/handleError')
const { configuracionReservasModel } = require('../models')

const getItems = async (req, res) => {
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
        console.error(`ERROR GET ITEMS CONFIGURATION: ${error.message}`)
        handleHttpError(res, 'Error obtaining configuration data')
    }
}

module.exports = { getItems }