export function formatDateLiteral(isoString, withTime = false) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    let result = `${day} de ${month} del ${year}`

    if (withTime) {
        let hours = date.getHours() % 12
        if (hours === 0) hours = 12
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const ampm = date.getHours() < 12 ? 'AM' : 'PM'

        result += ` a las ${hours}:${minutes} ${ampm}`
    }

    return result
}
