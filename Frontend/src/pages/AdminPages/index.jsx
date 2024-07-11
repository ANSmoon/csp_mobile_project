import { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import MokiIcon from '../../assets/moki_logo.svg'
import UserList from '../../component/contents/admin/UserList'
import ApplyManagement from '../../component/contents/admin/ApplyManagement'
import BannerManagement from '../../component/contents/admin/BannerManagement'
import { useApplyListQuery } from '../../services/admin/adminApiSlice'
import { useUserInfoQuery } from '../../services/setting/settingApiSlice'
const AdminPages = () => {
    const navigate = useNavigate()
    const { data, isLoading, isError } = useApplyListQuery()

    const numOfWaitingPermission = data?.data.userDataList.length
    const { data: userInfo, isLoadingUser, isErrorUser } = useUserInfoQuery()
    useEffect(() => {}, [data, userInfo])

    const [isOpenUserManagement, setIsOpenUserManagement] = useState(true)
    function handleMultiLevelMenu() {
        setIsOpenUserManagement(!isOpenUserManagement)
    }

    const location = useLocation()

    const contents = () => {
        if (location.pathname === '/admin/user-list') {
            return <UserList />
        } else if (location.pathname === '/admin/apply-management') {
            return <ApplyManagement />
        } else if (location.pathname === '/admin/banner-management') {
            return <BannerManagement />
        }
    }

    // 로그아웃
    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('login-token')
        navigate('/login')
    }
    const [closeDropdown, setCloseDropdown] = useState(true)
    const handleCloseDropdown = () => {
        setCloseDropdown(false)
    }

    return (
        <div className="grid grid-row-2">
            {/* 헤더 */}
            <header className="fixed z-10 w-full flex justify-between bg-gray-800 text-gray-300 text-sm p-4">
                <div></div>

                <span>
                    관리자ㅤ{userInfo?.userName}ㅤㅤ|ㅤㅤ
                    <button onClick={handleLogout}>로그아웃</button>
                </span>
            </header>

            {/* 사이드바 */}
            <aside
                id="cta-button-sidebar"
                className="fixed top-12 left-0 z-0 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                    <ul className="space-y-2 font-medium">
                        {/* 사용자 관리 */}
                        <li>
                            <button
                                onClick={handleMultiLevelMenu}
                                type="button"
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 "
                                aria-controls="dropdown-example"
                                data-collapse-toggle="dropdown-example"
                            >
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 18"
                                >
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                                    사용자 관리
                                    {/* 배지 */}
                                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-yellow-600 bg-yellow-100 rounded-full ">
                                        {numOfWaitingPermission}
                                    </span>
                                </span>
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {/* 사용자 관리의 하위 메뉴 */}
                            <ul
                                id="dropdown-example"
                                className={
                                    (isOpenUserManagement ? '' : 'hidden') +
                                    ' py-2 space-y-2'
                                }
                            >
                                <li>
                                    <Link
                                        to="/admin/user-list"
                                        className={
                                            (location.pathname ===
                                            '/admin/user-list'
                                                ? 'bg-gray-100 '
                                                : '') +
                                            'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 '
                                        }
                                    >
                                        사용자 조회
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/apply-management"
                                        className={
                                            (location.pathname ===
                                            '/admin/apply-management'
                                                ? 'bg-gray-100 '
                                                : '') +
                                            'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 '
                                        }
                                    >
                                        서비스 신청내역
                                        {/* 배지 */}
                                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-yellow-600 bg-yellow-100 rounded-full ">
                                            {numOfWaitingPermission}
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        {/* 배너 관리 */}
                        <li>
                            <Link
                                to="/admin/banner-management"
                                className={
                                    (location.pathname ===
                                    '/admin/banner-management'
                                        ? 'bg-gray-100 '
                                        : '') +
                                    'flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 '
                                }
                            >
                                <svg
                                    className={
                                        (location.pathname ===
                                        '/admin/banner-management'
                                            ? 'text-gray-900 '
                                            : '') +
                                        'flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 '
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">
                                    배너 관리
                                </span>
                            </Link>
                        </li>
                    </ul>
                    {/* 팝업창 */}
                    {closeDropdown ? (
                        <div
                            id="dropdown-cta"
                            className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
                            role="alert"
                        >
                            <div className="flex items-center mb-3">
                                <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
                                    Beta
                                </span>
                                <button
                                    onClick={handleCloseDropdown}
                                    type="button"
                                    className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                                    data-dismiss-target="#dropdown-cta"
                                    aria-label="Close"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="w-2.5 h-2.5"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
                                관리자 페이지의 베타 버전입니다. 사용자 등록,
                                수정, 삭제 등 사용자 관리 서비스를 제공합니다.
                            </p>
                            <Link
                                className="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                to="/"
                            ></Link>
                        </div>
                    ) : (
                        <></>
                    )}

                    {/* 회사 로고 */}
                    <img
                        src={MokiIcon}
                        alt="moki-logo"
                        className="fixed bottom-20 left-8 text-white h-8 w-auto"
                    />
                </div>
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    {contents()}
                </div>
            </div>
        </div>
    )
}

export default AdminPages
