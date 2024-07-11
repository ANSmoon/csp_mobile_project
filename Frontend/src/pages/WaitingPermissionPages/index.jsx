import React, { useState, useEffect } from 'react'
import DivisionLine from '../../component/common/DivisionLine'
import NAVBAR from '../../component/common/Navbar'
import HEADER from '../../component/common/Header'
import BiggestDiffMenu from '../../component/contents/BiggestDiffMenu'
import TopButton from '../../component/common/TopButton'
import Empty from '../../component/common/Empty'
import Loading from '../../component/common/Loading'
import Slider from '../../component/contents/Slider'

const WaitingPermissionPages = () => {
    return (
        <div className="bg-gray-200">
            <section>
                <HEADER dateRange=" " />
                <Slider />
                <div className="p-6 bg-white text-center">
                    <div className="mt-6 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 ">
                        <span class="material-symbols-outlined text-green-600">
                            done
                        </span>
                    </div>
                    <div className="font-bold pt-9 text-lg">
                        신청이 완료되었습니다.
                    </div>
                    <div className="text-neutral-400 text-sm mt-3">
                        승인 대기 중입니다.
                        <br />
                        관리자가 결제 내역을
                        <br />
                        확인 후 승인 처리됩니다.
                    </div>
                </div>

                <TopButton />
                <NAVBAR></NAVBAR>
            </section>
        </div>
    )
}

export default WaitingPermissionPages
