import React, { useState, useEffect } from 'react'
import DivisionLine from '../../component/common/DivisionLine'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import TopButton from '../../component/common/TopButton'
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import Slider from '../../component/contents/Slider'
import { Link } from 'react-router-dom'
import infoImg from '../../assets/info.svg'

const NoPermissionPages = () => {
    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange=" " />
                <Slider />
                <div className="p-5 pb-28 bg-white text-center flex flex-col justify-center items-center">
                    <img src={infoImg} className="h-8 mt-6" alt="info" />
                    <span className="mt-6 font-bold text-lg">
                        서비스를 신청해주세요.
                    </span>
                    <p className=" p-6 text-neutral-400 ">
                        매출분석 보고서 서비스를
                        <br />
                        이용하시려면
                        <br />
                        <br />
                        좌측 상단의
                        <br />
                        <span className="font-bold">
                            [메뉴 &gt; 서비스 신청 페이지]
                        </span>
                        <br />
                        혹은
                        <br />
                        <span className="font-bold">[아래의 버튼]</span>을 눌러
                        <br />
                        서비스를 신청해주세요. <br />
                        <br />
                        서비스를 신청하신 뒤 승인이 완료되면
                        <br />
                        서비스 사용이 가능합니다.
                    </p>
                    <Link
                        to="/setting/apply"
                        className="mt-6 text-white bg-gray-900 text-center hover:bg-gray-700 px-4 py-2 rounded-lg w-64"
                    >
                        서비스 신청하러가기
                    </Link>
                </div>
                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default NoPermissionPages
