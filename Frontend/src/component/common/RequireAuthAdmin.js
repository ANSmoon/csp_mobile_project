/* 

RequireAuthAdmin

token의 ROLE이 ADMIN이면 App.js에서 RequireAuthAdmin Route의 안에있는 Route들을 각각 표시해줍니다.
token이 유효하지않으면 로그인 페이지로 이동시킵니다.

*/
import React, { useEffect } from 'react'
import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const RequireAuthAmin = () => {
    //const token = useSelector(selectCurrentToken)
    const token = localStorage.getItem('login-token')
    const location = useLocation()
    const navigate = useNavigate()

    const handleLoginClick = () => {
        // navigate('/login')
        const confirmed = window.confirm(
            '관리자 계정으로 로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?',
        )
        if (confirmed) {
            navigate('/login', { state: { from: location }, replace: true })
        } else {
            alert('관리자 로그인이 필요합니다.')
        }
    }

    // JWT 토큰 디코딩
    const decoded = jwt_decode(token)
    console.log('decoded token: ', decoded)

    useEffect(() => {
        if (token) {
            const decoded = jwt_decode(token)
            console.log(decoded)

            if (decoded.role === 'ROLE_ADMIN') {
                // do nothing
            } else if (
                decoded.role === 'ROLE_USER' &&
                decoded.state === 'PERMITTED'
            ) {
                navigate('/')
            } else if (
                decoded.role === 'ROLE_USER' &&
                decoded.state === 'WAITING_PERMISSION'
            ) {
                navigate('/waiting-permission')
            } else if (
                decoded.role === 'ROLE_USER' &&
                decoded.state === 'EXPIRED'
            ) {
                navigate('/no-permission')
            }
        } else {
            // Token이 없는 경우
            navigate('/require-login')
        }
    }, [token, location, navigate])

    return <Outlet />
}
export default React.memo(RequireAuthAmin)
