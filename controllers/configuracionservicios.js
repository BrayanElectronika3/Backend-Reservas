const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const { sequelize } = require('../config/mysql')
const { configuracionServiciosModel, sedesModel } = require('../models')

const getItems = async (req, res) => {
    try {
        const idTenant = req.headers.tenant
        const dataConfig = await configuracionServiciosModel.findAllData(idTenant)
        const dataHeadquarter = await sedesModel.findAllData(idTenant)

        // Validar la existencia de los datos
        if (!dataConfig || !dataConfig.length) {
            return res.json({ data: null });
        }

        if (!dataHeadquarter || !dataHeadquarter.length) {
            return res.json({ data: null });
        }

        // Crear objeto de servicio, categoria y subcategoria
        const transformedData = dataConfig.reduce((acc, item) => {
            const {
                servicio: { nombre: serviceName = 'Sin servicio', id: serviceId = null } = {},
                categoria: { nombre: categoryName = 'Sin Categoria', id: categoryId = null } = {},
                subCategoria: { nombre: subCategoryName = 'Sin Subcategoria', id: subCategoryId = null } = {}
            } = item

            acc.servicios = acc.servicios || {}
            // Aseguramos que el servicio exista dentro del objeto servicios
            acc.servicios[serviceName] = acc.servicios[serviceName] || { id: serviceId, categorias: {} }
            // Aseguramos que la categoria exista dentro del objeto categorias
            acc.servicios[serviceName].categorias[categoryName] = acc.servicios[serviceName].categorias[categoryName] || { id: categoryId, subCategorias: {} }
            // Aseguramos que la subcategoría exista dentro del objeto subcategorias
            acc.servicios[serviceName].categorias[categoryName].subCategorias[subCategoryName] = acc.servicios[serviceName].categorias[categoryName].subCategorias[subCategoryName] || { id: subCategoryId }

            return acc
        }, {})

        // Crear objeto de sedes
        transformedData.sedes = transformedData.sedes || {}
        dataHeadquarter.filter(item => item.estado === 'ACTIVO').map(item => {
            const { nombre, id, idEmpresa, estado } = item
            transformedData.sedes[nombre] = transformedData.sedes[nombre] || { id, idEmpresa, estado }
        }, {})

        res.json({ data: transformedData });

    } catch (error) {
        console.error(`ERROR GET ITEMS SERVICIOS: ${error.message}`)
        handleHttpError(res, 'Error obtaining configuration service data')
    }
}

module.exports = { getItems }