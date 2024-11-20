const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const { sequelize } = require('../config/mysql')
const { configuracionServiciosModel } = require('../models')

const getItems = async (req, res) => {
    try {
        const idTenant = req.headers.tenant
        const data = await configuracionServiciosModel.findAllData(idTenant)

        if (!data || !data.length) {
            return res.json({ data: null });
        }

        const transformedData = data.reduce((acc, item) => {
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

        res.json({ data: transformedData });

    } catch (error) {
        console.error(`ERROR GET ITEMS SERVICIOS: ${error.message}`)
        handleHttpError(res, 'Error obtaining services data')
    }
}

module.exports = { getItems }