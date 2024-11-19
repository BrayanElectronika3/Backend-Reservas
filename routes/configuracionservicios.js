const express = require('express')
const router = express.Router()

const checkIdTenant = require('../middlewares/tenant')
const { validatorGetItem } = require('../validators/configuracionservicios')
const { getItems } = require('../controllers/configuracionservicios')

router.get('/', checkIdTenant, getItems)

module.exports = router