// 지난주 구하기
const getPreviousWeek = (date) => {
    if (date.getDate() <= 7) {
        // 현재 1주차면 이전주차를 구해서 반환한다.
        const previousDate = new Date(date)
        previousDate.setDate(previousDate.getDate() - 7)

        const firstDateOfMonth = new Date(
            previousDate.getFullYear(),
            previousDate.getMonth(),
            1,
        )
        const firstDay = firstDateOfMonth.getDay()
        const currentDate = previousDate.getDate()
        return `${date.getFullYear()}년 ${date.getMonth()}월 ${Math.ceil(
            (currentDate + firstDay) / 7,
        )}주차`
    } else {
        const firstDateOfMonth = new Date(
            date.getFullYear(),
            date.getMonth(),
            1,
        )
        const firstDay = firstDateOfMonth.getDay()
        const currentDate = date.getDate()
        const currentWeek = Math.ceil((currentDate + firstDay) / 7)
        // 현재 2주차 이상이면 그냥 1을 빼서 반환한다.
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${
            currentWeek - 1
        }주차`
    }
}

export default getPreviousWeek
