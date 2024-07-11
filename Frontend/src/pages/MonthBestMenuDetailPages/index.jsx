import React from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BestMenuDetail from '../../component/contents/BestMenuDetail'
import TopButton from '../../component/common/TopButton'
import { useSelector } from 'react-redux'
import { selectCurrentDateMonth } from '../../services/date/dateSlice'
import { useState, useEffect } from 'react'
import { useMenuMonthSalesDetailQuery } from '../../services/sales/SalesApiSlice'
import Loading from '../../component/common/Loading'
import Empty from '../../component/common/Empty'

const MonthBestMenuDetailPages = (props) => {
    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateMonth)
    // 날짜 인코딩해서 데이터 받아오기
    const encodedDate = encodeURIComponent(date)
    const { data, isLoading, error } = useMenuMonthSalesDetailQuery(encodedDate)
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
            '⭕dataMenuDetail: ',
            data,
            '⭕isLoadingMenuDetail:',
            isLoading,
            '⭕errorMenuDetail: ',
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
                    <BestMenuDetail path="month" type="월간" data={data} />
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default MonthBestMenuDetailPages
