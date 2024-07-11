import React from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BestMenuDetail from '../../component/contents/BestMenuDetail'
import TopButton from '../../component/common/TopButton'
import { useSelector } from 'react-redux'
import { selectCurrentDateWeek } from '../../services/date/dateSlice'
import { useState, useEffect } from 'react'
import { useMenuWeekSalesDetailQuery } from '../../services/sales/SalesApiSlice'
import Loading from '../../component/common/Loading'
import Empty from '../../component/common/Empty'
import getFirstDayOfWeek from '../../function/getFirstDayOfWeek'
import getLastDayOfWeek from '../../function/getLastDayOfWeek'

const WeekBestMenuDetailPages = (props) => {
    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateWeek)
    // 날짜 인코딩해서 보내기
    const encodedDate = encodeURIComponent(date)
    const { data, isLoading, error } = useMenuWeekSalesDetailQuery(encodedDate)
    const [formattedDate, setFormattedDate] = useState(null)

    useEffect(() => {
        const formattedDateStr = date.replace(
            /(\d{4})년 (\d{1,2})월 (\d{1,2})주차/,
            function (match, year, month, week) {
                // 주차의 첫날 구하기
                const firstMonth =
                    getFirstDayOfWeek(year, month, week).getMonth() + 1
                const monthStart = firstMonth.toString().padStart(2, '0')
                const dayStart = getFirstDayOfWeek(year, month, week)
                    .getDate()
                    .toString()
                    .padStart(2, '0')

                // 주차의 마지막날 구하기
                const lastMonth =
                    getLastDayOfWeek(year, month, week).getMonth() + 1
                const monthEnd = lastMonth.toString().padStart(2, '0')
                const dayEnd = getLastDayOfWeek(year, month, week)
                    .getDate()
                    .toString()
                    .padStart(2, '0')

                return `${year}-${monthStart}-${dayStart} ~ ${year}-${monthEnd}-${dayEnd}`
            },
        )
        setFormattedDate(formattedDateStr)
    }, [date])
    useEffect(() => {
        console.log(
            'Week Report: \n',
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
                    <BestMenuDetail path="week" type="주간" data={data} />
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default WeekBestMenuDetailPages
