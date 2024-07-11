export default function getFirstDayOfWeek(year, month, week) {
    const firstDayOfMonth = new Date(year, month - 1, 1)
    const firstDayOfWeek = new Date(
        year,
        month - 1,
        1 + (week - 1) * 7 - firstDayOfMonth.getDay(),
    )
    return firstDayOfWeek
}
