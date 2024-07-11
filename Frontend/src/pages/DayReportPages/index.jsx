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
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import {
    useDaySalesQuery,
    useDayPredictQuery,
    useMenuDaySalesQuery,
    useMenuDayDiffQuery,
} from '../../services/sales/SalesApiSlice'
import {
    selectCurrentDateDay,
    setIsNowState,
} from '../../services/date/dateSlice'
import { useSelector } from 'react-redux'
import Slider from '../../component/contents/Slider'
import CompPredictSalesError from '../../component/contents/CompPredictSalesError'
import PredictSalesError from '../../component/contents/PredictSalesError'
import { useDispatch } from 'react-redux'
import getPreviousDate from '../../function/getPreviousDate'
const DayReportPages = () => {
    const dispatch = useDispatch()
    // 현재 날짜
    const realDate = new Date('2023-12-17')
    const prevDate = getPreviousDate(realDate)

    // 선택된 날짜 store에서 가져오기
    const date = useSelector(selectCurrentDateDay)
    // YYYY-MM-DD 형태로 변환하기
    const [formattedDate, setFormattedDate] = useState(null)
    const [prevDates, setprevDates] = useState([])
    const [isNowDate, setisNowDate] = useState() // 선택된 날짜가 현재 날짜인가
    const [lastWord, setlastWord] = useState()
    useEffect(() => {
        let dateObject
        const formattedDateStr = date.replace(
            /(\d{4})년 (\d{1,2})월 (\d{1,2})일/,
            function (match, year, month, day) {
                month = month.padStart(2, '0')
                day = day.padStart(2, '0')
                dateObject = new Date(year, month - 1, day)
                return `${year}-${month}-${day}`
            },
        )
        setFormattedDate(formattedDateStr)
        // 현재 선택된 날짜의 앞 4일 date 구하기
        const previousDates = []
        for (let i = 4; i >= 1; i--) {
            const previousDate = new Date(dateObject)
            previousDate.setDate(dateObject.getDate() - i)
            previousDates.push(previousDate.getDate())
        }
        setprevDates(previousDates)

        // 헤더에 있는 date 문자열에서 마지막 단어만 받아와서 sales에 넘겨줌. 오늘 날짜와 선택된 날짜가 같을 경우 '오늘'을 반환함
        const wordsArray = date.split(' ')
        if (
            `${realDate.getFullYear()}년 ${
                realDate.getMonth() + 1
            }월 ${realDate.getDate()}일` === date
        ) {
            setisNowDate(true)
            dispatch(setIsNowState(true))
            setlastWord('오늘')
        } else {
            setisNowDate(false)
            dispatch(setIsNowState(false))
            setlastWord(wordsArray[wordsArray.length - 1])
        }
    }, [date])

    // daily-sales 데이터 받아오기
    const { data, isLoading, error } = useDaySalesQuery(
        formattedDate ? formattedDate : '',
        {
            skip: !formattedDate, // formattedDate가 없으면 쿼리 호출을 스킵
        },
    )
    const {
        data: dataMenu,
        isLoading: isLoadingMenu,
        error: errorMenu,
    } = useMenuDaySalesQuery(formattedDate ? formattedDate : '', {
        skip: !formattedDate, // formattedDate가 없으면 쿼리 호출을 스킵
    })
    const {
        data: dataDiff,
        isLoading: isLoadingDiff,
        error: errorDiff,
    } = useMenuDayDiffQuery(formattedDate ? formattedDate : '', {
        skip: !formattedDate, // formattedDate가 없으면 쿼리 호출을 스킵
    })
    const {
        data: dataPredict,
        isLoading: isLoadingPredict,
        error: errorPredict,
    } = useDayPredictQuery(formattedDate ? formattedDate : '', {
        skip: !formattedDate, // formattedDate가 없으면 쿼리 호출을 스킵
    })

    useEffect(() => {
        console.log(
            'Day Report: \n',
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
            'Day Report: \n',
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
            'Day Report: \n',
            '💫dataPredict: ',
            dataPredict,
            '💫isLoadingPredict:',
            isLoadingPredict,
            '💫errorPredict: ',
            errorPredict,
        )
    }, [dataPredict, isLoadingPredict, errorPredict])

    const [existReport, setexistReport] = useState(false)
    useEffect(() => {
        // date가 유효한 경우
        if (formattedDate) {
            // existReport 상태 업데이트
            if ((data && data.data.thisSales === 0) || error || errorMenu) {
                setexistReport(false)
            } else if (data && dataMenu) {
                setexistReport(true)
            }
        }
    }, [
        formattedDate,
        existReport,
        data,
        dataMenu,
        dataDiff,
        error,
        errorMenu,
        errorPredict,
    ])

    console.log('date: ', date, 'existReport:', existReport)

    if (isLoading || isLoadingMenu || isLoadingDiff || isLoadingPredict) {
        return (
            <div>
                <Loading dateRange=" " />
            </div>
        )
    }

    // Check if there is no data to display
    if (!existReport) {
        return (
            <div>
                <Empty dateRange=" " />
            </div>
        )
    }

    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange=" " />

                <Slider />

                <div id="#a1">
                    <Sales
                        lastwordOfDate={lastWord}
                        type={lastWord}
                        prevType={prevDates[3] + '일'}
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
                                type="다음날"
                                data={[
                                    {
                                        date: `${prevDates[0]}일`,
                                        sales: dataPredict.data
                                            .preRevenueList[0],
                                    },
                                    {
                                        date: `${prevDates[1]}일`,
                                        sales: dataPredict.data
                                            .preRevenueList[1],
                                    },
                                    {
                                        date: `${prevDates[2]}일`,
                                        sales: dataPredict.data
                                            .preRevenueList[2],
                                    },
                                    {
                                        date: `${prevDates[3]}일`,
                                        sales: dataPredict.data
                                            .preRevenueList[3],
                                    },
                                    {
                                        date: '오늘',
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
                        type="전날"
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

export default DayReportPages
