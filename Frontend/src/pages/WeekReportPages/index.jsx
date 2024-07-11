import React, { useState, useEffect } from 'react'
import Sales from '../../component/contents/Sales'
import CompPredictSales from '../../component/contents/CompPredictSales'
import PredictSales from '../../component/contents/PredictSales'
import DivisionLine from '../../component/common/DivisionLine'
import BestMenu from '../../component/contents/BestMenu'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BiggestDiffMenu from '../../component/contents/BiggestDiffMenu'
import TopButton from '../../component/common/TopButton'
import Loading from '../../component/common/Loading'
import Empty from '../../component/common/Empty'
import {
    useWeekSalesQuery,
    useMenuWeekSalesQuery,
    useMenuWeekDiffQuery,
    useWeekPredictQuery,
} from '../../services/sales/SalesApiSlice'
import {
    selectCurrentDateWeek,
    setIsNowState,
} from '../../services/date/dateSlice'
import { useDispatch, useSelector } from 'react-redux'
import Slider from '../../component/contents/Slider'
import getFirstDayOfWeek from '../../function/getFirstDayOfWeek'
import getLastDayOfWeek from '../../function/getLastDayOfWeek'
import getWeek from '../../function/getWeek'
import PredictSalesError from '../../component/contents/PredictSalesError'
import CompPredictSalesError from '../../component/contents/CompPredictSalesError'
import getPreviousWeek from '../../function/getPreviousWeek'

