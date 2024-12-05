const { addDays } = require('date-fns')
const { format, toZonedTime } = require('date-fns-tz')

// Funcion para obtener el dia actual en Colombia V2
const getCurrentDateColombiaV2 = () => {
    const timeZone = 'America/Bogota'
    const currentDate = new Date()
    const zonedDate = toZonedTime(currentDate, timeZone)
    return format(zonedDate, 'yyyy-MM-dd')
}

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

// Parsear un time con formato 00:00 AM/PM a 00:00:00
const parseTime = (timeStr) => {
    const timeRegex = /^(\d{1,2}):([0-5]\d)\s?(AM|PM)$/i
    const match = timeStr.match(timeRegex)

    if (!match) {
        throw new Error("Invalid time format. It should be 'h:mm AM/PM'.")
    }

    const [_, hourStr, minuteStr, period] = match

    let hours = parseInt(hourStr, 10)
    // const minutes = parseInt(minuteStr, 10)

    // Ajustar horas segun el periodo AM/PM
    if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0
    }

    // Formatear en "HH:mm:ss"
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minuteStr.padStart(2, '0')}:00`
    return formattedTime
}

// Convertir a la zona horaria de bogota un string tipo date 2024-01-01
const convertToBogotaDate = (dateStr) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr)) {
        throw new Error('Formato de fecha inválido. Debe ser "YYYY-MM-DD".')
    }
  
    // Separar el año, mes y día
    const [year, month, day] = dateStr.split('-').map(Number)
  
    // Crear la fecha ajustada para la zona horaria "America/Bogota"
    const bogotaDate = new Date(Date.UTC(year, month - 1, day))
  
    // Ajustar la hora a la zona horaria de Bogotá
    const timeZoneOffset = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      hour: 'numeric',
      hour12: false,
    }).formatToParts(bogotaDate).find(part => part.type === 'hour').value
  
    // Ajustar la hora al inicio del día en Bogotá
    bogotaDate.setUTCHours(timeZoneOffset, 0, 0, 0)  
    return bogotaDate
}

// Convertir a formato 12 horas
const formatTo12Hour = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hours12 = hours % 12 || 12
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Dar formato a la fecha en formato Day, Day de Month de Year
const formatDateString = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }
    const dateStringConvert = new Intl.DateTimeFormat('es-ES', options).format(date)
    return dateStringConvert.charAt(0).toUpperCase() + dateStringConvert.slice(1).toLowerCase()
}

module.exports = { generateEnabledDates, generateSchedule, parseTime, convertToBogotaDate, formatTo12Hour, getCurrentDateColombiaV2, formatDateString }