/* 

BiggestDiffMenuDetail Contents

- props: type1이번달, type2지난달, data데이터


*/
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Button from '../common/Button'
import rightArrowImg from '../../assets/right.svg'
import infoImg from '../../assets/info.svg'
import DiffListCount from './DiffListCount'
import DiffListSales from './DiffListSales'
import MessageAlert from '../common/MessageAlert'
import formatStringWithLineBreaks from '../../function/formattedStringWithLineBreaks'

const BiggestDiffMenuDetail = (props) => {
    const [isCountTabOpen, setIsCountTabOpen] = useState(true)
    const [isSalesTabOpen, setIsSalesTabOpen] = useState(false)

    function countTab() {
        setIsCountTabOpen(true)
        setIsSalesTabOpen(false)
    }
    function salesTab() {
        setIsCountTabOpen(false)
        setIsSalesTabOpen(true)
    }

    const formattedItems = props.data.data.menus.map((item) => {
        const formattedMenuName = formatStringWithLineBreaks(item.menuName, 8)
        return { ...item, menuName: formattedMenuName }
    })

    const list = () => {
        if (isCountTabOpen) {
            return <DiffListCount type1={props.type1} data={formattedItems} />
        } else if (isSalesTabOpen) {
            return <DiffListSales type1={props.type1} data={formattedItems} />
        }
    }

    return (
        <div className="mb-14">
            {' '}
            <div className="p-6 lg:px-12">
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
                        {props.type2} 대비 판매 순위
                    </span>
                </Link>
                {/* info */}
                <div className="flex justify-center my-2">
                    <img src={infoImg} className="mr-2" alt="info" />
                    <span className="text-sm text-neutral-400 text-base">
                        판매기록이 없었던 제품은 제외됩니다.
                    </span>
                </div>
                {/* 탭 */}
                <div className="flex justify-center space-x-2 mt-4">
                    <Button
                        color={isCountTabOpen ? 'black' : 'gray'}
                        text="판매개수"
                        onclick={countTab}
                    />
                    <Button
                        color={isSalesTabOpen ? 'black' : 'gray'}
                        text="판매수익"
                        onclick={salesTab}
                    />
                </div>
            </div>
            {list()}
        </div>
    )
}

export default BiggestDiffMenuDetail
