/*


props: type("저장", "수정")

*/

import React, { useState, useEffect } from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import TopButton from '../../component/common/TopButton'
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import infoImg from '../../assets/info.svg'
import {
    useUserInfoQuery,
    useEditUserInfoMutation,
} from '../../services/setting/settingApiSlice'
import { useDaumPostcodePopup } from 'react-daum-postcode'

const EditUserInfo = (props) => {
    const navigate = useNavigate()
    const location = useLocation()

    // 기존 회원 정보 불러오기
    const { data: userInfo, isLoading, error } = useUserInfoQuery()
    console.log('userInfo: ', userInfo)
    // 회원정보 수정
    const [editUserInfo, { isLoadingEditUserInfo, errorEditUserInfo }] =
        useEditUserInfoMutation()

    // 회원정보 입력값
    const [name, setName] = useState(userInfo?.userName || '')
    const [phone, setPhone] = useState(userInfo?.phone || '')
    const [branchName, setBranchName] = useState(userInfo?.branchName || '')
    const [address, setAddress] = useState(userInfo?.address || '')

    useEffect(() => {
        // userInfo 불러와지면 초기화
        if (branchName === '' && userInfo) {
            setName(userInfo?.userName)
            setPhone(userInfo?.phone)
            setBranchName(userInfo?.branchName)
            setAddress(userInfo?.address)
        }
    }, [branchName, userInfo])

    // 신청하기 버튼
    async function handleSubmit(e) {
        e.preventDefault()
        const changedUserInfo = {
            branchName: branchName,
            userName: name,
            phone: phone,
            address: address,
        }
        try {
            const response = await editUserInfo({
                changedUserInfo,
            })
            console.log('response: ', response)

            if (location.pathname === '/register') {
                alert('회원 정보가 등록되었습니다. 서비스를 신청해주세요.')
                // 승인대기 페이지로 이동, 근데 이 코드 때문에 submit이 취소되었다고 자꾸 뜸
                navigate('/setting/apply')
            } else if (location.pathname === '/setting/edit-userinfo') {
                console.log(location.pathname)
                alert('회원 정보가 수정되었습니다.')
                // 승인대기 페이지로 이동, 근데 이 코드 때문에 submit이 취소되었다고 자꾸 뜸
                navigate('/setting')
            }
        } catch (err) {
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

    // daum postcode API
    const openDaumPostcode = useDaumPostcodePopup(
        'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
    )

    const handleComplete = (data) => {
        var fullAddress = data.address
        var extraAddress = ''

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname
            }
            if (data.buildingName !== '') {
                extraAddress +=
                    extraAddress !== ''
                        ? `, ${data.buildingName}`
                        : data.buildingName
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
        }
        setAddress(fullAddress)
        console.log(fullAddress) // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    }

    const handleSearchAddress = () => {
        openDaumPostcode({ onComplete: handleComplete })
    }

    return (
        <div className="bg-gray-200">
            <section className="h-full p-5 bg-white lg:px-12 mb-16">
                <HEADER dateRange=" " />
                {/* 뒤로가기 제목 */}
                <div className="mt-[4.5rem] ">
                    <Link
                        to={
                            location.pathname === '/register'
                                ? '/login'
                                : '/setting'
                        }
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
                        ✏️ 회원정보{props.type}
                    </Link>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center items-center mt-8"
                >
                    {location.pathname === '/register' ? (
                        <div className="flex mt-2 mb-6">
                            <img src={infoImg} className="mr-2" alt="info" />
                            <span className="text-xs text-neutral-400 text-base">
                                매출분석보고서 서비스에 처음 로그인하셨습니다.
                                <br />
                                최초 1회 회원정보등록이 필요합니다.
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex flex-col">
                        {/* 사용자 명 */}
                        <label className="mt-6 font-bold text-md">
                            이름(필수)
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-sm mb-4 w-74 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                            required
                        />
                        {/* 휴대폰 번호 */}
                        <label className="mt-6 font-bold text-md">
                            휴대폰 번호(필수)
                        </label>
                        <input
                            type="tel"
                            id="tel"
                            value={phone}
                            placeholder="공백과 - 없이 숫자로만 작성해주세요."
                            onChange={(e) => setPhone(e.target.value)}
                            className="mb-2 text-sm w-74 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                            required
                        />
                        {/* info */}
                        <div className="flex mt-2 mb-6">
                            <img src={infoImg} className="mr-2" alt="info" />
                            <span className="text-xs text-neutral-400 text-base">
                                카카오톡으로 보고서를 받을 번호를 입력해주세요.
                            </span>
                        </div>
                        {/* 매장명 */}
                        <label className="mt-6 font-bold text-md">매장명</label>
                        <input
                            type="text"
                            id="branchName"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            className="text-sm mb-4 w-74 p-2 py-3 my-4 border-b border-neutral-400 bg-gray-100 focus:outline-none"
                            disabled
                        />
                        {/* 매장 주소 */}
                        <label className="mt-6 font-bold text-md">
                            매장 주소(필수)
                        </label>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="text-sm w-full p-2 pr-8 py-4 border-b border-neutral-400 focus:outline-none"
                                required
                            />
                            {/* 주소 검색 버튼 */}
                            <button
                                type="button"
                                onClick={handleSearchAddress}
                                className="absolute right-0 top-1/3"
                            >
                                <span className="material-symbols-outlined">
                                    search
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        to="edit-userinfo"
                        className="py-2 px-16 mb-8 text-center mt-4 bg-black text-white rounded-xl"
                    >
                        {props.type}하기
                    </button>
                </form>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default EditUserInfo
