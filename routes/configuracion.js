const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getItems } = require('../controllers/configuracion')

router.get('/', verifyIdTenant, getItems)

module.exports = router