const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')
const AreaAtencion = require('./areaatenciones')

const Sede = sequelize.define(
    'sedes',
    {
        idEmpresa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefono: {
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
        timestamps:true,
        paranoid: true
    }
)

Sede.findOneData = async function (id, idTenant) {        
    return await Sede.findOne({ 
        where: { id, idTenant },
        include: [
            {
                model: AreaAtencion,
            }
        ]
    })
}

Sede.findAllData = async function (idTenant) {
    return await Sede.findAll({
        where: { idTenant },
        include: [
            {
                model: AreaAtencion,
            }
        ]
    })
}

Sede.findByIdAndUpdate = async function (id, body) {
    return await Sede.update(body, { where: { id } })
}

Sede.hasMany(AreaAtencion, { foreignKey: 'idSede' })

module.exports = Sede