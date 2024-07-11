/* 

Empty Component

리포트가 생성되지않은 날짜로 월, 주 보고서 페이지로 이동한 경우 보여줄 페이지입니다.
메시지로 해당날짜에 보고서가 생성되지않았음을 알려줄 예정입니다.

*/
import HEADER from '../../component/common/Header'
import infoImg from '../../assets/info.svg'
import NAVBAR from './Navbar'

const Empty = (props) => {
    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange={props.dateRange} />

                <div className="bg-white flex flex-col items-center justify-center h-screen space-y-6">
                    <img src={infoImg} className="h-8" alt="info" />
                    <span className="text-sm text-neutral-400 text-base text-lg">
                        선택한 날짜에는 생성된 리포트가 없습니다.
                    </span>
                </div>

                <NAVBAR />
            </section>
        </div>
    )
}

export default Empty
