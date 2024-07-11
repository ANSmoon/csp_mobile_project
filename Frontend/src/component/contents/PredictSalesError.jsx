import infoImg from '../../assets/info.svg'

const PredictSalesError = () => {
    return (
        <div className=" p-6 lg:px-12 bg-white">
            <span className="font-semibold text-2xl ">
                판매 데이터가 부족해서 <br />
                매출을 예상할 수 없어요😥
            </span>
            {/* info */}
            <div className="flex flex-col items-center my-24">
                <img src={infoImg} className="h-8 w-auto mb-4" alt="info" />
                <span className="text-sm text-neutral-400 text-base text-center whitespace-pre">
                    이전 리포트가 최소 2개 쌓여야
                    <br /> 매출을 예상할 수 있어요.
                </span>
            </div>
        </div>
    )
}

export default PredictSalesError
