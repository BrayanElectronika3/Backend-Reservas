const { sequelize } = require("../../config/mysql")
const { DataTypes } = require("sequelize")

const Rol = sequelize.define(
    "roles",
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps:true
    }
)

Rol.findOneData = async function (id) {
    return await Rol.findOne({ where: { id } })
}

Rol.findAllData = async function () {
    return await Rol.findAll()
}

Rol.findByIdAndUpdate = async function (id, body) {
    return await Rol.update( body, { where: { id } })
}

module.exports = Rol