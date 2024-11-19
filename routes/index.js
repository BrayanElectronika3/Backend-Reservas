const express = require('express')
const fs = require('fs')
const router = express.Router()

fs.readdirSync(__dirname).filter((file) => {
    const name = file.split('.').shift()
    if (name !== 'index') {
        console.log(`Ruta: ${name}`)
        router.use(`/${name}`, require(`./${file}`))
    }
})

module.exports = router