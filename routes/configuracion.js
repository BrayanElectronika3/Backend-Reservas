const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getServicesAndHeadquearters, getDaysHoursService } = require('../controllers/configuracion')

const { validatorGetItem } = require('../validators/configuracion')

router.get('/serviceheadquarters', verifyIdTenant, getServicesAndHeadquearters)
router.get('/daysHoursService/:id', verifyIdTenant, validatorGetItem, getDaysHoursService)

module.exports = router