const { handleHttpError } = require("../utils/handleError")

const verifyRol = (roles) => (req, res, next) =>{
    try {
        const { user } = req
        const rolesByUser = user.role.nombre
        const checkValueRol = roles.some((rol) => rolesByUser.includes(rol))

        if (!checkValueRol) {
            handleHttpError(res, "User Not Permissions", 403)    
            return null
        }
        
        next()    
        
    } catch (error) {
        handleHttpError(res, "Error Permissions", 403)
    }    
}

module.exports = verifyRol