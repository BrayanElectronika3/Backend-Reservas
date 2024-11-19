const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/mysql')

const Persona = sequelize.define(
    'personas',
    {
        tipoIdentificacion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        identificacion: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        primerNombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        segundoNombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primerApellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        segundoApellido: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sexo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaNacimiento: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vip: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    },
    {
        timestamps: true
    }
)

Persona.findAllData = async function () {
    return await Persona.findAll()
}

Persona.findOneData = async function (id) {
    return await Persona.findOne({ where: { id } })
}

Persona.findByIdAndUpdate = async function (id, body) {
    return await Persona.update(body, { where: { id } })
}

module.exports = Persona