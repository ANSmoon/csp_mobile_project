/* 

DiffListSales Component

직전 대비 판매 비교 자세히 보기페이지에서
판매수익을 기준으로 순위를 보여준다.


*/

const DiffListSales = (props) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full mb-12">
                <thead className="m-4">
                    <tr className="border-b border-neutral-500 text-sm text-neutral-900">
                        <th className="w-20 py-3 font-light">순위</th>
                        <th className=" font-light">메뉴명</th>
                        <th className="font-light">{props.type1} 판매수익</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 데이터 : props.data <= props.data.data.menus*/}
                    {props.data.map((item, key) => {
                        return (
                            // whitespace-nowrap 줄바꿈 막기
                            <tr
                                className={
                                    (key % 2 === 0 ? 'bg-gray-100' : '') + ' '
                                }
                                key={key}
                            >
                                {/* 순위 */}
                                <td className="text-center">{key + 1}</td>
                                {/* 메뉴명 */}
                                <td className="text-center">
                                    <span className="text-neutral-500 whitespace-pre">
                                        {item.menuName}
                                    </span>
                                </td>
                                {/* 증감 수익 & 판매수익 */}
                                <td className="flex flex-col py-6 px-4 text-lg font-bold text-center whitespace-nowrap">
                                    <span
                                        className={
                                            item.thisRevenue -
                                                item.lastRevenue >=
                                            0
                                                ? item.thisRevenue -
                                                      item.lastRevenue ===
                                                  0
                                                    ? 'text-neutral-400'
                                                    : 'text-rose-500'
                                                : 'text-blue-600'
                                        }
                                    >
                                        {item.thisRevenue - item.lastRevenue > 0
                                            ? '+'
                                            : ''}
                                        {(
                                            item.thisRevenue - item.lastRevenue
                                        ).toLocaleString('ko-KR')}
                                        <span className="text-sm">원</span>
                                    </span>
                                    <span className="text-xl">
                                        {item.thisRevenue.toLocaleString(
                                            'ko-KR',
                                        )}
                                        <span className="text-base">원</span>
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default DiffListSales
