const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Identificacion = sequelize.define(
    'identificaciones',
    {
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
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

Identificacion.findAllData = async function () {
    return await Identificacion.findAll({ where: { estado : 'ACTIVO' } })
}

Identificacion.findOneData = async function (id) {    
    return await Identificacion.findOne({ where: { id } })
}

Identificacion.findByIdAndUpdate = async function (id, body) {
    return await Identificacion.update(body, { where: { id } })
}

module.exports = Identificacion