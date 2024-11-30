const express = require('express')
const router = express.Router()

const verifyIdTenant = require('../middlewares/tenant')

const { getItems, getItem, createItem, updateItem } = require('../controllers/reservas')

const { validatorGetItem } = require('../validators/reservas')

router.get('/', verifyIdTenant, getItems)
router.get("/:id", verifyIdTenant, validatorGetItem, getItem)
router.post("/", verifyIdTenant, createItem)
router.patch("/:id", verifyIdTenant, updateItem)

module.exports = router