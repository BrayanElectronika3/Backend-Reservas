const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getServicesAndHeadquearters, getServiceHours } = require('../controllers/configuracion')

const { validatorGetItem } = require('../validators/configuracion')

router.get('/serviceheadquarters', verifyIdTenant, getServicesAndHeadquearters)
router.get('/servicehours/:id', verifyIdTenant, validatorGetItem, getServiceHours)

module.exports = router