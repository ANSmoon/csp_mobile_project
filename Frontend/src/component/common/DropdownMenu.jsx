/* 

DropdownMenu Component

- 로그아웃
- 바로가기 버튼 목록

*/

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentIsNowState } from '../../services/date/dateSlice'
import MenuIcon from '../../assets/bars.svg'
import SettingIcon from '../../assets/setting.svg'

function DropdownMenu() {
    const navigate = useNavigate()
    const location = useLocation()
    const listForNow = [
        ['이번 매출', '#a1'],
        ['매출 예상과 실제 매출 비교', '#a2'],
        ['매출 예상', '#a3'],
        ['가장 많이 팔린 메뉴', '#a4'],
        ['직전 대비 가장 많이/적게 팔린 메뉴', '#a5'],
    ]
    const listForPast = [
        ['이번 매출', '#a1'],
        ['가장 많이 팔린 메뉴', '#a4'],
        ['직전 대비 가장 많이/적게 팔린 메뉴', '#a5'],
    ]

    const storeName = localStorage.getItem('store-name')

    const [isOpen, setIsOpen] = useState(false)
    // isOpen 토글
    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    // reportPages의 특정 element로 스크롤 이동
    const scrollToElement = (e, id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // 요소를 세로축 중앙으로 위치시킴
                inline: 'center', // 요소를 가로축 중앙으로 위치시킴
            })
        }
        e.stopPropagation() // 버블링 문제 해결
    }

    // 로그아웃
    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('login-token')
        navigate('/login')
    }

    const isNowState = useSelector(selectCurrentIsNowState)
    const scrollToElementContent = () => {
        if (
            // report pages에 있으면 바로가기를 띄운다.
            location.pathname === '/month' ||
            location.pathname === '/week' ||
            location.pathname === '/day'
        ) {
            return (isNowState ? listForNow : listForPast).map(
                ([title, id], key) => (
                    <li className="p-2" key={key}>
                        <button
                            onClick={(e) => scrollToElement(e, id)}
                            href={id}
                            className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-900"
                        >
                            {title}
                        </button>
                    </li>
                ),
            )
        }
    }

    return (
        <div className="p-2.5">
            {/* 메뉴 아이콘 */}
            <button onClick={toggleDropdown}>
                <img src={MenuIcon} alt="MenuIcon" />
            </button>
            {/* 메뉴 */}
            {isOpen && (
                <ul className="absolute p-4 float-left rounded-2xl bg-white shadow-md">
                    <li className="px-3 pb-4 flex flex-row justify-between border-b border-gray-200">
                        {/* 로그아웃 */}
                        <button
                            onClick={handleLogout}
                            className="flex text-lg font-bold items-center gap-x-4 "
                        >
                            <svg
                                className="w-4 h-4 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 8 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                                />
                            </svg>
                            <p>로그아웃</p>
                        </button>
                        {/* 창 닫기 */}
                        <button
                            type="button"
                            className="float-right text-gray-300 "
                            onClick={toggleDropdown}
                        >
                            ✕
                        </button>
                    </li>

                    {/* 선택한 컴포넌트로 자동 스크롤 */}
                    {scrollToElementContent()}

                    {/* 하단 정보 */}
                    <div className="grid grid-cols-2 items-center mt-6">
                        {/* 설정페이지로 이동 */}
                        <Link
                            to="/setting"
                            className="p-2 rounded-xl flex hover:bg-gray-100"
                        >
                            <img src={SettingIcon} alt="SettingIcon" />
                            <label className="ml-2 text-gray-500 font-bold">
                                설정
                            </label>
                        </Link>

                        {/* 지점명 */}
                        <div className="flex justify-end p-2">
                            <span className="text-gray-400 text-sm">
                                {storeName}
                            </span>
                        </div>
                    </div>
                </ul>
            )}
        </div>
    )
}

export default DropdownMenu
