const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Categoria = sequelize.define(
    'categorias',
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

Categoria.findOneData = async function (id, idTenant) {        
    return await Categoria.findOne({ where: { id, idTenant } })
}

Categoria.findAllData = async function (idTenant) {
    return await Categoria.findAll({ where: { idTenant } })
}

Categoria.findByIdAndUpdate = async function (id, body) {
    return await Categoria.update(body, { where: { id } })
}

module.exports = Categoria