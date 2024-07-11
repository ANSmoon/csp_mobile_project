import React from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BiggestDiffMenuDetail from '../../component/contents/BiggestDiffMenuDetail'
import TopButton from '../../component/common/TopButton'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useMenuMonthDiffDetailQuery } from '../../services/sales/SalesApiSlice'
import { selectCurrentDateMonth } from '../../services/date/dateSlice'
import Loading from '../../component/common/Loading'
import Empty from '../../component/common/Empty'

const MonthBiggestDiffDetailPages = () => {
    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateMonth)
    // YYYY-MM-DD 형태로 변환하기
    const encodedDate = encodeURIComponent(date)

    const { data, isLoading, error } = useMenuMonthDiffDetailQuery(encodedDate)
    const [formattedDate, setFormattedDate] = useState()

    useEffect(() => {
        const formattedDateStr = date.replace(
            /(\d{4})년 (\d{1,2})월/,
            function (match, year, month) {
                month = month.padStart(2, '0')
                const dayEnd = new Date(year, month, 0).getDate()

                return `${year}-${month}-01~${year}-${month}-${dayEnd}`
            },
        )
        setFormattedDate(formattedDateStr)
    }, [date])
    useEffect(() => {
        console.log(
            'Month Report: \n',
            '⭕dataMenuDiffDetail: ',
            data,
            '⭕isLoadingMenuDiffDetail:',
            isLoading,
            '⭕errorMenuDiffDetail: ',
            error,
        )
    }, [data, isLoading, error])

    const [existReport, setexistReport] = useState(false)
    useEffect(() => {
        // date가 유효한 경우
        if (encodedDate) {
            // existReport 상태 업데이트
            if (error) {
                setexistReport(false)
            } else if (data) {
                setexistReport(true)
            }
        }
    }, [encodedDate, data, error, existReport])

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        )
    }
    // Check if there is no data to display
    if (!existReport) {
        //!errorMenu ||
        return (
            <div>
                <Empty />
            </div>
        )
    }
    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange={formattedDate} />
                <div className="bg-white">
                    <BiggestDiffMenuDetail
                        path="month"
                        type1="이번달"
                        type2="지난달"
                        data={data}
                    />
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default MonthBiggestDiffDetailPages
