const express = require('express')
const router = express.Router()

const { getItems } = require('../controllers/identificaciones')

router.get('/', getItems)

module.exports = router