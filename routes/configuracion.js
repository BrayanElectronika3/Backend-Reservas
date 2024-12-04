const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getServicesAndHeadquearters, getDaysHoursService, getConfig } = require('../controllers/configuracion')

const { validatorGetItem, validatorConfigItem } = require('../validators/configuracion')

router.get('/serviceheadquarters', verifyIdTenant, getServicesAndHeadquearters)
router.get('/daysHoursService/:id', verifyIdTenant, validatorGetItem, getDaysHoursService)
router.post('/idconfig', verifyIdTenant, validatorConfigItem, getConfig)

module.exports = router