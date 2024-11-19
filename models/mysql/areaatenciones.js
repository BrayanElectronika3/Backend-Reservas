const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const AreaAtencion = sequelize.define(
    'areaatenciones',
    {
        idSede: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        llamadoNombre: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        etiqueta: {
            type: DataTypes.BOOLEAN,
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

AreaAtencion.findOneData = async function (id,idTenant) {        
    return await AreaAtencion.findOne({ where: { id, idTenant } })
}

AreaAtencion.findAllData = async function (id, idTenant) {
    return await AreaAtencion.findAll({
        where: { idSede:id, idTenant }
    })
}

AreaAtencion.findByIdAndUpdate = async function (id, body) {
    return await AreaAtencion.update(body, { where: { id } })
}

module.exports = AreaAtencion