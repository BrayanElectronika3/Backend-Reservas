const { DataTypes, Op } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Servicio = require('./servicios')
const Sede = require('./sedes')

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

Reservas.findAllData = async function (idTenant) {
    return await Reservas.findAll({ where: { idTenant } })
}

Reservas.findOneData = async function (id, idTenant) {
    return await Reservas.findOne({ where: { id, idTenant } })
}

Reservas.findByIdAndUpdate = async function (id, body) {
    return await Reservas.update(body, { where: { id } })
}

Reservas.findOneDataByTenantPersonDate = async function (idTenant, idPersona, fechaReserva, estado) {
    return await Reservas.findOne({ where: { idTenant, idPersona, estado, fechaReserva } })
}

Reservas.findAllDataByTenantDates = async function (idTenant, fechasReserva, estado) {
    if (!Array.isArray(fechasReserva) || fechasReserva.length === 0) {
        throw new Error("La lista de fechas de reserva debe ser un array no vacio.");
    }

    return await Reservas.findAll({ where: { idTenant, estado, fechaReserva: { [Op.in]: fechasReserva } } })
}

Reservas.findAllDataByperson = async function (idTenant, idPersona, estado) {    
    return await Reservas.findAll({ 
        include: [
            {
                model: Servicio,
                as: 'servicio',
                attributes: ['id','nombre'],
            },
            {
                model: Sede,
                as: 'sede',
                attributes: ['id','nombre'],
            },
        ],
        attributes: ['id', 'idPersona', 'idTenant', 'fechaReserva', 'horaReserva'],
        where: { idTenant, idPersona, estado } 
    })
}

Reservas.findOneDataByTenantPersonDate = async function (idTenant, idPersona, fechaReserva, estado) {    
    return await Reservas.findOne({ 
        include: [
            {
                model: Servicio,
                as: 'servicio',
                attributes: ['id','nombre'],
            },
            {
                model: Sede,
                as: 'sede',
                attributes: ['id','nombre'],
            },
        ],
        attributes: ['id', 'idPersona', 'idTenant', 'idServicio', 'idSede', 'fechaReserva', 'horaReserva', 'duracionReserva', 'estado'],
        where: { idTenant, idPersona, fechaReserva, estado } 
    })
}

Reservas.belongsTo(Servicio, { foreignKey: 'idServicio' })
Reservas.belongsTo(Sede, { foreignKey: 'idSede' })

module.exports = Reservas