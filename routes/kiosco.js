const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getItem } = require('../controllers/kiosco')

const { validatorGetItem } = require('../validators/kiosco')

router.get("/:idPerson", verifyIdTenant, validatorGetItem, getItem)

module.exports = router