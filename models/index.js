const pathModels = './mysql'

const models = {
    identificacionesModel: require(`${pathModels}/identificaciones`),
    tenantsModel: require(`${pathModels}/tenants`),
    personasModel: require(`${pathModels}/personas`),
    serviciosModel: require(`${pathModels}/servicios`),
    categoriasModel: require(`${pathModels}/categorias`),
    subcategoriasModel: require(`${pathModels}/subcategorias`),
    sedesModel: require(`${pathModels}/sedes`),
    areaatencionesModel: require(`${pathModels}/areaatenciones`),
    grupoServiciosModel: require(`${pathModels}/gruposervicios`),
    configuracionServiciosModel: require(`${pathModels}/configuracionservicios`),
    usersModel: require(`${pathModels}/users`),
    storageModel: require(`${pathModels}/storage`),
    rolesModel:require(`${pathModels}/roles`),
    configuracionReservasModel:require(`${pathModels}/configuracionreservas`),
    reservasModel:require(`${pathModels}/reservas`),
}

module.exports = models