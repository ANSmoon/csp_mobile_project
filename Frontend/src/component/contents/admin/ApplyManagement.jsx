import { useState, useEffect, useRef } from 'react'
import { useTableSelection } from '../../../function/useTableSelection'
import {
    useApplyListQuery,
    useApproveMultiUsersMutation,
} from '../../../services/admin/adminApiSlice'
import AdminModal from './AdminModal'
import Spinner from '../../common/Spinner'

const ApplyManagement = () => {
    // 서비스 신청 내역 목록
    const { data, isLoading, isError } = useApplyListQuery()

    useEffect(() => {
        console.log('Apply List: ', data, isLoading, isError)
    }, [data, isLoading, isError])

    // 낱개 승인 id
    const [userIdToPermit, setUserIdToPermit] = useState()

    // 선택 승인(다중 승인) idList
    const [
        approveMultiUsers,
        { isLoadingApproveMultiUsers, isErrorApproveMultiUsers },
    ] = useApproveMultiUsersMutation()
    // 선택 삭제

    // 테이블 행 선택 --------------------
    const {
        selectedRows,
        selectAll,
        toggleRowSelection,
        handleRowClick,
        toggleSelectAll,
    } = useTableSelection([], data ? data.data.userDataList : [])

    // 모달 -----------------------------------------------------------------------------------------
    const [open, setOpen] = useState(false) // 선택 승인 모달 open 상태
    const [openDelete, setOpenDelete] = useState(false) // 선택 삭제 모달 open 상태
    const [openSelect, setOpenSelect] = useState(false)

    // 낱개 승인
    function handlePermit(e) {
        //e.stopPropagation()
        console.log('낱개 승인, userID to permit:', userIdToPermit)
        approveMultiUsers(userIdToPermit)
        setOpen(false)
    }
    // 선택 승인
    function handleSelectPermit() {
        // selectedRows는 인덱스 번호. 이 인덱스 번호에 해당하는 item의 id를 골라서 전달해서 승인한다.
        console.log(
            '선택 승인, userID to permit',
            selectedRows.map((index) => modifiedData[index].id),
        )
        approveMultiUsers([selectedRows.map((index) => modifiedData[index].id)])
        setOpenSelect(false)
    }

    // 선택 삭제
    function handleSelectDelete() {
        console.log('선택 삭제')
        setOpenDelete(false)
    }

    // 모든 사용자에 대해 duration과 price를 계산함
    const priceByDuration = [
        { duration: 1, price: 15000 },
        { duration: 3, price: 15000 },
        { duration: 6, price: 72000 },
        { duration: 12, price: 126000 },
    ]
    const modifiedData = data?.data.userDataList.map((item) => {
        // 년도와 월을 기준으로 월 차이 계산
        const ap_date = new Date(item.approvalDate)
        const ex_date = new Date(item.expirationDate)
        const year1 = ap_date.getFullYear()
        const month1 = ap_date.getMonth()
        const year2 = ex_date.getFullYear()
        const month2 = ex_date.getMonth()
        const durationMonth = (year2 - year1) * 12 + (month2 - month1)

        // 월 차이를 기준으로 가격 파싱
        const priceObj = priceByDuration.find(
            (item) => item.duration === durationMonth,
        )
        return {
            ...item,
            duration: durationMonth,
            price: priceObj.price,
        }
    })

    const contents = () => {
        if (isLoading) {
            return (
                <tbody>
                    <tr>
                        <Spinner />
                    </tr>
                </tbody>
            )
        } else if (isError) {
            return (
                <tbody>
                    <tr></tr>
                </tbody>
            )
        } else if (modifiedData) {
            return (
                <tbody className=" text-gray-700">
                    {/* 데이터 */}
                    {modifiedData.map((item, key) => {
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
                                        checked={selectedRows.includes(key)}
                                        onChange={() => toggleRowSelection(key)}
                                        value=""
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </td>
                                {/* No */}
                                <td className="text-center">{key + 1}</td>
                                {/* 승인 */}
                                <td className="text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOpen(true)
                                            setUserIdToPermit(item.id)
                                        }}
                                        className="bg-blue-700 text-white text-xs py-1 px-4 rounded-lg hover:bg-blue-600 "
                                    >
                                        승인
                                    </button>
                                </td>
                                {/* duration month */}
                                <td className="text-center">
                                    {item.duration}개월
                                </td>
                                {/* expected payment */}
                                <td className="text-center">
                                    {item.price.toLocaleString(1000)}원
                                </td>
                                {/* name */}
                                <td className="text-center">{item.userName}</td>
                                {/* branchName */}
                                <td className="text-center">
                                    {item.branchName}
                                </td>
                                {/* phone */}
                                <td className="text-center">
                                    {item.phone.replace(
                                        /(\d{3})(\d{4})(\d{4})/,
                                        '$1-$2-$3',
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            )
        }
    }

    // -----------------------------------------------------------------------------------------
    return (
        <div className="p-4 pt-16">
            {/* 타이틀 */}
            <span className=" text-3xl font-bold">서비스 신청내역</span>
            {/* 낱개 승인 모달 */}
            <AdminModal
                open={open}
                onClose={() => setOpen(false)}
                onApprove={handlePermit}
                color="green"
                title="승인"
                content="서비스 이용 신청을 승인하시겠습니까? 승인 시 사용자의 서비스 이용이 가능해집니다."
                btnText="승인"
            />
            {/* 선택 승인 모달 */}
            <AdminModal
                open={openSelect}
                onClose={() => setOpenSelect(false)}
                onApprove={handleSelectPermit}
                color="green"
                title="선택 승인"
                content="선택한 요청을
                승인하시겠습니까? 승인된
                사용자는 승인 시점부터
                서비스 이용이
                가능합니다."
                btnText="선택 승인"
            />
            {/* 선택 삭제 모달 */}
            <AdminModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onApprove={handleSelectDelete}
                color="red"
                title="선택 삭제"
                content="선택한 모든 요청을
                삭제하시겠습니까? 삭제한
                신청은 되돌릴 수
                없습니다."
                btnText="선택 삭제"
            />

            <div className="flex justify-between mt-12 items-center ">
                {/* 테이블 설명 */}
                <div className="text-gray-500">
                    사용자 총 {modifiedData?.length}명, 선택된 사용자{' '}
                    {selectedRows.length}명
                </div>
                {/* 선택된 사용자가 없을 때 alert를 띄웁니다. */}
                <div>
                    {/* 버튼 */}
                    <button
                        onClick={() => {
                            if (selectedRows.length >= 1) {
                                setOpenSelect(true)
                            } else {
                                alert('선택된 행이 0개 입니다.')
                            }
                        }}
                        className="bg-blue-700 text-white text-xs py-1.5 w-28 rounded-lg mr-2 hover:bg-blue-600 shadow"
                    >
                        선택 승인
                    </button>
                    {/* <button
                        onClick={() => {
                            if (selectedRows.length >= 1) {
                                setOpenDelete(true)
                            } else {
                                alert('선택된 행이 0개 입니다.')
                            }
                        }}
                        className="border border-1 border-gray-200 text-xs py-1.5  w-28 rounded-lg mr-2 shadow hover:bg-gray-50 "
                    >
                        선택 삭제
                    </button> */}
                </div>
            </div>
            {/* 사용자 테이블 */}
            <div className="overflow-x-auto mt-4">
                <table className="table-auto w-full mb-12">
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
                            <th className="w-20 py-3 font-light">No</th>
                            <th className="px-4 py-3 font-light">ㅤ</th>
                            <th className="px-4 py-3 font-light">
                                duration
                                <br />
                                month
                            </th>
                            <th className="px-4 py-3 font-light">
                                expected
                                <br />
                                payment
                            </th>
                            <th className="px-4 py-3 font-light">name</th>
                            <th className="px-4 py-3 font-light">branchName</th>
                            <th className="px-4 py-3 font-light">phone</th>
                        </tr>
                    </thead>
                    {contents()}
                </table>
            </div>
        </div>
    )
}

export default ApplyManagement
