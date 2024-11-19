const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const ConfiguracionServicio = require('./configuracionservicios')
const Servicio = require('./servicios')
const Categoria = require('./categorias')
const SubCategoria = require('./subcategorias')

const GrupoServicio = sequelize.define(
    'gruposervicios',
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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

GrupoServicio.findOneData = async function (id, idTenant) {        
    return await GrupoServicio.findOne(
        {
            attributes: ['id','nombre','descripcion','estado'],            
            include: [
                {
                    model: ConfiguracionServicio,
                    attributes: ['id'],
                    include: [
                        {
                            model: Servicio,
                            attributes: ['id','nombre','prefijo']
                        },
                        {
                            model:Categoria,
                            attributes:['id','nombre']
                        },
                        {
                            model:SubCategoria,
                            attributes:['id','nombre']
                        } 
                    ]
                }
            ],
            where: { id, idTenant },
        }           
    )   
}

GrupoServicio.findAllData = async function (idTenant) {
    return await GrupoServicio.findAll({ where: { idTenant } })
}

GrupoServicio.findByIdAndUpdate = async function (id, body) {
    return await GrupoServicio.update(body, { where: { id } })
}

GrupoServicio.hasMany(ConfiguracionServicio, { foreignKey: 'idGrupoServicio' })
ConfiguracionServicio.belongsTo(Servicio, { foreignKey: 'idServicio' })
ConfiguracionServicio.belongsTo(Categoria, { foreignKey: 'idCategoria' })
ConfiguracionServicio.belongsTo(SubCategoria, { foreignKey: 'idSubCategoria' })

module.exports = GrupoServicio