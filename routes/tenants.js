const express = require('express')
const router = express.Router()

const { validatorGetItem  } = require('../validators/tenants')
const { getTenant } = require('../controllers/tenants')

router.get('/:id', validatorGetItem, getTenant)

module.exports = router