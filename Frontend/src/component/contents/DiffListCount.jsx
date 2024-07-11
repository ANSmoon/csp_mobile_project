const DiffListCount = (props) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full mb-12">
                <thead className="m-4">
                    <tr className="border-b border-neutral-500 text-sm text-neutral-900">
                        <th className="w-20 py-3 font-light">순위</th>
                        <th className="px-4 py-3 font-light">메뉴명</th>
                        <th className="px-4 font-light">
                            {props.type1} 판매개수
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* 데이터 */}
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
                                <td className="px-4 text-center">{key + 1}</td>
                                {/* 메뉴명 & 증가율 */}
                                <td className=" px-4  text-center">
                                    <span className="text-neutral-500 whitespace-pre">
                                        {item.menuName}
                                    </span>
                                </td>
                                <td className="flex flex-col  py-6 px-4 text-lg font-bold text-center whitespace-nowrap">
                                    {/* 증감비율 */}
                                    <span
                                        className={
                                            item.changeRate >= 0
                                                ? item.changeRate === 0
                                                    ? 'text-neutral-400'
                                                    : 'text-rose-500'
                                                : 'text-blue-600'
                                        }
                                    >
                                        {item.changeRate > 0 ? '+' : ''}
                                        {Number.isInteger(item.changeRate)
                                            ? item.changeRate
                                            : item.changeRate.toFixed(1)}
                                        %
                                    </span>
                                    {/* 판매 개수 */}

                                    <span className="text-xl">
                                        {item.thisCount}
                                        <span className="text-base">개</span>
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

export default DiffListCount
