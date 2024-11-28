const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const ConfiguracionReservas = sequelize.define(
    'configuracionreservas',
    {
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
        slots: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lunes: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        martes: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        miercoles: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        jueves: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        viernes: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        sabado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        domingo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        horaInicial:{
            type: DataTypes.TIME,
            allowNull:false
        },
        horaFinal: {
            type: DataTypes.TIME,
            allowNull:false
        },
        duracionReserva: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
)

ConfiguracionReservas.findOneData = async function (id, idTenant) {        
    return await ConfiguracionReservas.findOne({ where: { id, idTenant } })
}

ConfiguracionReservas.findAllData = async function (idTenant) {
    return await ConfiguracionReservas.findAll({ where: { idTenant } })
}

ConfiguracionReservas.findByIdAndUpdate = async function (id, body) {
    return await ConfiguracionReservas.update(body, { where: { id } })
}

ConfiguracionReservas.findAllDataByTenantServiceHeadquarters = async function (idTenant, idServicio, idSede) {
    return await ConfiguracionReservas.findAll({ where: { idTenant, idServicio, idSede } })
}

module.exports = ConfiguracionReservas