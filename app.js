const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const PORT = process.env.PORT || 3000
const app = express()
const { dbConnectMySql } = require('./config/mysql')

app.use(cors())
app.use(express.json())
app.use(express.static('storage'))
app.use(morgan('dev'))

app.use('/reservas/api', require('./routes'))

app.listen(PORT, () => { console.log(`Server Online: http://localhost:${PORT}`) })

dbConnectMySql()

const cron = require('./schedules/reservas')