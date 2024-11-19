const { handleHttpError } = require('../utils/handleError')

const checkIdTenant = async (req, res, next) => {
    try {
        if (!req.headers.tenant) {
            handleHttpError(res, 'Need Tenant', 401)
            return null
        }

        if (req.headers.tenant.length !== 36) {
            handleHttpError(res, 'Invalid Tenant Length', 401)
            return null
        }

        next()

    } catch (error) {
        handleHttpError(res, 'Error Tenant Not Found', 403)
    }
}

module.exports = checkIdTenant