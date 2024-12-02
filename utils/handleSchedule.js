const removeOccupiedSlots = (schedule, datesBusy, slotsPerHour) => {
    // Crea una copia del objeto para evitar mutaciones no deseadas
    const updatedSchedule = { ...schedule }

    // Mapa para contar ocupaciones por hora
    const busyCountMap = {}

    datesBusy.forEach((busySlot) => {
        const { fechaReserva, horaReserva } = busySlot.dataValues

        if (!busyCountMap[fechaReserva]) {
            busyCountMap[fechaReserva] = {}
        }

        // Inicializa la cuenta de ocupaciones para la hora específica
        const formattedHour = formatTime(horaReserva)
        busyCountMap[fechaReserva][formattedHour] = (busyCountMap[fechaReserva][formattedHour] || 0) + 1

        // Verifica si la fecha existe en el schedule
        if (!updatedSchedule[fechaReserva]) {
            // console.warn(`Fecha ${fechaReserva} no existe en el schedule.`)
            return
        }

        // Verifica si la hora esta disponible en el schedule
        const timeIndex = updatedSchedule[fechaReserva].indexOf(formattedHour)
        if (timeIndex === -1) {
            // console.warn(`Hora ${formattedHour} no encontrada en la fecha ${fechaReserva}.`)
            return
        }

        // Si los slots ocupados alcanzan el limite, elimina la hora del schedule
        if (busyCountMap[fechaReserva][formattedHour] >= slotsPerHour && updatedSchedule[fechaReserva]) {
            const timeIndex = updatedSchedule[fechaReserva]?.indexOf(formattedHour)

            if (timeIndex !== -1) {
                // Elimina la hora ocupada del array
                updatedSchedule[fechaReserva].splice(timeIndex, 1)
            }

            // Si no hay más horarios disponibles en el día, elimina el día
            if (updatedSchedule[fechaReserva]?.length === 0) {
                delete updatedSchedule[fechaReserva]
            }
        }
    })

    return Object.keys(updatedSchedule).length > 0
        ? updatedSchedule
        // : { message: "No availability left" }
        : {}
}

const formatTime = (timeString) => {
    // Convierte una hora en formato 'HH:mm:ss' a un formato amigable como '12:30 PM'
    const [hour, minute] = timeString.split(":")
    const hourInt = parseInt(hour, 10)
    const isPM = hourInt >= 12

    const formattedHour = isPM ? hourInt - 12 || 12 : hourInt
    return `${formattedHour}:${minute} ${isPM ? "PM" : "AM"}`
}

module.exports = { removeOccupiedSlots }