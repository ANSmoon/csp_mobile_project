/* 

BestMenuDetail Contents

- props: path, type, data

가장 많이 팔린 메뉴 순위를 테이블로 표시합니다.
*/
import { Link } from 'react-router-dom'
import rightArrowImg from '../../assets/right.svg'
import MessageAlert from '../common/MessageAlert'
import Triangle from '../common/Triangle'
import formatStringWithLineBreaks from '../../function/formattedStringWithLineBreaks'

const BestMenuDetail = (props) => {
    const formattedItems = props.data.data.menus.map((item) => {
        const formattedMenuName = formatStringWithLineBreaks(item.menuName, 8)
        return { ...item, menuName: formattedMenuName }
    })

    return (
        <div className="mb-14">
            <div className="p-6 lg:px-12">
                {/* <- 좌우로 스와이프 해주세요 -> */}
                {/* <MessageAlert
                    message={'← 좌우로 스와이프 해주세요 →'}
                    timeout={3000}
                /> */}
                {/* 타이틀 */}
                <Link to={`/${props.path}`} className="flex items-center mt-16">
                    <img
                        src={rightArrowImg}
                        alt="right-arrow"
                        className="rotate-180 mr-4"
                    />
                    <span className="font-semibold text-2xl">
                        {props.type} 판매 순위
                    </span>
                </Link>
            </div>

            {/* 리스트 */}
            <div className="overflow-x-auto ">
                <table className="table-auto w-full mb-12">
                    <thead className="m-4">
                        <tr className="border-b border-neutral-500 text-sm text-neutral-900">
                            <th className="w-20 py-3 font-light">순위</th>

                            <th className="px-4 py-3 font-light">메뉴명</th>
                            <th className="px-4 py-3 font-light">
                                판매 금액/
                                <br />
                                판매 개수
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 데이터 */}
                        {formattedItems.map((item, key) => {
                            return (
                                // whitespace-nowrap 줄바꿈 막기
                                <tr
                                    className={
                                        key % 2 === 0 ? 'bg-gray-100' : ''
                                    }
                                    key={key}
                                >
                                    {/* 순위 */}
                                    <td className="px-4 text-center">
                                        {key + 1}
                                    </td>

                                    {/* 메뉴명 & 순위변동 */}
                                    <td className="items-center py-6 px-4 text-center ">
                                        <span
                                            className={
                                                'text-neutral-500 whitespace-pre col-span-1'
                                            }
                                        >
                                            {item.menuName}
                                        </span>
                                        <br />

                                        <span>
                                            {/* 순위 변동 */}
                                            {item.new ? ( // 지난달에는 없었던 새로운 메뉴
                                                <span className="text-yellow-400 font-bold text-lg">
                                                    new!
                                                </span>
                                            ) : (
                                                // 지난달에도 있었던 메뉴
                                                <span>
                                                    {item.rankChange >= 0 ? (
                                                        item.rankChange ===
                                                        0 ? ( // 순위 변동없음
                                                            <span className="flex justify-center mt-4">
                                                                {Triangle(
                                                                    item.rankChange,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            // 순위 상승

                                                            <span className="flex justify-center items-center text-rose-500 font-bold text-lg">
                                                                {Triangle(
                                                                    item.rankChange,
                                                                )}
                                                                <span className="ml-2">
                                                                    {
                                                                        item.rankChange
                                                                    }
                                                                </span>
                                                            </span>
                                                        )
                                                    ) : (
                                                        // 순위 하강

                                                        <span className="flex justify-center items-center text-blue-600 font-bold text-lg">
                                                            {Triangle(
                                                                item.rankChange,
                                                            )}
                                                            <span className="ml-2">
                                                                {Math.abs(
                                                                    item.rankChange,
                                                                )}
                                                            </span>
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    {/* 판매 금액*/}
                                    <td
                                        className={
                                            (key === 0
                                                ? 'text-rose-500 '
                                                : '') +
                                            'px-4 flex flex-col  items-between py-6 text-xl font-bold whitespace-nowrap text-center'
                                        }
                                    >
                                        <span>
                                            {item.totalRevenue.toLocaleString(
                                                'ko-KR',
                                            )}
                                            <span className="text-base">
                                                원
                                            </span>
                                        </span>

                                        <span
                                            className={
                                                (key === 0
                                                    ? 'text-rose-500 '
                                                    : '') +
                                                'text-xl font-bold mt-4'
                                            }
                                        >
                                            <span>
                                                {item.count}
                                                <span className="text-base">
                                                    개
                                                </span>
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BestMenuDetail
