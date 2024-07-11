/* 

ScrollToTop Component

리액트에서는 기본적으로 페이지 이동시 마지막 스크롤 위치를 기억하고 그 위치를 유지합니다.
그래서 이 컴포넌트를 이용해서 페이지 이동시 화면 최 상단으로 이동하도록 만들었습니다.
App.js 파일에서 넣어놓으면 모든 페이지 이동시 작동됩니다.

*/

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
