/* 

BiggestDiffMenu Contents

- props:
    type: 전날, 지난주, 지난달
    data: 가장 많이/적게 팔린 메뉴 TOP 1 각각의 데이터
    error: 이번 혹은 직전에 장사를 안했다면 error를 받아온다.

만약 이번에 장사를 했는데도 지난번 데이터가 없다면 error가 오기때문에
BiggestDiff의 error는 Empty페이지를 띄우는 기준으로는 사용하지않는다.
(광명하얀 점 기준 2023년 1월 24일로 테스트해볼수있다.)


*/

import Button from '../common/Button'
import infoImg from '../../assets/info.svg'
import Triangle from '../common/Triangle'
import formattedStringWithLineBreaks from '../../function/formattedStringWithLineBreaks'

const BiggestDiffMenu = (props) => {
    if (props.error) {
        // 지난 판매기록이 없는 경우
        return (
            <div className="p-6 lg:px-12 mb-24 bg-white">
                {/* 타이틀 1 -----------------------------------------------------------------------*/}
                <span className="font-semibold text-2xl">
                    {props.type} 대비
                    <br /> 가장 많이 팔린 메뉴
                </span>

                {/* info */}
                <div className="flex flex-col items-center my-24">
                    <img src={infoImg} className="h-8 w-auto mb-4" alt="info" />
                    <span className="text-sm text-neutral-400 text-base text-center">
                        지난 판매 기록이 없어서
                        <br />
                        비교할 수 없습니다.
                    </span>
                </div>

                {/* 타이틀 2 ----------------------------------------------------------------------*/}
                <span className="font-semibold text-2xl">
                    {props.type} 대비 <br />
                    가장 적게 팔린 메뉴
                </span>

                {/* info */}
                <div className="flex flex-col items-center  my-24">
                    <img src={infoImg} className="h-8 w-auto mb-4" alt="info" />
                    <span className="text-sm text-neutral-400 text-base text-center">
                        지난 판매 기록이 없어서
                        <br />
                        비교할 수 없습니다.
                    </span>
                </div>
            </div>
        )
    } else {
        const formattedStrBest = formattedStringWithLineBreaks(
            props.data.data.best.menuName,
            8,
        )
        const formattedStrWorst = formattedStringWithLineBreaks(
            props.data.data.worst.menuName,
            8,
        )
        return (
            <div className="p-6 lg:px-12 bg-white">
                {/* 타이틀 1 -----------------------------------------------------------------------*/}
                <span className="font-semibold text-2xl">
                    {props.type} 대비 <br />
                    가장 많이 팔린 메뉴
                </span>
                {/* 메뉴 정보 */}
                <div className="flex items-center my-4 ml-4">
                    {/* Img */}
                    <div className="grid place-items-center bg-gray-100 w-36 h-36 rounded-xl">
                        {props.data.data.best.imageUrl ? (
                            <img
                                src={props.data.data.best.imageUrl}
                                alt="first-menu"
                            />
                        ) : (
                            <img src="/coffee.svg" alt="first-menu" />
                        )}
                    </div>

                    <div className=" mr-6 ml-auto text-right">
                        <p className="text pl-4 whitespace-pre-line">
                            {formattedStrBest}
                        </p>
                        <span className="font-bold text-4xl">
                            {props.data.data.best.changeRate.toFixed(1)}
                        </span>
                        <span className="font-bold">%</span>

                        <br />
                        <div className="flex justify-end items-center">
                            {Triangle(props.data.data.best.changeRevenue)}

                            <span
                                className={
                                    (props.data.data.best.changeRevenue > 0
                                        ? 'text-red-500 '
                                        : 'text-blue-600 ') +
                                    'font-semibold ml-2'
                                }
                            >
                                {props.data.data.best.changeRevenue.toLocaleString(
                                    'ko-KR',
                                )}
                                원
                            </span>
                        </div>
                    </div>
                </div>

                {/* <div className="flex mt-2 mb-8">
                    <img src={infoImg} className="mr-2" alt="info" />
                    <span className="text-sm text-neutral-400 text-base">
                        판매기록이 없었던 제품은 제외됩니다.
                    </span>
                </div> */}
                {/* 타이틀 2 ----------------------------------------------------------------------*/}
                <span className="font-semibold text-2xl">
                    {props.type} 대비 <br />
                    가장 적게 팔린 메뉴
                </span>
                {/* 메뉴 정보 */}
                <div className="flex items-center my-4 mr-4">
                    <div className=" ml-6 mr-auto text-left">
                        <p className="text pr-4 whitespace-pre-line">
                            {formattedStrWorst}
                        </p>
                        <span className="font-bold text-4xl">
                            {props.data.data.worst.changeRate.toFixed(1)}
                        </span>
                        <span className="font-bold">%</span>

                        <br />
                        <div className="flex justify-start items-center">
                            <Triangle
                                diff={props.data.data.worst.changeRevenue}
                            />
                            {Triangle(props.data.data.worst.changeRevenue)}
                            <span
                                className={
                                    (props.data.data.worst.changeRevenue > 0
                                        ? 'text-red-500 '
                                        : 'text-blue-600 ') +
                                    'font-semibold ml-2'
                                }
                            >
                                {props.data.data.worst.changeRevenue.toLocaleString(
                                    'ko-KR',
                                )}
                                원
                            </span>
                        </div>
                    </div>
                    {/* Img */}
                    <div className="grid place-items-center bg-gray-100 w-36 h-36 p-4 rounded-xl">
                        {props.data.data.worst.imageUrl ? (
                            <img
                                src={props.data.data.worst.imageUrl}
                                alt="first-menu"
                            />
                        ) : (
                            <img src="/coffee.svg" alt="first-menu" />
                        )}
                    </div>
                </div>
                {/* info */}
                <div className="flex justify-end mt-2 mb-6">
                    <img src={infoImg} className="mr-2" alt="info" />
                    <span className="text-sm text-neutral-400 text-base">
                        판매기록이 없었던 제품은 제외됩니다.
                    </span>
                </div>
                {/* 자세히보기 버튼 */}
                <div className="flex justify-center mt-8 mb-24">
                    <Button color="detail" link="biggestdiff-detail" />
                </div>
            </div>
        )
    }
}

export default BiggestDiffMenu
