const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleError')
const { sequelize } = require('../config/mysql')
const { configuracionServiciosModel } = require('../models')

const getItems = async (req, res) => {
    try {
        const idTenant = req.headers.tenant
        const data = await configuracionServiciosModel.findAllData(idTenant)

        if (!data?.dataValues && !data[0]?.dataValues) return res.send({ data: null })

        // Transformar los datos en la estructura deseada
        const transformedData = {}
        data.forEach(item => {
            // Obtener variables de la consulta
            const serviceName = item.servicio ? item.servicio.nombre : 'Sin servicio'
            const serviceId = item.servicio ? item.servicio.id : null

            const categoryName = item.categoria ? item.categoria.nombre : 'Sin Categoria'
            const categoryId = item.categoria ? item.categoria.id : null

            const subCategoryName = item.subCategoria ? item.subCategoria.nombre : 'Sin subcategoria'
            const subCategoryId = item.subCategoria ? item.subCategoria.id : null

            // Se crea el objeto de servicio
            if (!transformedData.servicios) {
                transformedData.servicios = {}
            }

            // Aseguramos que el servicio exista dentro del servicio
            if (!transformedData.servicios[serviceName]) {
                transformedData.servicios[serviceName] = { 
                    id: serviceId,
                    categorias: {}
                }
            }

            // Aseguramos que la categoria exista dentro del servicio
            if (!transformedData.servicios[serviceName].categorias[categoryName]) {
                transformedData.servicios[serviceName].categorias[categoryName] = {
                    id: categoryId, 
                    subCategorias: [] 
                }
            }

            // Agregamos la subcategoría si existe
            if (subCategoryId) {
                transformedData.servicios[serviceName].categorias[categoryName].subCategorias.push({
                    id: subCategoryId,
                    nombre: subCategoryName
                })
            }
        })

        res.json({ data: transformedData })

    } catch (error) {
        console.error(`ERROR GET ITEMS SERVICIOS: ${error.message}`)
        handleHttpError(res, 'Error obtaining services data')
    }
}

module.exports = { getItems }