// 지난달 구하기
const getPreviousMonth = (date) => {
    return date.getMonth() === 0 // 현재 1월이면
        ? `${date.getFullYear() - 1}년 ${12}월` // 작년 12월을 반환
        : `${date.getFullYear()}년 ${date.getMonth()}월` // 2~12월이면 그냥 +1을 생략하고 이전달을 반환
}

export default getPreviousMonth
