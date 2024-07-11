/*


filteredData
selectedRows
*/

import { useState, useEffect, useRef, Fragment } from 'react'
import { useTableSelection } from '../../../function/useTableSelection'
import { Dialog, Transition } from '@headlessui/react'
import {
    useUserListQuery,
    useExtendExpirePeriodMutation,
    useExpireUserMutation,
    useAdminEditUserInfoMutation,
} from '../../../services/admin/adminApiSlice'
import AdminModal from './AdminModal'
import infoImg from '../../../assets/info.svg'
import Spinner from '../../common/Spinner'
import { useDaumPostcodePopup } from 'react-daum-postcode'

const UserList = () => {
    const { data, isLoading, error } = useUserListQuery()
    const [filteredData, setfilteredData] = useState(
        data ? data.data.userDataList : [],
    )

    useEffect(() => {
        console.log(
            'User List: \n',
            '✔️data: ',
            data,
            '✔️isLoading:',
            isLoading,
            '✔️error: ',
            error,
        )
        //화면 처음 렌더링(새로고침 시) userList가 바로 뜨지않는 문제를 해결함. data가 받아지기전에는 []로 초기화되기때문
        // filteredData가 [] 이고 data가 undefined가 아니면
        if (filteredData.length === 0 && data) {
            setfilteredData(data.data.userDataList)
        }
    }, [data, isLoading, error, filteredData])

    const [EditUserInfo, { isLoadingEditUserInfo, isErrorEditUserInfo }] =
        useAdminEditUserInfoMutation()
    const [expireUser, { isLoadingExpireUser, isErrorExpireUser }] =
        useExpireUserMutation() // id
    const [
        extendExpirePeriod,
        { isLoadingExtendExpirePeriod, isErrorExtendExpirePeriod },
    ] = useExtendExpirePeriodMutation() // id, date

    // 카테고리 드롭다운
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const categoryRef = useRef(null)

    const toggleDropdown = () => {
        console.log('isOpen', isOpen)
        setIsOpen(!isOpen)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !categoryRef.current.contains(event.target)
            ) {
                closeDropdown()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // 카테고리 선택
    const [selectedCategory, setSelectedCategory] =
        useState('Select categories')
    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
        setIsOpen(false)
    }

    function filterDataByKeyValue(data, key, value) {
        if (key === 'no') {
            value = parseInt(value)
        } else if (key === 'phone') {
            value = parseInt(value)
        }
        return data.filter((item) => item[key]?.includes(value))
    }

    // 검색 입력값
    const [searchInputValue, setsearchInputValue] = useState('')
    const handleInputChange = (event) => {
        // 입력 값이 변경될 때마다 호출되는 이벤트 핸들러
        const newValue = event.target.value
        setsearchInputValue(newValue) // 입력 값 업데이트
    }

    // 검색 버튼
    function handleSearchClick(e) {
        e.preventDefault()
        console.log(data.data.userDataList, selectedCategory, searchInputValue)
        if (data) {
            setfilteredData(
                filterDataByKeyValue(
                    data.data.userDataList,
                    selectedCategory,
                    searchInputValue,
                ),
            )
        }
        console.log('filteredData: ', filteredData)
    }

    // 검색 초기화 버튼
    function handleRefreshClick() {
        setfilteredData(data.data.userDataList)
        setsearchInputValue('')
        setSelectedCategory('Select categories')
    }

    // 테이블 행 선택 --------------------
    const {
        selectedRows,
        selectAll,
        selectedData,
        toggleRowSelection,
        handleRowClick,
        toggleSelectAll,
    } = useTableSelection([], data ? data.data.userDataList : [])
    // 모달 -----------------------------------------------------------------------------------------

    const [open, setOpen] = useState(false) // 선택 승인 모달 open 상태
    const [openDelete, setOpenDelete] = useState(false) // 선택 삭제 모달 open 상태
    const [openExpire, setOpenExpire] = useState(false) // 선택 삭제 모달 open 상태
    const [openEditUserInfo, setOpenEditUserInfo] = useState(false) // 회원정보수정 모달 open 상태

    // 선택 기간 연장
    async function handleSelectExtend() {
        console.log('기간 연장')
        const currentExpirationDate = new Date(selectedData[0]?.expirationDate)
        const numSelectedOption = parseInt(selectedOption)

        if (!isNaN(numSelectedOption)) {
            // n 개월 추가
            const modifiedExpirationDate = new Date(currentExpirationDate)
            modifiedExpirationDate.setMonth(
                currentExpirationDate.getMonth() + numSelectedOption,
            )
            // yyyy-mm-dd 형식으로 변환
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
            const formatter = new Intl.DateTimeFormat('en-US', options)

            const [{ value: month }, , { value: day }, , { value: year }] =
                formatter.formatToParts(modifiedExpirationDate)

            const formattedDate = `${year}-${month}-${day}`
            try {
                const response = extendExpirePeriod({
                    id: parseInt(selectedRows) + 1,
                    date: formattedDate,
                }).unwrap()
                console.log(response)
            } catch (err) {
                console.log('error: ', err)
                if (!err?.status) {
                    console.log('서버로부터 응답이 없습니다.')
                } else if (err.status === 401) {
                    console.log('unathorized 401')
                } else {
                    console.log('extendExpirePeriod failed')
                }
            }
        } else {
            alert('추가할 개월 수를 숫자를 입력해주세요.')
        }

        setOpen(false)
    }

    // 선택 삭제
    async function handleSelectDelete() {
        console.log('선택 삭제')
        setOpenDelete(false)
    }

    // 사용자 즉시 만료
    async function handleExpireUser(e) {
        e.preventDefault()

        console.log('사용기간 즉시 만료 id:', userIdToEdit)
        try {
            const response = await expireUser(userIdToEdit).unwrap()
            console.log('response', response)
        } catch (err) {
            console.log('error: ', err)
            if (!err?.status) {
                console.log('서버로부터 응답이 없습니다.')
            } else if (err.status === 401) {
                console.log('unathorized 401')
            } else {
                console.log('expireUser failed')
            }
        }

        setOpenExpire(false)
    }

    const [userIdToEdit, setUserIdToEdit] = useState()
    // 회원정보수정
    async function handleEditUserInfo(e) {
        // e.preventDefault()
        const info = {
            id: userIdToEdit,
            branchName: branchName,
            userName: name,
            phone: phone,
            address: address,
        }

        try {
            const response = await EditUserInfo({
                id: userIdToEdit,
                info,
            }).unwrap()
            console.log('response', response)

            // alert('회원 정보가 수정되었습니다.')
        } catch (err) {
            console.log('error: ', err)
            if (!err?.status) {
                console.log('서버로부터 응답이 없습니다.')
            } else if (err.status === 401) {
                console.log('unathorized 401')
            } else {
                console.log('EditUserInfo failed')
            }
        }
        setOpenEditUserInfo(false)
    }
    // 기간 연장 입력값
    const [selectedOption, setSelectedOption] = useState('option1')
    const [customValue, setCustomValue] = useState('')
    console.log('selectedOption', selectedOption, selectedRows)

    // 회원정보수정 입력값

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [branchName, setBranchName] = useState('')
    const [address, setAddress] = useState('')
    const [approvalDate, setApprovalDate] = useState('')
    const [expirationDate, setExpirationDate] = useState('')

    const cancelButtonRef = useRef(null)

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

    if (isLoading) {
        return (
            <tbody>
                <tr>
                    <Spinner />
                </tr>
            </tbody>
        )
    }

    // Check if there is no data to display
    if (error) {
        return <div>error</div>
    }

    return (
        <div className="p-4 pt-16">
            {/* 타이틀 */}
            <span className="text-3xl font-bold">사용자 조회</span>
            {/* 기간 연장 모달 */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    {/* 어두운 배경 */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 transition-opacity" />
                    </Transition.Child>
                    {/* 모달창 */}
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <span className="material-symbols-outlined text-green-600">
                                                    done
                                                </span>
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900"
                                                >
                                                    선택 사용자 기간 연장
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        선택한 사용자의
                                                        사용기간을 연장
                                                        하시겠습니까? 현재
                                                        서비스 이용 상태가
                                                        '사용중'인 사용자에게만
                                                        적용됩니다.
                                                    </p>
                                                    <div className="my-6">
                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                value="1"
                                                                checked={
                                                                    selectedOption ===
                                                                    '1'
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedOption(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <span className="ml-2">
                                                                1개월
                                                            </span>
                                                        </label>

                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                value="3"
                                                                checked={
                                                                    selectedOption ===
                                                                    '3'
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedOption(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <span className="ml-2">
                                                                3개월
                                                            </span>
                                                        </label>
                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                value="6"
                                                                checked={
                                                                    selectedOption ===
                                                                    '6'
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedOption(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <span className="ml-2">
                                                                6개월
                                                            </span>
                                                        </label>
                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                value="12"
                                                                checked={
                                                                    selectedOption ===
                                                                    '12'
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedOption(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <span className="ml-2">
                                                                12개월
                                                            </span>
                                                        </label>
                                                        <br />
                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                value={
                                                                    customValue
                                                                }
                                                                checked={
                                                                    selectedOption ===
                                                                    customValue
                                                                }
                                                                onChange={(e) =>
                                                                    setSelectedOption(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                value={
                                                                    customValue
                                                                }
                                                                // disabled={
                                                                //     selectedOption ===
                                                                //     customValue
                                                                //         ? false
                                                                //         : true
                                                                // }
                                                                placeholder="직접 입력(숫자만 입력 예:2)"
                                                                onChange={(e) =>
                                                                    setCustomValue(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="ml-2 w-72"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 sm:ml-3 sm:w-auto"
                                            onClick={() => handleSelectExtend()}
                                        >
                                            선택 연장
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            취소
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* 선택 삭제 모달 */}
            <AdminModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onApprove={handleSelectDelete}
                color="red"
                title="선택 삭제"
                content="선택한 모든 사용자
                삭제하시겠습니까? 삭제된
                사용자는 되돌릴 수
                없습니다."
                btnText="선택 삭제"
            />
            {/* 사용기간 즉시 만료 모달 */}
            <AdminModal
                open={openExpire}
                onClose={() => setOpenExpire(false)}
                onApprove={handleExpireUser}
                color="red"
                title="사용기간 즉시 만료"
                content="선택한 사용자의 사용기간을 즉시 만료시키시겠습니까?"
                btnText="만료"
            />
            {/* 회원정보수정 모달 */}
            <Transition.Root show={openEditUserInfo} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpenEditUserInfo}
                >
                    {/* 어두운 배경 */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-30 transition-opacity" />
                    </Transition.Child>
                    {/* 모달창 */}
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <form
                                        onSubmit={handleEditUserInfo}
                                        // className="flex flex-col justify-center items-center mt-8 text-sm text-gray-500"
                                    >
                                        <div className="flex flex-col justify-center items-center mt-8 text-sm text-gray-500 bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="flex flex-row gap-3 text-base font-semibold leading-6 text-gray-900"
                                                    >
                                                        <div className="mx-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-8 sm:w-8">
                                                            <span className="material-symbols-outlined text-green-600">
                                                                done
                                                            </span>
                                                        </div>
                                                        회원정보수정
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <div className="flex flex-col">
                                                            {/* 사용자 명 */}
                                                            <label className="mt-6 font-bold text-md">
                                                                이름(필수)
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                value={name}
                                                                onChange={(e) =>
                                                                    setName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="text-sm mb-4 w-74 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                                                                required
                                                            />
                                                            {/* 휴대폰 번호 */}
                                                            <label className="mt-6 font-bold text-md">
                                                                휴대폰
                                                                번호(필수)
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                id="tel"
                                                                value={phone}
                                                                placeholder="공백과 - 없이 숫자로만 작성해주세요."
                                                                onChange={(e) =>
                                                                    setPhone(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="mb-2 text-sm w-74 p-2 py-4 border-b border-neutral-400 focus:outline-none"
                                                                required
                                                            />
                                                            {/* info */}
                                                            <div className="flex mt-2 mb-6">
                                                                <img
                                                                    src={
                                                                        infoImg
                                                                    }
                                                                    className="mr-2"
                                                                    alt="info"
                                                                />
                                                                <span className="text-xs text-neutral-400 text-base">
                                                                    카카오톡으로
                                                                    보고서를
                                                                    받을 번호를
                                                                    입력해주세요.
                                                                </span>
                                                            </div>
                                                            {/* 매장명 */}
                                                            <label className="mt-6 font-bold text-md">
                                                                매장명
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="branchName"
                                                                value={
                                                                    branchName
                                                                }
                                                                onChange={(e) =>
                                                                    setBranchName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
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
                                                                    value={
                                                                        address
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setAddress(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="text-sm w-full p-2 pr-8 py-4 border-b border-neutral-400 focus:outline-none"
                                                                    required
                                                                />
                                                                {/* 주소 검색 버튼 */}
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleSearchAddress
                                                                    }
                                                                    className="absolute right-0 top-1/3"
                                                                >
                                                                    <span className="material-symbols-outlined">
                                                                        search
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            {/* 회원 만료 */}
                                                            <button
                                                                onClick={
                                                                    handleExpireUser
                                                                }
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
                                                            >
                                                                사용 기간
                                                                즉시만료
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="submit"
                                                to="edit-userinfo"
                                                className="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                                            >
                                                수정
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() =>
                                                    setOpenEditUserInfo(false)
                                                }
                                                ref={cancelButtonRef}
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* 검색 */}
            <form className="mt-8 w-9/12">
                <div className="flex">
                    {/* 카테고리 */}

                    <button
                        ref={categoryRef}
                        id="dropdown-button"
                        onClick={toggleDropdown}
                        className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
                        type="button"
                    >
                        {selectedCategory}
                        <svg
                            className={`w-2.5 h-2.5 ml-2.5 ${
                                isOpen ? 'transform rotate-180' : ''
                            }`}
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
                    {/* 카테고리 드롭다운 목록 */}
                    {isOpen && (
                        <div
                            ref={dropdownRef}
                            id="dropdown"
                            className="absolute mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                        >
                            <ul
                                className="py-2 text-sm text-gray-700"
                                aria-labelledby="dropdown-button"
                            >
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                'Select categories',
                                            )
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory ===
                                            'Select categories'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        Select categories
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('state')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'state'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        state
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('userName')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'userName'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        userName
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('branchName')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'branchName'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        branchName
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('phone')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'phone'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        phone
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('address')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'address'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        address
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick('approvalDate')
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory === 'approvalDate'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        approvalDate
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                'expirationDate',
                                            )
                                        }
                                        className={`inline-flex w-full px-4 py-2 hover:bg-gray-100 ${
                                            selectedCategory ===
                                            'expirationDate'
                                                ? 'font-bold'
                                                : ''
                                        }`}
                                    >
                                        expirationDate
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="relative w-full">
                        {/* 검색 박스 */}
                        <input
                            type="search"
                            id="search-dropdown"
                            disabled={selectedCategory === 'Select categories'}
                            value={searchInputValue}
                            onChange={handleInputChange}
                            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                            placeholder={
                                selectedCategory === 'phone'
                                    ? '-를 제외하고 입력해주세요.'
                                    : selectedCategory === 'approvalDate' ||
                                      selectedCategory === 'expirationDate'
                                    ? '2000-01-01 형식으로 입력해주세요.'
                                    : '카테고리를 선택하고 찾고싶은 내용을 입력하세요.'
                            }
                            required
                        />
                        {/* form 제출 */}
                        <button
                            type="submit"
                            onClick={(e) => handleSearchClick(e)}
                            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                    {/* 초기화 버튼 */}
                    <button
                        type="button"
                        onClick={handleRefreshClick}
                        className="flex items-center bg-blue-100 rounded-3xl px-2 ml-4"
                    >
                        <span className="material-symbols-outlined">
                            refresh
                        </span>
                    </button>
                </div>
            </form>
            <div className="flex justify-between mt-12 items-center ">
                {/* 테이블 설명 */}
                <div className="text-gray-500">
                    사용자 총 {data?.data.userDataList.length}명, 선택된 사용자{' '}
                    {selectedRows.length}명
                </div>
                <div>
                    {/* 버튼 */}
                    <button
                        onClick={() => {
                            if (selectedRows.length === 1) {
                                setOpen(true)
                            } else {
                                alert('행 1개를 선택해주십시오')
                            }
                        }}
                        className="bg-blue-700 text-white text-xs py-1.5 w-28 rounded-lg mr-2 shadow hover:bg-blue-600"
                    >
                        기간 연장
                    </button>
                    <button
                        onClick={() => {
                            if (selectedRows.length >= 1) {
                                setOpenDelete(true)
                            } else {
                                alert('선택된 행이 0개 입니다.')
                            }
                        }}
                        className="border border-1 border-gray-200 text-xs py-1.5  w-28 rounded-lg mr-2 shadow hover:bg-gray-100"
                    >
                        선택 삭제
                    </button>
                    <button className="bg-gray-800 text-white text-xs py-1.5 w-28 shadow rounded-lg mr-2 hover:bg-gray-600">
                        엑셀 다운로드
                    </button>
                </div>
            </div>
            {/* 사용자 테이블 */}
            <div className=" mt-4">
                <table className=" w-full mb-12">
                    <thead className="m-4">
                        <tr className="border-b border-neutral-500 text-sm text-neutral-900">
                            <th className="w-20 py-3 font-light">
                                {/* 전체 선택 */}
                                <input
                                    id="checked-checkbox"
                                    type="checkbox"
                                    value=""
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </th>
                            <th className="w-10 py-3 font-light">No</th>
                            <th className="px-4 py-3 font-light">ㅤ</th>
                            <th className="px-4 py-3 font-light">state</th>
                            <th className="px-4 py-3 font-light">userName</th>
                            <th className="px-4 py-3 font-light">branchName</th>
                            <th className="px-4 py-3 font-light">phone</th>
                            <th className="px-4 py-3 font-light">address</th>
                            <th className="px-4 py-3 font-light">
                                approvalDate
                            </th>
                            <th className="px-4 py-3 font-light">
                                expirationDate
                            </th>
                        </tr>
                    </thead>
                    <tbody className=" text-gray-700">
                        {/* 데이터 */}
                        {filteredData.map((item, key) => {
                            return (
                                <tr
                                    onClick={() => handleRowClick(key)}
                                    // 이 행이 선택되면 배경색 진하게 변경
                                    className={
                                        selectedRows.includes(key)
                                            ? 'bg-gray-100'
                                            : ''
                                    }
                                    key={key}
                                >
                                    {/* 선택 */}
                                    <td className="py-6 text-center">
                                        <input
                                            id="checked-checkbox"
                                            type="checkbox"
                                            value=""
                                            checked={selectedRows.includes(key)}
                                            onChange={() =>
                                                toggleRowSelection(key)
                                            }
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </td>
                                    {/* No */}
                                    <td className="text-center">{key + 1}</td>
                                    {/* 수정 버튼 */}
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // 회원정보수정 form의 내용을 기존 변경전 정보로 채움
                                                setUserIdToEdit(item.id)
                                                setOpenEditUserInfo(true)
                                                setName(item.userName)
                                                setPhone(item.phone)
                                                setBranchName(item.branchName)
                                                setAddress(item.address)
                                                setApprovalDate(
                                                    item.approvalDate,
                                                )
                                                setExpirationDate(
                                                    item.expirationDate,
                                                )
                                            }}
                                            className="border-b border-gray-700 text-xs px-1"
                                        >
                                            수정
                                        </button>
                                    </td>
                                    {/* 상태 */}
                                    <td className="text-center">
                                        <span
                                            className={
                                                (item.state === 'PERMITTED'
                                                    ? 'bg-green-100 text-green-600'
                                                    : item.state ===
                                                      'WAITING_PERMISSION'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-gray-100 text-gray-600') +
                                                ' text-xs py-1 px-2 rounded-3xl'
                                            }
                                        >
                                            {item.state === 'PERMITTED'
                                                ? '사용중'
                                                : item.state ===
                                                  'WAITING_PERMISSION'
                                                ? '승인대기'
                                                : '사용안함'}
                                        </span>
                                    </td>
                                    {/* 이름 */}
                                    <td className="text-center">
                                        {item.userName}
                                    </td>
                                    {/* 지점명 */}
                                    <td className="text-center">
                                        {item.branchName}
                                    </td>
                                    {/* 전화번호 */}
                                    <td className="text-center">
                                        {item.phone?.replace(
                                            /(\d{3})(\d{4})(\d{4})/,
                                            '$1-$2-$3',
                                        )}
                                    </td>
                                    {/* 주소 */}
                                    <td className="text-center">
                                        {item.address.length > 12
                                            ? item.address.substring(0, 12) +
                                              '...'
                                            : item.address}
                                    </td>
                                    {/* 가입일 */}
                                    <td className="text-center">
                                        {item.approvalDate}
                                    </td>
                                    {/* 탈퇴일 */}
                                    <td className="text-center">
                                        {item.expirationDate}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserList
