/* 

Sales Contents

- props:
    lastwordOfDate: 헤더에 있는 날짜 정보에서 마지막 단어만 추출한 것입니다. (ex: 오늘,3일,이번달,4주차)
    type: 현재 선택된 날짜, lastwordOfDate와 같습니다.
    prevTyoe: 이전 날짜
    sales: 이번 매출
    pastSales: 이전 매출
    diffSales: 이번 매출 - 이전 매출

- 이중 삼항 연산자
A?(B?C:D):E
diffSales 양수, 0, 음수인 경우 총 3가지 case

*/

import Triangle from '../common/Triangle'
import rightArrowImg from '../../assets/right.svg'
import { useSelector } from 'react-redux'
import { selectCurrentDateDay } from '../../services/date/dateSlice'
import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import cheerUpMp4 from '../../assets/cheerup_cycles_mp4.mp4'
import clappingMp4 from '../../assets/clapping_cycles_mp4.mp4'

const Sales = (props) => {
    // 요일 구하기
    const dateString = useSelector(selectCurrentDateDay) // 현재 선택된 날짜
    const [dayOfWeek, setDayOfWeek] = useState(null) // 요일 인덱스
    const [colorState, setColorState] = useState() // 요일 배경색
    const days = ['일', '월', '화', '수', '목', '금', '토']

    useEffect(() => {
        const day = dateString.replace(
            /(\d{4})년 (\d{1,2})월 (\d{1,2})일/,
            function (match, year, month, day) {
                month = month.padStart(2, '0')
                day = day.padStart(2, '0')
                const date = new Date(year, month - 1, day)
                return date.getDay()
            },
        )
        setDayOfWeek(day)

        // 각 요일의 배경 색깔
        const colors = [
            'bg-purple-400',
            'bg-rose-400',
            'bg-orange-400',
            'bg-yellow-400',
            'bg-green-400',
            'bg-cyan-400',
            'bg-blue-500',
        ]
        setColorState(colors[dayOfWeek])
    }, [dateString, dayOfWeek])

    // gif 이미지 로드 완료 여부와 매출 상승, 하락 여부에 따른 이미지 설정
    const [loaded, setLoaded] = useState(false)
    const [diffSalesState, setdiffSalesState] = useState(props.diffSales)
    useEffect(() => {
        setdiffSalesState(props.diffSales)
    }, [props.diffSales])

    const handleLoadedData = useCallback(() => {
        setLoaded(true)
    }, [])

    const location = useLocation()
    return (
        <div className="p-6 lg:px-12 z-10 bg-white">
            {/* 타이틀 */}
            <div className="flex">
                <span className="font-semibold text-2xl/[38px]">
                    {props.lastwordOfDate} 매출{' '}
                    <span className=" border-b border-gray-500 text-[28px] whitespace-nowrap">
                        {props.sales.toLocaleString('ko-KR')}원
                    </span>{' '}
                    <br />
                    기록했어요
                </span>
                {/* 요일 표시 */}
                {location.pathname.startsWith('/day') ? (
                    <span
                        className={
                            colorState +
                            ' text-sm text-white font-medium ml-auto mr-0 mt-2 px-4 py-1 h-1/4 rounded-2xl whitespace-nowrap'
                        }
                    >
                        {days[dayOfWeek] + '요일'}
                    </span>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex justify-center ">
                <video
                    key={diffSalesState >= 0 ? 'clapping' : 'cheerUp'}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-auto h-40 transition-opacity ${
                        loaded ? 'opacity-100 duration-500' : 'opacity-0'
                    }`}
                    onLoadedData={handleLoadedData}
                >
                    {diffSalesState >= 0 ? (
                        <source src={clappingMp4} type="video/mp4" />
                    ) : (
                        <source src={cheerUpMp4} type="video/mp4" />
                    )}
                </video>
            </div>
            {/* badge */}
            <div className="flex px-2">
                <span className="bg-blue-100 text-blue-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-xl mr-auto">
                    {props.prevType}
                </span>
                <span className="bg-blue-100 text-blue-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-xl ml-auto">
                    {props.type}
                </span>
            </div>
            {/* 매출 */}
            <div className="flex p-2">
                <span className="text-neutral-400 font-bold custom-sm:text-2xl text-lg mr-auto whitespace-nowrap">
                    {props.pastSales.toLocaleString('ko-KR')}원
                </span>
                <img src={rightArrowImg} alt="right-arrow" />
                <span className="font-bold  ml-auto custom-sm:text-2xl text-lg whitespace-nowrap">
                    {props.sales.toLocaleString('ko-KR')}원
                </span>
            </div>
            <div className="flex justify-center items-center">
                {Triangle(props.diffSales)}
                <span
                    className={
                        (props.diffSales >= 0
                            ? props.diffSales === 0
                                ? 'text-neutral-400'
                                : 'text-rose-500'
                            : 'text-blue-600') + ' font-bold text-xl ml-2 '
                    }
                >
                    {props.diffSales.toLocaleString('ko-KR')}원
                </span>
            </div>
        </div>
    )
}

export default Sales
