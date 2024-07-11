import React, { useState, useEffect, useRef } from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import TopButton from '../../component/common/TopButton'
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import { Link, useNavigate } from 'react-router-dom'
import CopyIcon from '../../assets/copy.svg'
import {
    useUserInfoQuery,
    useApplyMutation,
} from '../../services/setting/settingApiSlice'

const ApplyPages = () => {
    const navigate = useNavigate()

    // 회원정보 가져오기
    const {
        data: userInfo,
        isLoadingUserInfo,
        errorUserInfo,
    } = useUserInfoQuery()

    // 서비스 신청
    const [apply, { isLoading, error }] = useApplyMutation()

    const [name, setName] = useState(userInfo?.userName || '')
    const [phone, setPhone] = useState(userInfo?.phone || '')
    const [account, setAccount] = useState('대구 123467890')

    useEffect(() => {
        // userInfo 불러와지면 초기화
        if (userInfo) {
            setName(userInfo?.userName)
            setPhone(userInfo?.phone)
        }
    }, [userInfo])

    // 라디오 버튼의 선택 상태를 관리하는 상태 변수
    const [selectedOption, setSelectedOption] = useState(1)

    // 라디오 버튼 선택 핸들러
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
    }

    const [futureDates, setFutureDates] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        const currentDate = new Date()
        const futureDates = []
        // 1, 3, 6, 12개월 뒤의 날짜를 계산합니다.
        for (const monthsToAdd of [1, 3, 6, 12]) {
            const futureDate = new Date(currentDate)
            futureDate.setMonth(currentDate.getMonth() + monthsToAdd)
            futureDates.push(futureDate)
        }

        setFutureDates(futureDates)
        setOptions([
            {
                duration: 1,
                expire_date: futureDates[0].toISOString(),
                price: 15000,
            },
            {
                duration: 3,
                expire_date: futureDates[1].toISOString(),
                price: 15000,
            },
            {
                duration: 6,
                expire_date: futureDates[2].toISOString(),
                price: 72000,
            },
            {
                duration: 12,
                expire_date: futureDates[3].toISOString(),
                price: 126000,
            },
        ])
    }, [])

    // 신청하기 버튼
    async function handleSubmit(e) {
        e.preventDefault()
        console.log(options[parseInt(selectedOption) - 1])
        try {
            const response = await apply({
                month: options[parseInt(selectedOption) - 1].duration,
            })
            console.log(response)
            alert('서비스가 신청되었습니다. 승인이 완료될때까지 기다려주세요.')
            // error가 뜨는데 왜 navigate까지 실행되는거야; 중간에 끊기고 실행이 멈춰야지!
            navigate('/waiting-permission')
        } catch (err) {
            alert('에러가 발생했습니다. 다시 시도 해주세요.')
            console.log('error: ', err)
            if (!err?.status) {
                console.log('no response from server')
            } else if (err.status === 401) {
                console.log('unathorized 401')
            } else {
                console.log('EditUserInfo failed')
            }
        }
    }

    // 계좌번호 복사
    const textRef = useRef(null)

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(account)
            alert('텍스트가 클립보드에 복사되었습니다.')
        } catch (err) {
            console.error('텍스트 복사 실패:', err)
        }
    }

    return (
        <div className="bg-gray-200">
            <section className="h-full p-5 lg:px-12 bg-gray-200 mb-16">
                <HEADER dateRange=" " />
                {/* 뒤로가기 제목 */}
                <div className="mt-[4.5rem] ">
                    <Link
                        to="/setting"
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
                        ⭐ 서비스 신청
                    </Link>
                </div>
                {/* 회원 정보 */}

                <div
                    // onSubmit={}
                    className="mt-6 bg-white shadow-md rounded-xl flex flex-col justify-center items-center p-2 gap-3"
                >
                    <div className=""></div>
                    {/* 제목 */}
                    <h2 className="font-bold text-xl p-4 mt-4">
                        매출 분석 보고서 서비스 신청
                    </h2>
                    {/* 서비스 설명 */}
                    <ul className="list-disc mb-4 ">
                        <li>매출 분석과 시각화 제공</li>
                        <li> AI를 활용한 매출 예상 카카오</li>
                        <li>알림톡으로 보고서 링크 전송</li>
                    </ul>
                    {/* 서비스 사용 기간 선택 */}
                    <ul className="grid w-full gap-2 grid-cols-2 mt-4">
                        {/* 1번 item */}
                        <li>
                            <input
                                id="op1"
                                className="hidden peer"
                                type="radio"
                                name="options"
                                value="1"
                                checked={selectedOption === '1'}
                                onChange={handleOptionChange}
                                required
                            />
                            <label
                                for="op1"
                                className="inline-flex items-center justify-between w-full p-5  bg-white border border-gray-200 peer-checked:border-blue-600 peer-checked:text-blue-500 rounded-lg cursor-pointer "
                            >
                                <div className="block">
                                    <span className="bg-gray-100 text-xs py-1 px-3 rounded-lg">
                                        {'1개월'}
                                    </span>
                                    <div className="w-full text-sm text-gray-600 mt-3">
                                        만료기한
                                        <br />
                                        {'2024년 2월 20일'}까지
                                    </div>
                                    <div className="text-gray-400 mt-3">
                                        {' '}
                                        15,000원
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            {' '}
                                            15,000원
                                        </span>
                                        <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-3xl ml-2">
                                            {'10%'}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </li>
                        {/* 2번 item */}
                        <li>
                            <input
                                id="op2"
                                className="hidden peer"
                                type="radio"
                                name="options"
                                value="2"
                                checked={selectedOption === '2'}
                                onChange={handleOptionChange}
                            />
                            <label
                                // for에 들어가는게 input id임.
                                for="op2"
                                className="inline-flex items-center justify-between w-full p-5  bg-white border border-gray-200 peer-checked:border-blue-600 peer-checked:text-blue-500 rounded-lg cursor-pointer "
                            >
                                <div className="block">
                                    <span className="bg-gray-100 text-xs py-1 px-3 rounded-lg">
                                        {'3개월'}
                                    </span>
                                    <div className="w-full text-sm text-gray-600 mt-3">
                                        만료기한
                                        <br />
                                        {'2024년 2월 20일'}까지
                                    </div>
                                    <div className="text-gray-400 mt-3 line-through">
                                        {' '}
                                        45,000원
                                    </div>
                                    <div>
                                        <span className="font-bold text-red-500">
                                            {' '}
                                            15,000원
                                        </span>
                                        <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-3xl ml-2">
                                            {'10%'}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </li>
                        {/* 3번 item */}
                        <li>
                            <input
                                id="op3"
                                className="hidden peer"
                                type="radio"
                                name="options"
                                value="3"
                                checked={selectedOption === '3'}
                                onChange={handleOptionChange}
                            />
                            <label
                                for="op3"
                                className="inline-flex items-center justify-between w-full p-5  bg-white border border-gray-200 peer-checked:border-blue-600 peer-checked:text-blue-500 rounded-lg cursor-pointer "
                            >
                                <div className="block">
                                    <span className="bg-gray-100 text-xs py-1 px-3 rounded-lg">
                                        {'6개월'}
                                    </span>
                                    <div className="w-full text-sm text-gray-600 mt-3">
                                        만료기한
                                        <br />
                                        {'2024년 2월 20일'}까지
                                    </div>
                                    <div className="text-gray-400 mt-3">
                                        {' '}
                                        90,000원
                                    </div>
                                    <div>
                                        <span className="font-bold text-red-500">
                                            {' '}
                                            72,000원
                                        </span>
                                        <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-3xl ml-2">
                                            {'20%'}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </li>
                        {/* 4번 item */}
                        <li>
                            <input
                                id="op4"
                                className="hidden peer"
                                type="radio"
                                name="options"
                                value="4"
                                checked={selectedOption === '4'}
                                onChange={handleOptionChange}
                            />
                            <label
                                for="op4"
                                className="inline-flex items-center justify-between w-full p-5 bg-white border border-gray-200 peer-checked:border-blue-600 peer-checked:text-blue-500 rounded-lg cursor-pointer "
                            >
                                <div className="block">
                                    <span className="bg-gray-100 text-xs py-1 px-3 rounded-lg">
                                        {'12개월'}
                                    </span>
                                    <div className="w-full text-sm text-gray-600 mt-3">
                                        만료기한
                                        <br />
                                        {'2024년 2월 20일'}까지
                                    </div>
                                    <div className="text-gray-400 mt-3 tracking-tight">
                                        {' '}
                                        180,000원
                                    </div>
                                    <div>
                                        <span className="font-bold text-red-500 tracking-tight">
                                            {' '}
                                            126,000원
                                        </span>
                                        <span className="bg-red-500 text-white text-xs py-1 px-2 rounded-3xl ml-2">
                                            {'30%'}
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </li>
                    </ul>
                    <button
                        type="button"
                        onClick={handleCopyClick}
                        className="flex justify-center items-center text-center mt-6 px-4 py-2 font-bold border-gray-300 border rounded"
                    >
                        {/* 입금 계좌 안내 */}
                        <input
                            type="text"
                            ref={textRef}
                            value={account + ' 박찬식'}
                            readOnly
                            className="w-48 focus:outline-none"
                        />
                        <img src={CopyIcon} alt="copy-icon" />
                    </button>

                    <div className="flex flex-col">
                        {/* 입금자명 */}
                        <label className="mt-6 font-bold text-md">
                            입금자명(필수)
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            disabled
                            //onChange={(e) => setName(e.target.value)}
                            className="text-sm mb-4 w-60 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                            required
                        />
                        {/* 카카오 알림톡 수신 전화번호 */}
                        <label className="mt-6 font-bold text-md">
                            카카오 알림톡 수신 전화번호(필수)
                        </label>
                        <input
                            type="tel"
                            id="tel"
                            value={phone}
                            disabled
                            placeholder="공백과 - 없이 숫자로만 작성해주세요."
                            //onChange={(e) => setPhon(e.target.value)}
                            className="mb-6 text-sm w-60 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                            required
                        />

                        {/* 모두 확인했습니다. */}
                        <div className="flex items-center mt-6 mb-4">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                value=""
                                className="w-6 h-6 accent-green-600 rounded focus:ring-green-500"
                                required
                            />
                            <label
                                for="default-checkbox"
                                className="ml-2 text-sm font-bold text-gray-900"
                            >
                                모든 내용을 확인했습니다.
                            </label>
                        </div>
                        <p className=" pt-0 text-gray-600 text-xs">
                            신청 전 혹은 신청 후 반드시 입금해주세요. <br />
                            관리자가 입금을 확인한 뒤 승인완료 해드려야 <br />
                            서비스 사용이 가능합니다.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        to="edit-userinfo"
                        className="py-2 px-16 mb-8 text-center mt-4 bg-black text-white rounded-xl"
                    >
                        신청하기
                    </button>
                </div>
                {/* </div> */}

                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default ApplyPages
