const express = require('express')
const router = express.Router()

const checkIdTenant = require('../middlewares/tenant')
const { getItems, setItem } = require('../controllers/configuracion')

router.get('/', checkIdTenant, getItems)
router.post('/', checkIdTenant, setItem)

module.exports = router