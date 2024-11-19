const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Tenant = sequelize.define(
    'tenants',
    {
        idTenant: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        espacioTrabajo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: true
    }
)

Tenant.findOneData = async function (id) {
    return await Tenant.findOne({ where: { idTenant: id } })
}

Tenant.findAllData = async function () {
    return await Tenant.findAll()
}

Tenant.findByIdAndUpdate = async function (id, body) {
    return await Tenant.update( body, { where: { id } })
}

module.exports = Tenant