/* 

CompPredictSales Contents

- props: 
    data=[{date:그래프에 표시될 텍스트 , sales: 매출}]
    data[0]: 예상 매출
    data[1]: 실제 매출

- 이중 삼항 연산자
A?(B?C:D):E
diffSales 양수, 0, 음수인 경우 총 3가지 case

*/

import { useEffect, useState, useCallback } from 'react'
import { BarChart, Bar, XAxis, Cell } from 'recharts'

const CompPredictSales = (props) => {
    const [diffSales, setDiffSales] = useState(0)

    const [colorData, setcolorData] = useState(['#DDE1E3', '#3687FF'])
    let [animate, setAnimate] = useState(true)
    const onAnimationStart = useCallback(() => {
        setTimeout(() => {
            setAnimate(false)
        }, 500)
    }, [])

    useEffect(() => {
        let diff = props.data[1].sales - props.data[0].sales
        setDiffSales(diff)
        // diffSales가 0, 양수, 음수일때 막대 그래프의 색깔 변경
        if (diffSales === 0) {
            setcolorData(['#DDE1E3', '#A9A9A9'])
        } else if (diffSales > 0) {
            setcolorData(['#DDE1E3', '#FF4C77'])
        } else if (diffSales < 0) {
            setcolorData(['#DDE1E3', '#3687FF'])
        }
    }, [props.data, diffSales])

    useEffect(() => {}, [colorData])

    const [screenWidth, setScreenWidth] = useState(
        window.innerWidth > 1024 ? 1024 : window.innerWidth,
    )
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

    function differencePredictSales() {
        if (diffSales === 0) {
            return (
                <span className="font-semibold text-2xl">
                    {props.lastwordOfDate} 예상 매출과
                    <br />
                    실제 매출이 똑같아요
                </span>
            )
        } else {
            return (
                <>
                    <span className="font-semibold text-2xl">
                        예상보다
                        <span className="text-3xl">
                            {diffSales > 0 ? ' 😆' : ' 😥'}
                        </span>
                        <br />
                        <span className=" border-b border-gray-500  px-1 text-[28px]">
                            {Math.abs(diffSales).toLocaleString('ko-KR')}
                        </span>
                        원 {diffSales > 0 ? '더' : '덜'} 벌었어요
                    </span>
                </>
            )
        }
    }

    // 막대 바 위에 띄우는 라벨
    const CustomizedLabel = ({ x, y, width, value, index }) => {
        return (
            <text
                x={x + width / 2}
                y={y}
                textAnchor="middle"
                dy={-10}
                fill={colorData[index]}
                fontSize={20}
                fontWeight={'bold'}
            >
                {/* 금액에 , 표시를 해줘야해서 Custom할수밖에 없었다. */}
                {value.toLocaleString()}
            </text>
        )
    }

    return (
        <div className=" p-6 lg:px-12 bg-white">
            {/* 타이틀 */}
            {differencePredictSales()}
            {/* 예상과 실제 비교 그래프 */}
            <div className="flex justify-center mt-12">
                <BarChart
                    key={JSON.stringify(props.data)}
                    width={screenWidth * 0.85}
                    height={250}
                    data={props.data}
                    margin={{
                        top: 40,
                        bottom: 20,
                    }}
                >
                    {/* <Tooltip /> */}
                    <Bar
                        dataKey="sales"
                        radius={[8, 8, 0, 0]}
                        label={<CustomizedLabel />}
                        // label={{ position: 'top', fontSize: '25px' }}
                        maxBarSize={60}
                        isAnimationActive={animate}
                        onAnimationStart={onAnimationStart}
                    >
                        {props.data.map((entry, index) => (
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
                </BarChart>
            </div>
        </div>
    )
}

export default CompPredictSales
