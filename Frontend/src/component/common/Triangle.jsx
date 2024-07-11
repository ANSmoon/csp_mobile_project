/* 

Triangle Component
props : diff

diff 값이 음수,양수,0인지에 따라서 증감을 표시하는 삼각형을 반환합니다.

*/

function Triangle(diff) {
    if (diff > 0) {
        // 지난달보다 매출 증가시 빨간색 상승 삼각형
        return (
            <div
                className="w-0 h-0 
            border-l-[6px] border-l-transparent
            border-b-[9px] border-b-red-500
            border-r-[6px] border-r-transparent
            "
            ></div>
        )
    } else if (diff === 0) {
        // 지난달과 매출이 동일하면 회색 -
        return (
            <div
                className="
                w-3
                border-b-2
                border-neutral-400
                "
            ></div>
        )
    } else if (diff < 0) {
        // 지난달보다 매출 하락시 파란색 하강 삼각형
        return (
            <div
                className="w-0 h-0 
                border-l-[6px] border-l-transparent
                border-t-[9px] border-t-blue-600
                border-r-[6px] border-r-transparent
                "
            ></div>
        )
    }
}

export default Triangle
