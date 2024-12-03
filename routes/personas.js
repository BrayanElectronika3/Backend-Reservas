const express = require('express')
const router = express.Router()

const verifyIdTenant = require("../middlewares/tenant")

const { validatorConsultItem, validatorCreateItem } = require('../validators/personas')
const { getPersona, createItem } = require('../controllers/personas')

router.post('/consultar', validatorConsultItem, getPersona)
router.post("/", verifyIdTenant, validatorCreateItem, createItem)

module.exports = router