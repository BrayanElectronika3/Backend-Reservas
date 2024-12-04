const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorGetItem = [
    check("id").exists().notEmpty(),
    (req, res, next) => validateResults(req, res, next)
]

const validatorConfigItem = [
    check('idServicio')
    .exists().withMessage('El campo idServicio es requerido.')
    .notEmpty().withMessage('El campo idServicio no debe estar vacio.')
    .isNumeric().withMessage('El campo idServicio solo permite numeros.'),
    check('idSede')
    .exists().withMessage('El campo idSede es requerido.')
    .notEmpty().withMessage('El campo idSede no debe estar vacio.')
    .isNumeric().withMessage('El campo idSede solo permite numeros.'),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorGetItem, validatorConfigItem }