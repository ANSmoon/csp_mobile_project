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
    useMonthSalesQuery,
    useMenuMonthSalesQuery,
    useMenuMonthDiffQuery,
    useMonthPredictQuery,
} from '../../services/sales/SalesApiSlice'
import {
    selectCurrentDateMonth,
    setIsNowState,
} from '../../services/date/dateSlice'
import { useDispatch, useSelector } from 'react-redux'
import Slider from '../../component/contents/Slider'
import PredictSalesError from '../../component/contents/PredictSalesError'
import CompPredictSalesError from '../../component/contents/CompPredictSalesError'
import getPreviousMonth from '../../function/getPreviousMonth'
const MonthReportPages = () => {
    const dispatch = useDispatch()
    // 현재 날짜
    const realDate = new Date('2023-12-17')
    const prevMonth = getPreviousMonth(realDate)
    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateMonth)

    // YYYY-MM-DD 형태로 변환하기
    const [formattedDate, setFormattedDate] = useState(null)
    const [prevMonths, setprevMonths] = useState([])
    const [isNowDate, setisNowDate] = useState() // 선택된 날짜가 현재 날짜인가
    const [lastWord, setlastWord] = useState()

    useEffect(() => {
        let selectedMonth
        const formattedDateStr = date.replace(
            /(\d{4})년 (\d{1,2})월/,
            function (match, year, month) {
                month = month.padStart(2, '0')
                const dayEnd = new Date(year, month, 0).getDate()
                selectedMonth = month
                return `${year}-${month}-01~${year}-${month}-${dayEnd}`
            },
        )
        setFormattedDate(formattedDateStr)

        // 이전 4개월 구하기
        const previousMonths = []
        for (let i = 4; i >= 1; i--) {
            if (selectedMonth - i <= 0) {
                previousMonths.push((selectedMonth - i + 12) % 13)
            } else {
                previousMonths.push(selectedMonth - i)
            }
        }
        setprevMonths(previousMonths)

        // 헤더에 있는 date 문자열에서 마지막 단어만 받아와서 sales에 넘겨줌. 오늘 날짜와 선택된 날짜가 같을 경우 '이번달'을 반환함
        const wordsArray = date.split(' ')
        if (prevMonth === date) {
            setisNowDate(true)
            dispatch(setIsNowState(true))
            setlastWord('이번달')
        } else {
            setisNowDate(false)
            dispatch(setIsNowState(false))
            setlastWord(wordsArray[wordsArray.length - 1])
        }
    }, [date])

    // daily-sales 데이터 받아오기
    const encodedDate = encodeURIComponent(date)
    const { data, isLoading, error } = useMonthSalesQuery(encodedDate)
    const {
        data: dataMenu,
        isLoading: isLoadingMenu,
        error: errorMenu,
    } = useMenuMonthSalesQuery(encodedDate)
    const {
        data: dataDiff,
        isLoading: isLoadingDiff,
        error: errorDiff,
    } = useMenuMonthDiffQuery(encodedDate)

    const {
        data: dataPredict,
        isLoading: isLoadingPredict,
        error: errorPredict,
    } = useMonthPredictQuery(encodedDate)

    const [existReport, setexistReport] = useState(false)
    useEffect(() => {
        console.log(
            'Month Report: \n',
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
            'Month Report: \n',
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
            'Month Report: \n',
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
            'Month Report: \n',
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
        dataDiff,
        existReport,
        error,
        errorMenu,
        errorPredict,
    ])

    console.log('date: ', date, 'existReport:', existReport)

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
                        prevType={prevMonths[3] + '월'}
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
                                type="다음달"
                                data={[
                                    {
                                        date: `${prevMonths[0]}달`,
                                        sales: dataPredict.data
                                            .preRevenueList[0],
                                    },
                                    {
                                        date: `${prevMonths[1]}달`,
                                        sales: dataPredict.data
                                            .preRevenueList[1],
                                    },
                                    {
                                        date: `${prevMonths[2]}달`,
                                        sales: dataPredict.data
                                            .preRevenueList[2],
                                    },
                                    {
                                        date: `${prevMonths[3]}달`,
                                        sales: dataPredict.data
                                            .preRevenueList[3],
                                    },
                                    {
                                        date: '이번달',
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
                        type="지난달"
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

export default MonthReportPages
