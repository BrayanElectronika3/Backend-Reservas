const express = require('express')
const router = express.Router()

const verifyAuth = require("../middlewares/auth")
const verifyIdTenant = require("../middlewares/tenant")
const verifyRol = require("../middlewares/rol")

const typeRol = ['SuperAdmin','Administrador','asesor' ]

const { getItems, getItem, createItem, updateItem, getItemsConfig } = require('../controllers/configuracionreservas')
const { validatorGetItem } = require('../validators/configuracionreservas')

router.get('/', verifyAuth, verifyIdTenant, verifyRol(typeRol), getItems)
router.get("/parametrizacion", verifyAuth, verifyIdTenant, verifyRol(typeRol), getItemsConfig)
router.get("/:id", verifyAuth, verifyIdTenant, verifyRol(typeRol), validatorGetItem, getItem)
router.post("/", verifyAuth, verifyIdTenant, verifyRol(typeRol), createItem)
router.patch("/:id", verifyAuth, verifyIdTenant, verifyRol(typeRol), updateItem)

module.exports = router