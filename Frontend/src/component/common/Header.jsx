/* 

HEADER Component

props: loading(Boolean, Loading 컴포넌트에서 전달받음. Header가 사용된 곳이 Loading컴포넌트인지를 알려주는 용도)

메뉴 드롭다운 | 날짜 | 캘린더
선택된 날짜를 이용해 focusArray를 미리 계산해서 Calendar-CalendarContents로 넘겨줍니다.(CalendarContents에서 계산하면 계산 시간때문에 늦습니다.)
redux store에서 선택된 날짜를 받아옵니다.

*/

import React, { useState, useEffect } from 'react'
import DropdownMenu from './DropdownMenu'
import Calender from './Calender'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import {
    selectCurrentDateMonth,
    selectCurrentDateWeek,
    selectCurrentDateDay,
} from '../../services/date/dateSlice'
import { useLocation, Link } from 'react-router-dom'
import MokiLogo from '../../assets/moki_logo.svg'

const HEADER = (props) => {
    const location = useLocation()

    const storedDateMonth = useSelector(selectCurrentDateMonth)
    const storedDateWeek = useSelector(selectCurrentDateWeek)
    const storedDateDay = useSelector(selectCurrentDateDay)

    const selectedDate = new Date('2023-12-17') // 현재 날짜
    const ListMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // 배열의 값이 1인 인덱스의 tab이 기본으로 펼쳐진다.
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

    // 현재 선택된 달이 캘린더에서 자동으로 펼쳐지도록함
    const [focusArray, setFocusArray] = useState([2, 2, 2, 2, 2, 1])
    let array = []
    useEffect(() => {
        if (location.pathname.startsWith('/week')) {
            const formattedMonthStr = storedDateWeek.replace(
                /(\d{4})년 (\d{1,2})월 (\d{1,2})주차/,
                function (match, year, month, week) {
                    return month
                },
            )
            setFocusArray([])
            monthstate.map((month, index) => {
                if (month === parseInt(formattedMonthStr)) {
                    // 현재 선택된 달과 monthstate의 달이 같다면 1을 배열에 추가한다.
                    array[index] = 1
                } else {
                    array[index] = 2
                }
            })
            setFocusArray(array)
        } else if (location.pathname.startsWith('/day')) {
            const formattedMonthStr = storedDateDay.replace(
                /(\d{4})년 (\d{1,2})월 (\d{1,2})일/,
                function (match, year, month, day) {
                    return month
                },
            )
            setFocusArray([])
            monthstate.map((month, index) => {
                if (month === parseInt(formattedMonthStr)) {
                    // 현재 선택된 달과 monthstate의 달이 같다면 1을 배열에 추가한다.
                    array[index] = 1
                } else {
                    array[index] = 2
                }
            })
            setFocusArray(array)
        }
    }, [storedDateWeek, storedDateDay])

    const [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    if (location.pathname.startsWith('/month')) {
        return (
            <header className="fixed inset-x-0 z-20 flex top-0 bg-white/80 backdrop-blur-lg shadow-md items-center justify-between">
                <DropdownMenu />
                <button
                    onClick={openModal}
                    className="text-lg font-normal text-gray-900 text-center py-2"
                >
                    {storedDateMonth}
                    <p className="text-gray-400">🗒️ {props.dateRange}</p>
                </button>
                <Calender
                    isOpen={isOpen}
                    closeModal={closeModal}
                    openModal={openModal}
                />
            </header>
        )
    } else if (location.pathname.startsWith('/week')) {
        return (
            <header className="fixed inset-x-0 z-20 flex top-0 bg-white/80 backdrop-blur-lg shadow-md items-center justify-between">
                <DropdownMenu />
                <button
                    onClick={openModal}
                    className="text-lg font-normal text-gray-900 text-center py-2"
                >
                    {storedDateWeek}
                    <p className="text-gray-400">🗒️ {props.dateRange}</p>
                </button>
                <Calender
                    isOpen={isOpen}
                    closeModal={closeModal}
                    openModal={openModal}
                    array={focusArray}
                />
            </header>
        )
    } else if (location.pathname.startsWith('/day')) {
        return (
            <header className="fixed inset-x-0 z-20 flex top-0 bg-white/80 backdrop-blur-lg shadow-md items-center justify-between">
                <DropdownMenu />
                <button
                    onClick={openModal}
                    className="text-lg font-normal text-gray-900 text-center py-[22px]"
                >
                    {storedDateDay}
                    <p className="text-gray-400"></p>
                </button>
                <Calender
                    isOpen={isOpen}
                    closeModal={closeModal}
                    openModal={openModal}
                    array={focusArray}
                />
            </header>
        )
    } else if (
        location.pathname.startsWith('/setting') ||
        location.pathname.startsWith('/waiting-permission') ||
        location.pathname.startsWith('/no-permission') ||
        location.pathname.startsWith('/register')
    ) {
        return (
            <header className="fixed inset-x-0 z-20 flex top-0 bg-white/80 backdrop-blur-lg shadow-md items-center justify-between py-1">
                <DropdownMenu />
                <Link to="/">
                    <img
                        className=" h-16 w-16 pr-4"
                        src={MokiLogo}
                        alt="moki-logo"
                    />
                </Link>
            </header>
        )
    } else if (props.loading) {
        return (
            <header className="fixed inset-x-0 z-20 flex top-0 bg-white/80 backdrop-blur-lg shadow-md items-center justify-between py-2">
                <DropdownMenu />
            </header>
        )
    }
}

export default HEADER
