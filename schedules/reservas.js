const cron = require('node-cron')
const { reservasModel } = require('../models')
const { getCurrentDateColombiaV2 } = require('../utils/handleDate')

// Programa un cron job para cambiar el estado de las reservas pasadas a 'INACTIVO'
cron.schedule('0 1 * * *', async () => {
    try {
        console.log('Ejecutando funcion de modificar el estado de reservas:', new Date().toLocaleString())

        const currentDate = getCurrentDateColombiaV2()
        const status = 'ACTIVO'
        const records = await reservasModel.findAllDataByDate(currentDate, status)

        if (!records || !records?.length) return console.log('Los registros de reservas se encuentran actualizados.')

        records.map(async (record) => {
            await reservasModel.findByIdAndUpdate(record.id, { estado: 'INACTIVO' })
        })

        console.log('Registros de reservas actualizados correctamente.')

    } catch (error) {
        console.error('Error al ejecutar la funcion programada de cambiar el estado de las reservas en la DB:', error)
    }
})

// * * * * *
// ┬ ┬ ┬ ┬ ┬
// │ │ │ │ └─ Día de la semana (0 - 7) (0 o 7 es domingo)
// │ │ │ └─── Mes (1 - 12)
// │ │ └───── Día del mes (1 - 31)
// │ └─────── Hora (0 - 23)
// └───────── Minuto (0 - 59)

// Mantener el proceso en ejecucion
console.log('Cron job configurado.')