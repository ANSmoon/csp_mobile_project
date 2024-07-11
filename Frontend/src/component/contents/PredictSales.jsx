/* 

PredictSales Contents

- props:
    data=[{date:그래프에 표시될 텍스트 , sales: 매출}]
    data[0]~data[3]: 과거 4개 매출
    data[4]: 이번 매출
    data[5]: 예상 매출

- 이중 삼항 연산자
A?(B?C:D):E
diffSales 양수, 0, 음수인 경우 총 3가지 case

*/

import { useEffect, useState } from 'react'
import infoImg from '../../assets/info.svg'
import { BarChart, Bar, XAxis, Tooltip, ReferenceLine, Cell } from 'recharts'

const PredictSales = (props) => {
    const [data, setdata] = useState()
    const [diffSales, setDiffSales] = useState(0)
    const [avgSales, setavgSales] = useState(0)
    const [screenWidth, setScreenWidth] = useState(
        window.innerWidth > 1024 ? 1024 : window.innerWidth,
    )
    const [colorData, setcolorData] = useState([
        '#DDE1E3',
        '#DDE1E3',
        '#DDE1E3',
        '#DDE1E3',
        '#DDE1E3',
        '#3687FF',
    ])

    // 평균 매출 구하기
    function calculateAverageSales(data) {
        if (data.length === 0) {
            return 0
        }
        let realLength = data.length
        let sum = 0
        for (let i = 0; i < data.length; i++) {
            sum += data[i].sales
            if (data[i].sales === 0) {
                realLength -= 1
            }
        }

        // 평균 매출을 10000단위로 변환 (ex. 8,000,000 -> 800)
        const averageSales = Math.floor(sum / realLength / 10000)
        setavgSales(averageSales)

        // 예상 매출 - 평균 매출
        let diff = props.data[5].sales - Math.floor(sum / realLength)
        setDiffSales(diff)
    }

    useEffect(() => {
        // 평균매출 계산
        calculateAverageSales(props.data)

        // diffSales가 0, 양수, 음수일때 막대 그래프의 색깔 변경
        if (diffSales === 0) {
            setcolorData([
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#A9A9A9',
            ])
        } else if (diffSales > 0) {
            setcolorData([
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#FF4C77',
            ])
        } else if (diffSales < 0) {
            setcolorData([
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#DDE1E3',
                '#3687FF',
            ])
        }
        const modifiedData = props.data.map((item) => ({
            ...item,
            sales: Math.floor(item.sales / 10000), // 1000으로 나눈 값을 sales 필드에 저장
        }))
        // modifiedData[5].sales = props.data[5].sales

        setdata(modifiedData)
    }, [props, diffSales])

    useEffect(() => {
        // 화면 크기가 변경될 때마다 screenWidth 상태를 업데이트합니다.
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setScreenWidth(1024)
            } else {
                setScreenWidth(window.innerWidth)
            }
        }

        // 이벤트 리스너를 추가하여 화면 크기 변경을 감지합니다.
        window.addEventListener('resize', handleResize)

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [window.innerWidth])
    if (data)
        return (
            <div className="p-6 lg:px-12 bg-white">
                {/* 타이틀 */}
                <span className="block font-semibold text-2xl">
                    {props.type} 매출 예상
                </span>
                <span className="text-neutral-500 text-lg">
                    {/* 평균매출은 {avgSales.toLocaleString()}만원 정도에요. <br /> */}
                    예상매출은 {props.data[5].sales.toLocaleString()}원이에요.
                </span>
                {/* 과거 5개 매출과 매출 예상 그래프 */}
                <div className="flex justify-center mt-12">
                    <BarChart
                        width={screenWidth * 0.85}
                        height={250}
                        data={data}
                        margin={{
                            top: 40,
                            bottom: 20,
                        }}
                    >
                        {/* <Tooltip /> */}
                        <Bar
                            dataKey="sales"
                            radius={[8, 8, 0, 0]}
                            label={{ position: 'top' }}
                            maxBarSize={100}
                            isAnimationActive={false}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colorData[index]}
                                />
                            ))}
                        </Bar>

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <ReferenceLine
                            y={avgSales}
                            stroke="red"
                            strokeDasharray="3 3"
                        />
                    </BarChart>
                </div>

                {/* info */}
                <div className="flex mt-2">
                    <img src={infoImg} className="mr-2" alt="info" />
                    <span className="text-sm text-neutral-400 text-base">
                        평균 매출과 요일에 따른 매출 변화를 종합한 결과에요.
                    </span>
                </div>
            </div>
        )
}

export default PredictSales
