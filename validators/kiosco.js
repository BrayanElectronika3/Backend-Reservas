const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorGetItem = [
    check("idPerson").exists().notEmpty(),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorGetItem }