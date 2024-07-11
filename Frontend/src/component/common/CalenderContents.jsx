/* 

CalendarContents Component

props: closeModal(Calendar창을 닫는 함수입니다.), array(현재 선택된 달의 탭이 기본으로 펼쳐지도록 미리 계산된 array입니다.)
현재 날짜를 기준으로 현재달을 포함해서 총 6개월의 날짜를 선택할 수 있습니다.
각각 일간,주간,월간 페이지에서 캘린더를 선택했을 때 다른 내용을 띄웁니다.

*/

import { useLocation } from 'react-router-dom'
import {
    setDateMonth,
    setDateWeek,
    setDateDay,
} from '../../services/date/dateSlice'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import getFirstDayOfWeek from '../../function/getFirstDayOfWeek'
import getWeek from '../../function/getWeek'

const selectedDate = new Date('2023-12-17') // 현재 날짜

const ListMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const ListWeeks = ['1주차', '2주차', '3주차', '4주차', '5주차', '6주차']
const ListDays = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
]

let monthstate
if (selectedDate.getMonth() + 1 < 6) {
    const prevYearMonth = ListMonths.slice(
        (selectedDate.getMonth() - 5 + 12) % 12, // 해가 넘어가면 이전 해의 달부터
        12, // 12월까지
    )
    const thisYearMonth = ListMonths.slice(
        0, // 1월부터
        selectedDate.getMonth() + 1, // 현재달까지
    )
    monthstate = [...prevYearMonth, ...thisYearMonth]
} else {
    monthstate = ListMonths.slice(
        (selectedDate.getMonth() - 5 + 12) % 12, // 현재 날짜 기준 이전 5개달부터
        selectedDate.getMonth() + 1, // 현재 달까지 캘린더에 표시함
    )
}

// 이번달부터 이전 5달이 몇주차까지 있는지(해바뀜도 구현됨)
const weeksOfSixMonth = (date) => {
    const ListWeeksOfEachMonth = []
    ;[4, 3, 2, 1, 0, -1].map((ago) => {
        const monthAgoLastDate = new Date(
            date.getFullYear(),
            date.getMonth() - ago,
            0,
        )
        ListWeeksOfEachMonth.push(getWeek(monthAgoLastDate))
    })
    // console.log('ListWeeksOfEachMonth', ListWeeksOfEachMonth)
    return ListWeeksOfEachMonth
}

const week = getWeek(selectedDate)
let today = selectedDate.getDate()

const weekstate = ListWeeks.slice(0, week)

// 마지막 날을 찾는 함수
function FindLastDay(month) {
    let lastDay = new Date(2023, month, 0).getDate()
    return lastDay
}

const daystate = ListDays.slice(0, today)

// CalendarContents Component -----------------------------------------------------------------------------------
const CalenderContents = (props) => {
    const dispatch = useDispatch()
    const location = useLocation()

    // 배열의 값이 1인 인덱스의 tab이 기본으로 펼쳐진다.
    const [focusArray, setFocusArray] = useState(props.array)

    // 이중배열로 초기화하지않으면 firstWeekTolastWeek[key].map()에서 undefined에 map을 적용해서 에러가 뜬다.
    const [firstWeekTolastWeek, setfirstWeekTolastWeek] = useState([
        [],
        [],
        [],
        [],
        [],
        [],
    ])
    let ListWeeksOfEachMonth // 월별 마지막주
    useEffect(() => {
        setfirstWeekTolastWeek([[], [], [], [], [], []])
        ListWeeksOfEachMonth = weeksOfSixMonth(selectedDate)
        const array = [0, 1, 2, 3, 4, 5].map((index) =>
            ListWeeks.slice(0, ListWeeksOfEachMonth[index]),
        )
        setfirstWeekTolastWeek(array)
    }, [])

    if (location.pathname.startsWith('/month')) {
        return (
            <div className="mt-2 max-h-[400px] overflow-y-auto">
                <ol>
                    {monthstate.map((option, key) => (
                        <li
                            key={key}
                            className="p-2 text-center text-lg font-midium rounded-md border border-transparent mx-2 px-4 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={(e) => {
                                if (option > selectedDate.getMonth() + 1) {
                                    // 이전해
                                    dispatch(
                                        setDateMonth(
                                            selectedDate.getFullYear() -
                                                1 +
                                                '년 ' +
                                                option +
                                                '월',
                                        ),
                                    )
                                    dispatch(
                                        setDateWeek(
                                            selectedDate.getFullYear() -
                                                1 +
                                                '년 ' +
                                                option +
                                                '월 ' +
                                                1 +
                                                '주차',
                                        ),
                                    )
                                    dispatch(
                                        setDateDay(
                                            selectedDate.getFullYear() -
                                                1 +
                                                '년 ' +
                                                option +
                                                '월 ' +
                                                1 +
                                                '일',
                                        ),
                                    )
                                } else {
                                    // 이번해
                                    dispatch(
                                        setDateMonth(
                                            selectedDate.getFullYear() +
                                                '년 ' +
                                                option +
                                                '월',
                                        ),
                                    )
                                    // week 변경
                                    dispatch(
                                        setDateWeek(
                                            selectedDate.getFullYear() +
                                                '년 ' +
                                                option +
                                                '월 ' +
                                                1 +
                                                '주차',
                                        ),
                                    )
                                    // day 변경
                                    dispatch(
                                        setDateDay(
                                            selectedDate.getFullYear() +
                                                '년 ' +
                                                option +
                                                '월 ' +
                                                1 +
                                                '일',
                                        ),
                                    )
                                }

                                props.closeModal()
                            }}
                        >
                            {option > selectedDate.getMonth() + 1 ? ( // 월이 selectedDate의 월보다 큰경우 이전 해
                                <span>
                                    {selectedDate.getFullYear() -
                                        1 +
                                        '년 ' +
                                        option +
                                        '월'}
                                </span>
                            ) : (
                                <span>
                                    {selectedDate.getFullYear() +
                                        '년 ' +
                                        option +
                                        '월'}
                                </span>
                            )}
                            {/* {selectedDate.getFullYear() + '년 ' + option + '월'} */}
                        </li>
                    ))}
                </ol>
            </div>
        )
    } else if (location.pathname.startsWith('/week')) {
        // week

        return (
            <div className="mt-2 max-h-[400px] overflow-y-auto">
                {monthstate.map((option, key) =>
                    option === selectedDate.getMonth() + 1 ? ( // option이 현재 날짜의 달이면
                        <div
                            key={key}
                            className="group flex flex-col gap-2 rounded-lg "
                            tabIndex={focusArray[key]}
                        >
                            <div className="flex p-2 text-xl font-bold cursor-pointer items-center">
                                <span>
                                    {selectedDate.getFullYear() +
                                        '년 ' +
                                        option +
                                        '월'}
                                </span>
                            </div>

                            <ol className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000">
                                {weekstate.map(
                                    (
                                        optionW,
                                        keyW, // weekstate는 1주차부터 현재 날짜의 주차까지만 포함된 배열
                                    ) => (
                                        <li
                                            key={keyW}
                                            className="p-2 text-center text-lg rounded-md border border-transparent mx-2 px-4 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={(e) => {
                                                dispatch(
                                                    setDateWeek(
                                                        selectedDate.getFullYear() +
                                                            '년 ' +
                                                            option +
                                                            '월 ' +
                                                            optionW,
                                                    ),
                                                )
                                                dispatch(
                                                    setDateMonth(
                                                        selectedDate.getFullYear() +
                                                            '년 ' +
                                                            option +
                                                            '월',
                                                    ),
                                                )
                                                // 해당 주의 첫번째 날 구하기
                                                const firstDayOfWeek =
                                                    getFirstDayOfWeek(
                                                        selectedDate.getFullYear(),
                                                        option,
                                                        parseInt(optionW),
                                                    ).getDate()
                                                // 1주차 && 주의 첫번째 날이 1일보다 큰경우 month - 1 한다.
                                                if (
                                                    optionW === 1 &&
                                                    firstDayOfWeek > 1
                                                ) {
                                                    dispatch(
                                                        setDateDay(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option -
                                                                1 +
                                                                '월 ' +
                                                                firstDayOfWeek +
                                                                '일',
                                                        ),
                                                    )
                                                } else {
                                                    dispatch(
                                                        setDateDay(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                firstDayOfWeek +
                                                                '일',
                                                        ),
                                                    )
                                                }

                                                props.closeModal()
                                            }}
                                        >
                                            {optionW}
                                        </li>
                                    ),
                                )}
                            </ol>
                        </div>
                    ) : (
                        // option이 현재 선택된 달이 아니면
                        <div
                            key={key}
                            className="group flex flex-col gap-2 rounded-lg"
                            tabIndex={focusArray[key]}
                        >
                            <div className="flex p-2 text-xl font-bold cursor-pointer items-center">
                                {option > selectedDate.getMonth() + 1 ? ( // 월이 selectedDate의 월보다 큰경우 이전 해
                                    <span>
                                        {selectedDate.getFullYear() -
                                            1 +
                                            '년 ' +
                                            option +
                                            '월'}
                                    </span>
                                ) : (
                                    <span>
                                        {selectedDate.getFullYear() +
                                            '년 ' +
                                            option +
                                            '월'}
                                    </span>
                                )}
                            </div>
                            <ol className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000">
                                {firstWeekTolastWeek[key].map(
                                    (
                                        optionW,
                                        keyW, // ListWeeks는 1~6주차를 모두 포함한다.
                                    ) => (
                                        <li
                                            key={keyW}
                                            className="p-2 text-center text-lg font-midium rounded-md border border-transparent mx-2 px-4 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={(e) => {
                                                // 현재 달보다 큰 경우 이전해의 달이다
                                                if (
                                                    option >
                                                    selectedDate.getMonth() + 1
                                                ) {
                                                    dispatch(
                                                        setDateWeek(
                                                            selectedDate.getFullYear() -
                                                                1 +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                optionW,
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateMonth(
                                                            selectedDate.getFullYear() -
                                                                1 +
                                                                '년 ' +
                                                                option +
                                                                '월',
                                                        ),
                                                    )
                                                    // 해당 주의 첫번째 날 구하기
                                                    const firstDayOfWeek =
                                                        getFirstDayOfWeek(
                                                            selectedDate.getFullYear(),
                                                            option,
                                                            parseInt(optionW),
                                                        ).getDate()
                                                    // 1주차 && 주의 첫번째 날이 1일보다 큰경우 month - 1 한다.
                                                    if (
                                                        optionW === '1주차' &&
                                                        firstDayOfWeek > 1
                                                    ) {
                                                        console.log('이전달로!')
                                                        dispatch(
                                                            setDateDay(
                                                                selectedDate.getFullYear() +
                                                                    '년 ' +
                                                                    option -
                                                                    1 +
                                                                    '월 ' +
                                                                    firstDayOfWeek +
                                                                    '일',
                                                            ),
                                                        )
                                                    } else {
                                                        console.log('이번달로!')
                                                        dispatch(
                                                            setDateDay(
                                                                selectedDate.getFullYear() +
                                                                    '년 ' +
                                                                    option +
                                                                    '월 ' +
                                                                    firstDayOfWeek +
                                                                    '일',
                                                            ),
                                                        )
                                                    }
                                                } else {
                                                    // 이번해의 달
                                                    dispatch(
                                                        setDateWeek(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                optionW,
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateMonth(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월',
                                                        ),
                                                    )
                                                    // 해당 주의 첫번째 날 구하기
                                                    const firstDayOfWeek =
                                                        getFirstDayOfWeek(
                                                            selectedDate.getFullYear(),
                                                            option,
                                                            parseInt(optionW),
                                                        ).getDate()
                                                    // 1주차 && 주의 첫번째 날이 1일보다 큰경우 month - 1 한다.
                                                    if (
                                                        optionW === '1주차' &&
                                                        firstDayOfWeek > 1
                                                    ) {
                                                        console.log('이전달로!')
                                                        dispatch(
                                                            setDateDay(
                                                                selectedDate.getFullYear() +
                                                                    '년 ' +
                                                                    (option -
                                                                        1) +
                                                                    '월 ' +
                                                                    firstDayOfWeek +
                                                                    '일',
                                                            ),
                                                        )
                                                    } else {
                                                        console.log('현재달로!')

                                                        dispatch(
                                                            setDateDay(
                                                                selectedDate.getFullYear() +
                                                                    '년 ' +
                                                                    option +
                                                                    '월 ' +
                                                                    firstDayOfWeek +
                                                                    '일',
                                                            ),
                                                        )
                                                    }
                                                }

                                                props.closeModal()
                                            }}
                                        >
                                            {optionW}
                                        </li>
                                    ),
                                )}
                            </ol>
                        </div>
                    ),
                )}
            </div>
        )
    } else if (location.pathname.startsWith('/day')) {
        // day
        return (
            <div className="mt-2 max-h-[400px] overflow-y-auto">
                {monthstate.map((option, key) =>
                    option === selectedDate.getMonth() + 1 ? ( // 이번달이면
                        <div
                            key={key}
                            className="group gap-2 rounded-lg"
                            tabIndex={focusArray[key]}
                        >
                            <div className="flex p-2 text-xl font-bold cursor-pointer items-center">
                                <span>
                                    {selectedDate.getFullYear() +
                                        '년 ' +
                                        option +
                                        '월'}
                                </span>
                            </div>
                            <ol className="invisible max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-60 group-focus:overflow-auto group-focus:opacity-100 group-focus:duration-1000">
                                {daystate.map((optionD, keyD) => (
                                    <li
                                        key={keyD}
                                        className="p-2 position:relative invisible group-focus:visible text-center text-lg font-midium rounded-md border border-transparent mx-2 px-4 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={(e) => {
                                            dispatch(
                                                setDateDay(
                                                    selectedDate.getFullYear() +
                                                        '년 ' +
                                                        option +
                                                        '월 ' +
                                                        optionD +
                                                        '일',
                                                ),
                                            )
                                            dispatch(
                                                setDateWeek(
                                                    selectedDate.getFullYear() +
                                                        '년 ' +
                                                        option +
                                                        '월 ' +
                                                        getWeek(
                                                            new Date(
                                                                selectedDate.getFullYear(),
                                                                option - 1,
                                                                optionD,
                                                            ),
                                                        ) +
                                                        '주차',
                                                ),
                                            )
                                            dispatch(
                                                setDateMonth(
                                                    selectedDate.getFullYear() +
                                                        '년 ' +
                                                        option +
                                                        '월',
                                                ),
                                            )
                                            props.closeModal()
                                        }}
                                    >
                                        {optionD + '일'}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ) : (
                        // 이번달 아니면
                        <div
                            key={key}
                            className="group flex flex-col gap-2 rounded-lg"
                            tabIndex={focusArray[key]}
                        >
                            <div className="flex p-2 text-xl font-bold cursor-pointer items-center">
                                {option > selectedDate.getMonth() + 1 ? ( // 월이 selectedDate의 월보다 큰경우 이전 해
                                    <span>
                                        {selectedDate.getFullYear() -
                                            1 +
                                            '년 ' +
                                            option +
                                            '월'}
                                    </span>
                                ) : (
                                    <span>
                                        {selectedDate.getFullYear() +
                                            '년 ' +
                                            option +
                                            '월'}
                                    </span>
                                )}
                            </div>
                            <ol className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-40 group-focus:overflow-auto group-focus:opacity-100 group-focus:duration-1000">
                                {ListDays.slice(0, FindLastDay(option)).map(
                                    (optionD, keyD) => (
                                        <li
                                            key={keyD}
                                            className="p-2 text-center text-lg font-midium rounded-md border border-transparent mx-2 px-4 py-2 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={(e) => {
                                                if (
                                                    option >
                                                    selectedDate.getMonth() + 1
                                                ) {
                                                    dispatch(
                                                        setDateDay(
                                                            selectedDate.getFullYear() -
                                                                1 +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                optionD +
                                                                '일',
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateWeek(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                getWeek(
                                                                    new Date(
                                                                        selectedDate.getFullYear(),
                                                                        option -
                                                                            1,
                                                                        optionD,
                                                                    ),
                                                                ) +
                                                                '주차',
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateMonth(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월',
                                                        ),
                                                    )
                                                } else {
                                                    dispatch(
                                                        setDateDay(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                optionD +
                                                                '일',
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateWeek(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월 ' +
                                                                getWeek(
                                                                    new Date(
                                                                        selectedDate.getFullYear(),
                                                                        option -
                                                                            1,
                                                                        optionD,
                                                                    ),
                                                                ) +
                                                                '주차',
                                                        ),
                                                    )
                                                    dispatch(
                                                        setDateMonth(
                                                            selectedDate.getFullYear() +
                                                                '년 ' +
                                                                option +
                                                                '월',
                                                        ),
                                                    )
                                                }

                                                props.closeModal()
                                            }}
                                        >
                                            {optionD + '일'}
                                        </li>
                                    ),
                                )}
                            </ol>
                        </div>
                    ),
                )}
            </div>
        )
    }
}

export default CalenderContents
