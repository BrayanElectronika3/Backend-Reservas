const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorConsultarItem = [
    check('prefijo')
    .exists().withMessage('El campo prefijo es requerido.')
    .notEmpty().withMessage('El campo prefijo no debe estar vacío.')
    .isLength({ min: 2, max: 2 }).withMessage('El campo prefijo debe tener exactamente dos caracteres.')
    .isAlpha().withMessage('El campo prefijo solo debe contener letras.'),
    check('identificacion')
    .exists().withMessage('El campo identificacion es requerido.')
    .notEmpty().withMessage('El campo identificacion no debe estar vacío.')
    .isNumeric().withMessage('El campo identificacion solo permite numeros.'),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorConsultarItem }