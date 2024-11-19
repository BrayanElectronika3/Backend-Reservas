const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Servicio = sequelize.define(
    'servicios',
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prefijo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prioridad: {
            type: DataTypes.NUMBER,
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

Servicio.findOneData = async function (id, idTenant) {        
    return await Servicio.findOne({ where: { id, idTenant } })
}

Servicio.findAllData = async function (idTenant) {
    return await Servicio.findAll({ where: { idTenant } })
}

Servicio.findByIdAndUpdate = async function (id, body) {
    return await Servicio.update(body, { where: { id } })
}

module.exports = Servicio