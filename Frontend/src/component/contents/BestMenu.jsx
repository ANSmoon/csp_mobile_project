/* 

BestMenu Contents

- props: 
    type: 헤더에 있는 날짜 정보에서 마지막 단어만 추출한 것입니다. (ex: 오늘,3일,이번달,4주차)
    data: 가장 많이 팔린 메뉴 TOP 3 데이터
    data = {
        data: menus[{menuName, totalRevenue}]
    }


*/

import Button from '../common/Button'

const BestMenu = (props) => {
    return (
        <div className="p-6 lg:px-12 bg-gray-100">
            {/* 타이틀 */}
            <span className="font-semibold text-2xl">
                {props.type === '오늘' ? props.type : props.type + '에'} 가장
                많이 팔린 메뉴
            </span>

            {/* Grid */}
            {props.data ? (
                <div className="grid grid-rows-4 grid-flow-col gap-4 my-6">
                    {/* 1위 */}
                    <div className="relative bg-white row-span-4 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 -m-1">
                            {props.data.data.menus[0].menuName}
                        </p>
                        <span className="text-xl font-semibold text-rose-400 -m-1">
                            {props.data.data.menus[0].totalRevenue.toLocaleString(
                                'ko-KR',
                            )}
                            원
                        </span>
                        <img
                            src="https://moki-report-s3.s3.ap-northeast-2.amazonaws.com/Americano.png3303001168"
                            // src={props.data.data.menus[0].imageUrl}
                            className="absolute -bottom-6 -right-6 h-4/5 w-auto"
                            alt="first-menu"
                        />
                    </div>
                    {/* 2위 */}
                    <div className="bg-[#FBFCFC] col-span-2 row-span-2 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 -m-1">
                            {' '}
                            {props.data.data.menus[1].menuName}
                        </p>
                        <span className="text-xl font-semibold -m-1">
                            {props.data.data.menus[1].totalRevenue.toLocaleString(
                                'ko-KR',
                            )}
                            원
                        </span>
                    </div>
                    {/* 3위 */}
                    <div className="bg-[#F9FAFB] row-span-2 col-span-2 p-4 rounded-xl">
                        <p className="text-sm text-neutral-500 -m-1">
                            {props.data.data.menus[2].menuName}
                        </p>
                        <span className="text-xl font-semibold -m-1">
                            {props.data.data.menus[2].totalRevenue.toLocaleString(
                                'ko-KR',
                            )}
                            원
                        </span>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {/* 자세히보기 버튼 */}
            <div className="flex justify-center mt-8 mb-2">
                <Button color="detail" link="bestmenu-detail" />
            </div>
        </div>
    )
}

export default BestMenu
