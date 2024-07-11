// 날짜를 입력하면 몇째주인지 알려주는 함수
export default function getWeek(date) {
    const firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1) // 현재 날짜의 달의 첫번째 날
    const firstDay = firstDateOfMonth.getDay() // 첫번째 날의 요일
    const currentDate = date.getDate() // 현재 날짜

    return Math.ceil((currentDate + firstDay) / 7)
}
