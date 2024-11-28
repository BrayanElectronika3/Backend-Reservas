const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/mysql")

const Storage = sequelize.define(
    "storages",
    {
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },     
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        idTenant: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps:true
    }
)

Storage.findAllData = async function (idTenant) {
    return await Storage.findAll({ where: { idTenant } })
}

Storage.findOneData = async function (id, idTenant) {    
    return await Storage.findOne({ where: { id, idTenant }})
}

Storage.findByIdAndUpdate = async function (id, body) {
    return await Storage.update( body , { where: { id } })
}

module.exports = Storage