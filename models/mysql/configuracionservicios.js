const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Servicio = require('./servicios')
const Categoria = require('./categorias')
const Subcategoria = require('./subcategorias')
const GrupoServicio = require('./gruposervicios')

const ConfiguracionServicio = sequelize.define(
    'configuracionservicios',
    {
        idGrupoServicio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idServicio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idCategoria: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idSubCategoria: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idTenant: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: true
    }
)

ConfiguracionServicio.findOneData = async function (id, idTenant) {        
    return await ConfiguracionServicio.findAll({
        include: [
            {
                model: Servicio,
                as: 'servicio',
                attributes: ['id','nombre'],
            },
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id','nombre'],
            },
            {
                model: Subcategoria,
                as: 'subCategoria',
                attributes: ['id','nombre'],
            }
        ],
        attributes: ['id', 'idGrupoServicio', 'idServicio', 'idCategoria', 'idSubCategoria', 'estado'],
        where: {  idServicio: id, idTenant },
    })
}

ConfiguracionServicio.findAllData = async function (idTenant) {
    return await ConfiguracionServicio.findAll({
        include: [
            {
                model: Servicio,
                as: 'servicio',
                attributes: ['id','nombre'],
            },
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id','nombre'],
            },
            {
                model: Subcategoria,
                as: 'subCategoria',
                attributes: ['id','nombre'],
            }
        ],
        attributes: ['id', 'idGrupoServicio', 'estado'],
        where: { idTenant },
    })
}

// Consultar por grupo de servicios
ConfiguracionServicio.findAllDataGrupoServicio = async function (idGrupoServicio, idTenant) {
    return await ConfiguracionServicio.findAll({
        include: [
            {
                model: Servicio,
                as: 'servicio',
                attributes: ['id','nombre'],
            },
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['id','nombre'],
            },
            {
                model: Subcategoria,
                as: 'subCategoria',
                attributes: ['id','nombre'],
            }
        ],
        attributes: ['id', 'idGrupoServicio','estado'],
        where: { idGrupoServicio: idGrupoServicio, idTenant }
    })
}

ConfiguracionServicio.findAllCategorias = async function (id, idTenant) {
    return await ConfiguracionServicio.findAll({        
        where: { idServicio: id, idTenant },
        include: 'categoria',
        group: ['idCategoria'],
        attributes: ['idCategoria','idSubCategoria']         
    })
}

ConfiguracionServicio.findAllSubCategorias = async function (id,idCategoria, idTenant) {
    return await ConfiguracionServicio.findAll({        
        where: { idServicio: id, idCategoria: idCategoria, idTenant },
        include: 'subCategoria',
        // group: ['idCategoria'],
        attributes: ['idCategoria','idSubCategoria','idSubCategoria']         
    })
}

ConfiguracionServicio.findByIdAndUpdate = async function (id, body) {
    return await ConfiguracionServicio.update(body, { where: { id } })
}

ConfiguracionServicio.belongsTo(Servicio, { foreignKey: 'idServicio', as: 'servicio' })
ConfiguracionServicio.belongsTo(Categoria, { foreignKey: 'idCategoria', as: 'categoria' })
ConfiguracionServicio.belongsTo(Subcategoria, { foreignKey: 'idSubCategoria', as: 'subCategoria' })

/*
ConfiguracionServicio.hasMany(Servicio)
Servicio.belongsTo(ConfiguracionServicio)
Servicio.hasMany(Categoria)
*/

module.exports = ConfiguracionServicio