const WeekReportPages = () => {
    const dispatch = useDispatch()
    // 현재 날짜
    const realDate = new Date('2023-12-17')

    const prevWeek = getPreviousWeek(realDate)

    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateWeek)

    // YYYY-MM-DD 형태로 변환하기
    const [formattedDate, setFormattedDate] = useState(null)
    const [prevWeeks, setprevWeeks] = useState([])
    const [isNowDate, setisNowDate] = useState() // 선택된 날짜가 현재 날짜인가
    const [lastWord, setlastWord] = useState()

    useEffect(() => {
        let dateObject
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
                dateObject = new Date(year, month - 1, dayEnd)
                return `${year}-${monthStart}-${dayStart} ~ ${year}-${monthEnd}-${dayEnd}`
            },
        )
        setFormattedDate(formattedDateStr)

        // 현재 선택된 날짜의 앞 4일 date 구하기
        const previousWeeks = []
        for (let i = 4; i >= 1; i--) {
            const previousDate = new Date(dateObject)
            previousDate.setDate(dateObject.getDate() - i * 7)
            previousWeeks.push(getWeek(previousDate))
        }
        setprevWeeks(previousWeeks)

        // 헤더에 있는 date 문자열에서 마지막 단어만 받아와서 sales에 넘겨줌. 오늘 날짜와 선택된 날짜가 같을 경우 '이번주'를 반환함
        const wordsArray = date.split(' ')
        if (prevWeek === date) {
            setisNowDate(true)
            dispatch(setIsNowState(true))
            setlastWord('이번주')
        } else {
            setisNowDate(false)
            dispatch(setIsNowState(false))
            setlastWord(wordsArray[wordsArray.length - 1])
        }
    }, [date])

    // 날짜 인코딩
    const encodedDate = encodeURIComponent(date)

    const { data, isLoading, error } = useWeekSalesQuery(encodedDate)
    const {
        data: dataMenu,
        isLoading: isLoadingMenu,
        error: errorMenu,
    } = useMenuWeekSalesQuery(encodedDate)

    const {
        data: dataDiff,
        isLoading: isLoadingDiff,
        error: errorDiff,
    } = useMenuWeekDiffQuery(encodedDate)

    const {
        data: dataPredict,
        isLoading: isLoadingPredict,
        error: errorPredict,
    } = useWeekPredictQuery(encodedDate)

    const [existReport, setexistReport] = useState(false)
    useEffect(() => {
        console.log(
            'Week Report: \n',
            '✔️data: ',
            data,
            '✔️isLoading:',
            isLoading,
            '✔️error: ',
            error,
        )
    }, [data, isLoading, error])

    useEffect(() => {
        console.log(
            'Week Report: \n',
            '⭕dataMenu: ',
            dataMenu,
            '⭕isLoadingMenu:',
            isLoadingMenu,
            '⭕errorMenu: ',
            errorMenu,
        )
    }, [dataMenu, isLoadingMenu, errorMenu])
    useEffect(() => {
        console.log(
            'Day Report: \n',
            '💚dataDiff: ',
            dataDiff,
            '💚isLoadingDiff:',
            isLoadingDiff,
            '💚errorDiff: ',
            errorDiff,
        )
    }, [dataDiff, isLoadingDiff, errorDiff])

    useEffect(() => {
        console.log(
            'Week Report: \n',
            '💫dataPredict: ',
            dataPredict,
            '💫isLoadingPredict:',
            isLoadingPredict,
            '💫errorPredict: ',
            errorPredict,
        )
    }, [dataPredict, isLoadingPredict, errorPredict])

    useEffect(() => {
        // date가 유효한 경우
        if (encodedDate) {
            // existReport 상태 업데이트
            if ((data && data.data.thisSales === 0) || error || errorMenu) {
                setexistReport(false)
            } else if (data && dataMenu) {
                setexistReport(true)
            }
        }
    }, [
        encodedDate,
        data,
        dataMenu,
        error,
        existReport,
        dataDiff,
        errorMenu,
        errorPredict,
    ])

    if (isLoading || isLoadingMenu || isLoadingDiff || isLoadingPredict) {
        return (
            <div>
                <Loading dateRange={formattedDate} />
            </div>
        )
    }

    // Check if there is no data to display
    if (!existReport) {
        return (
            <div>
                <Empty dateRange={formattedDate} />
            </div>
        )
    }

    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange={formattedDate} />

                <Slider />
                <div id="#a1">
                    <Sales
                        lastwordOfDate={lastWord}
                        type={lastWord}
                        prevType={prevWeeks[3] + '주차'}
                        sales={data.data.thisSales}
                        pastSales={data.data.previousSales}
                        diffSales={data.data.diffSales}
                    />
                </div>
                <div id="#a2">
                    {!isNowDate ? (
                        <></>
                    ) : (
                        <>
                            <DivisionLine />
                            <CompPredictSales
                                type="이번주"
                                data={[
                                    {
                                        date: '예상 매출',
                                        sales:
                                            Math.floor(
                                                dataPredict.data
                                                    .prePredictRevenue / 100,
                                            ) * 100,
                                    },
                                    {
                                        date: '실제 매출',
                                        sales: data.data.thisSales,
                                    },
                                ]}
                            />
                        </>
                    )}
                </div>

                <div id="#a3">
                    {!isNowDate ? (
                        <></>
                    ) : (
                        <>
                            <DivisionLine />
                            <PredictSales
                                type="다음주"
                                data={[
                                    {
                                        date: `${prevWeeks[0]}주`,
                                        sales: dataPredict.data
                                            .preRevenueList[0],
                                    },
                                    {
                                        date: `${prevWeeks[1]}주`,
                                        sales: dataPredict.data
                                            .preRevenueList[1],
                                    },
                                    {
                                        date: `${prevWeeks[2]}주`,
                                        sales: dataPredict.data
                                            .preRevenueList[2],
                                    },
                                    {
                                        date: `${prevWeeks[3]}주`,
                                        sales: dataPredict.data
                                            .preRevenueList[3],
                                    },
                                    {
                                        date: '이번주',
                                        sales: data.data.thisSales,
                                    },
                                    {
                                        date: '예상',
                                        sales:
                                            Math.floor(
                                                dataPredict.data
                                                    .nextPredictRevenue / 100,
                                            ) * 100,
                                    },
                                ]}
                            />
                        </>
                    )}
                </div>
                <div id="#a4">
                    <BestMenu type={lastWord} data={dataMenu} />
                </div>
                <div id="#a5">
                    <BiggestDiffMenu
                        type="지난주"
                        data={dataDiff}
                        error={errorDiff}
                    />
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default WeekReportPages
