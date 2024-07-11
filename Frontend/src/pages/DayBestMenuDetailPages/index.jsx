import React from 'react'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BestMenuDetail from '../../component/contents/BestMenuDetail'
import TopButton from '../../component/common/TopButton'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useMenuDaySalesDetailQuery } from '../../services/sales/SalesApiSlice'
import { selectCurrentDateDay } from '../../services/date/dateSlice'
import Loading from '../../component/common/Loading'
import Empty from '../../component/common/Empty'

const DayBestMenuDetailPages = () => {
    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateDay)
    // YYYY-MM-DD 형태로 변환하기
    const [formattedDate, setFormattedDate] = useState(null)

    useEffect(() => {
        const formattedDateStr = date.replace(
            /(\d{4})년 (\d{1,2})월 (\d{1,2})일/,
            function (match, year, month, day) {
                month = month.padStart(2, '0')
                day = day.padStart(2, '0')
                return `${year}-${month}-${day}`
            },
        )
        setFormattedDate(formattedDateStr)
    }, [date])
    const { data, isLoading, error } = useMenuDaySalesDetailQuery(
        formattedDate ? formattedDate : '',
        {
            skip: !formattedDate, // formattedDate가 없으면 쿼리 호출을 스킵
        },
    )

    useEffect(() => {
        console.log(
            'Day Report: \n',
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
        if (formattedDate) {
            // existReport 상태 업데이트
            if (error) {
                setexistReport(false)
            } else if (data) {
                setexistReport(true)
            }
        }
    }, [formattedDate, data, error, existReport])

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
                <HEADER></HEADER>
                <div className="bg-white">
                    <BestMenuDetail path="day" type="일간" data={data} />
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default DayBestMenuDetailPages
