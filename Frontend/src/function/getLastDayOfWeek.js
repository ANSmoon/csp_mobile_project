export default function getLastDayOfWeek(year, month, week) {
    const firstDayOfMonth = new Date(year, month - 1, 1)
    const firstDayOfWeek = new Date(
        year,
        month - 1,
        1 + (week - 1) * 7 - firstDayOfMonth.getDay() + 6,
    )
    return firstDayOfWeek
}
