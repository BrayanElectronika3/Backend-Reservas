const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/mysql")
const Storage = require("./storage")
const Rol = require("./roles")
const Persona = require("./personas")

const User = sequelize.define(
    "users",
    {
        nombres: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nickName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        idPersona: {
            type: DataTypes.INTEGER,
            allowNull: false
        },       
        email: {
            type:DataTypes.STRING,
            allowNull: false,
            unique: true
        },        
        password: {
            type:DataTypes.STRING
        },        
        idRol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idStorage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estadoSesion: {
            type:DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type:DataTypes.STRING,
            allowNull: false
        },
        idTenant: {
            type:DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps:true,
        paranoid: true
    }
)

User.findOneData = async function (id) {        
    return await User.findOne(
        { 
            where: { id },        
            attributes: ['id','nickName', 'email','estadoSesion','estado'],    
            include:[
                {
                    model: Persona,                    
                    attributes: ['id','tipoIdentificacion', 'identificacion','primerNombre','segundoNombre','primerApellido','segundoApellido','sexo','telefono', 'fechaNacimiento'],
                },
                {
                    model: Storage,                    
                    attributes: ['id','url', 'filename'],
                },
                {
                    model: Rol,
                    attributes: ['id','nombre'],
                },
            ],
        }
    )
}

User.findAllData = async function (idTenant) {
    return await User.findAll(
        {
            attributes: ['id','nickName', 'email','estadoSesion','estado'],    
            include:[
                {
                    model: Persona,                    
                    attributes: ['id','tipoIdentificacion', 'identificacion','primerNombre','segundoNombre','primerApellido','segundoApellido','sexo','telefono'],
                },
                {
                    model: Storage,                    
                    attributes: ['id','url', 'filename'],
                },
                {
                    model: Rol,
                    attributes: ['id','nombre'],
                },
            ],
            where: { idTenant }
        }
    )
}

User.findByIdAndUpdate =async function (id, body) {
    return await User.update( 
        { 
            nickName: body.nickName,
            idRol: body.idRol,
            idStorage: body.idStorage,
            password:body.password,
            estado:body.estado
        }, 
        { where: { id } }
    )
}

User.updateSesion =async function (id, body) {
    return await User.update( 
        {             
            estadoSesion:body.estadoSesion
        }, 
        { where: { id } }
    );
}

User.belongsTo(Storage, { foreignKey:"idStorage"})
User.belongsTo(Rol, { foreignKey:"idRol"})
User.belongsTo(Persona, { foreignKey:"idPersona"})

module.exports = User