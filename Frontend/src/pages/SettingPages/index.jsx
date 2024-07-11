import React, { useState, useEffect } from 'react'
import DivisionLine from '../../component/common/DivisionLine'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BiggestDiffMenu from '../../component/contents/BiggestDiffMenu'
import TopButton from '../../component/common/TopButton'
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import { Link } from 'react-router-dom'
import { useUserInfoQuery } from '../../services/setting/settingApiSlice'

const SettingPages = () => {
    const { data: userInfo, isLoading, error } = useUserInfoQuery()

    return (
        <div className="bg-gray-200 h-screen">
            <section className="h-full p-5 lg:px-12 bg-gray-200 mb-16">
                <HEADER dateRange=" " />
                {/* 뒤로가기 제목 */}
                <div className="mt-[4.5rem] ">
                    <Link
                        to="/"
                        className="text-xl font-bold flex items-center gap-2"
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
                        ⚙️ 설정
                    </Link>
                </div>
                {/* 회원 정보 */}
                <div className="mt-6 bg-white shadow-md rounded-xl flex flex-col justify-center items-center p-8 gap-3">
                    {userInfo && (
                        <>
                            <span
                                className={
                                    (userInfo.state === 'PERMITTED'
                                        ? 'bg-green-300 text-green-800'
                                        : userInfo.state ===
                                          'WAITING_PERMISSION'
                                        ? 'bg-yellow-300 text-yellow-800'
                                        : 'bg-gray-300 text-gray-800') +
                                    ' font-bold py-2 px-4 rounded-3xl'
                                }
                            >
                                {userInfo.state === 'PERMITTED'
                                    ? '사용중'
                                    : userInfo.state === 'WAITING_PERMISSION'
                                    ? '승인대기'
                                    : '사용안함'}
                            </span>

                            <span className="text-gray-400">
                                만료기한 {userInfo.expirationDate}까지
                            </span>

                            <span className="mt-6 font-bold text-lg">
                                {userInfo.userName}
                            </span>

                            <span className="text-gray-400">
                                {userInfo.phone.replace(
                                    /(\d{3})(\d{4})(\d{4})/,
                                    '$1-****-$3',
                                )}
                            </span>

                            <span className="mt-6 font-bold text-lg">
                                {userInfo.branchName}
                            </span>

                            <span className="text-gray-400">
                                {userInfo.address}
                            </span>
                        </>
                    )}
                </div>
                <Link
                    to="edit-userinfo"
                    className="shadow-md font-bold text-lg mt-4 bg-white rounded-xl flex items-center p-4 gap-3"
                >
                    ✏️ 회원정보 수정
                </Link>
                <Link
                    to="apply"
                    className="shadow-md font-bold text-lg mt-4 bg-white rounded-xl flex items-center p-4 gap-3"
                >
                    ⭐ 서비스 신청
                </Link>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default SettingPages
