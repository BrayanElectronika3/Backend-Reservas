const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const SubCategoria = sequelize.define(
    'subcategorias',
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

SubCategoria.findOneData = async function (id, idTenant) {        
    return await SubCategoria.findOne({ where: { id, idTenant } })
}

SubCategoria.findAllData = async function (idTenant) {
    return await SubCategoria.findAll({ where: { idTenant } })
}

SubCategoria.findByIdAndUpdate = async function (id, body) {
    return await SubCategoria.update(body, { where: { id } })
}

module.exports = SubCategoria