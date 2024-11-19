const express = require('express')
const router = express.Router()

const { validatorConsultarItem } = require('../validators/personas')
const { getPersona } = require('../controllers/personas')

router.post('/consultar', validatorConsultarItem, getPersona)

module.exports = router