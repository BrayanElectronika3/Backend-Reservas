const { handleHttpError } = require("../utils/handleError")
const { verifyToken } = require("../utils/handleJwt")
const getProperties = require("../utils/handlePropertiesEngine")
const { usersModel } = require("../models")

const propertiesKey = getProperties()

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "Need Sesion", 401)            
            return null
        }
        
        const token = req.headers.authorization.split(" ").pop()        
        const dataToken = await verifyToken(token)

        if (!dataToken) {
            handleHttpError(res, "Not Token Data", 401)            
            return null
        }

        req.user = await usersModel.findOneData(dataToken[propertiesKey.id])
        next()
    } catch (error) {
        handleHttpError(res, "Error Sesion", 401)
    }
}

module.exports = authMiddleware