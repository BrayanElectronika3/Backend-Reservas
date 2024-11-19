const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorGetItem = [
    check('id')
    .exists().withMessage('El parametro es requerido.')
    .notEmpty().withMessage('El parametro no debe estar vacío.')
    .isAlpha().withMessage('El parametro solo debe contener letras.'),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorGetItem };