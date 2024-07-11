// 어제 날짜 구하기
const getPreviousDate = (date) => {
    const previousDate = new Date(date)
    previousDate.setDate(previousDate.getDate() - 1)
    return `${previousDate.getFullYear()}년 ${
        previousDate.getMonth() + 1
    }월 ${previousDate.getDate()}일`
}

export default getPreviousDate
