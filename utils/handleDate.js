const { addDays } = require('date-fns')
const { format } = require('date-fns-tz')

// Funcion para obtener el dia actual en Colombia
const getCurrentDateColombia = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss', 'America/Bogota')

// Funcion para generar las fechas habilitadas segun la configuracion de las reservas
const generateEnabledDates = (data) => {
    const daysWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
    const currentDate = getCurrentDateColombia()
    const datesEnabled = []

    // Iterar los próximos 7 días
    for (let i = 0; i < 7; i++) {
        const newCurrentDate = addDays(currentDate, i)
        const dayWeek = daysWeek[newCurrentDate.getDay()]

        // Verificar si el día está habilitado en la configuración
        if (data[dayWeek]) {
            // Convertir la fecha a la zona horaria de Colombia
            const formattedDate = format(newCurrentDate, 'yyyy-MM-dd HH:mm:ss', 'America/Bogota')
            datesEnabled.push(formattedDate)
        }
    }

    return datesEnabled
}

// Obtener el formato del tiempo
const formatTime = (date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Generar horarios disponibles
const generateAvailableHours = (horaInicial, horaFinal, duracionReserva) => {
    const availableHours = []
    let currentTime = new Date(`2024-01-01 ${horaInicial}`)
    const endTime = new Date(`2024-01-01 ${horaFinal}`)

    while (currentTime < endTime) {
        availableHours.push(formatTime(currentTime))
        currentTime = new Date(currentTime.getTime() + duracionReserva * 60 * 1000)
    }

    return availableHours
}

// Generar horario
const generateSchedule = (datesEnabled, horaInicial, horaFinal, duracionReserva) => {
    const schedule = {}

    datesEnabled.forEach((date) => {
        const dateKey = new Date(date).toISOString().split('T')[0]        
        schedule[dateKey] = generateAvailableHours(horaInicial, horaFinal, duracionReserva)
    })

    return schedule
}

module.exports = { generateEnabledDates, generateSchedule }