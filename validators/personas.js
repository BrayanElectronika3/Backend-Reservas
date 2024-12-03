const { check } = require('express-validator')
const validateResults = require('../utils/handleValidator')

const validatorConsultItem = [
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

const validatorCreateItem = [
    check("tipoIdentificacion").exists().notEmpty(),
    check("identificacion").exists().notEmpty(),
    check("primerNombre").exists().notEmpty(),
    check("segundoNombre").exists(),
    check("primerApellido").exists().notEmpty(),
    check("segundoApellido").exists(),
    check("telefono").exists().notEmpty(),
    check("email").exists().notEmpty(),
    check("vip").exists().notEmpty(),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorConsultItem, validatorCreateItem }