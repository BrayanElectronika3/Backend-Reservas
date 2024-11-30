const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Reservas = sequelize.define(
    'reservas',
    {
        idPersona: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idTenant: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idServicio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idSede: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechaReserva: {
            type: DataTypes.DATE,
            allowNull: false
        },
        horaReserva: {
            type: DataTypes.TIME,
            allowNull: false
        },
        duracionReserva: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        terminosCondiciones: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        timestamps: true
    }
)

Reservas.findAllData = async function (idTenant) {
    return await Reservas.findAll({ where: { idTenant } })
}

Reservas.findOneData = async function (id, idTenant) {
    return await Reservas.findOne({ where: { id, idTenant } })
}

Reservas.findByIdAndUpdate = async function (id, body) {
    return await Reservas.update(body, { where: { id } })
}

Reservas.findOneDataByTenantPersonDate = async function (idTenant, idPersona, fechaReserva) {
    return await Reservas.findOne({ where: { idTenant, idPersona, fechaReserva } })
}

module.exports = Reservas