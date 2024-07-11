import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'

import mokilogoImg from '../../assets/moki_logo.svg'
import HEADER from '../../component/common/Header'
import { useLoginMutation } from '../../services/auth/authApiSlice'
// import { setCredentials } from '../../services/auth/authSlice'
import Loading from '../../component/common/Loading'

const LoginPages = () => {
    const errRef = useRef()
    const [loginId, setLoginId] = useState('')
    const [loginPwd, setLoginPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [login, { isLoading }] = useLoginMutation()

    const navigate = useNavigate()
    // const dispatch = useDispatch()

    useEffect(() => {
        // 로그인 페이지에 들어오면 갖고있던 토큰을 삭제합니다.
        localStorage.removeItem('login-token')
        // 아이디나 비밀번호를 다시 입력하는 경우 에러 메시지를 초기화합니다.
        setErrMsg('')
    }, [loginId, loginPwd])
    const handleLogin = async (e) => {
        e.preventDefault()

        // 로그인 처리 로직
        // 예: 서버로 아이디와 비밀번호 전송, 토큰 발급 등
        try {
            const response = await login({
                loginId,
                loginPwd,
            }).unwrap()
            console.log('responseeee:', response)
            //dispatch(setCredentials({ ...userData, loginId })) // userData에 loginId 추가. userData 안에 액세스토큰 들어있음
            if (response.accessToken && response.branchName) {
                localStorage.setItem('login-token', response.accessToken)
                localStorage.setItem('store-name', response.branchName)
                console.log('로그인 성공')
            }

            setLoginId('')
            setLoginPwd('')
            // JWT 토큰 디코딩
            const decoded = jwt_decode(response.accessToken)
            console.log('decoded:', decoded)
            if (decoded.role === 'admin') {
                // role이 관리자면 /admin로 navigate
                navigate('/admin/user-list')
            } else if (
                decoded.role === 'user' &&
                decoded.state === 'permitted'
            ) {
                // role이 user면 /day로 navigate
                navigate('/day')
            } else if (
                decoded.role === 'user' &&
                decoded.state === 'waiting_permission'
            ) {
                // role이 user면 /day로 navigate
                navigate('/waiting-permission')
            } else if (
                decoded.role === 'user' &&
                decoded.state === 'no_permission'
            ) {
                // role이 user면 /day로 navigate
                navigate('/no-permission')
            }

            // 토큰을 실제로 받아오기 전까지 임시 navigate
            navigate('/day')
        } catch (err) {
            console.log('error: ', err)
            if (!err?.status) {
                setErrMsg('서버로부터 응답이 없습니다.')
            } else if (err.status === 401) {
                setErrMsg('아이디 또는 비밀번호를 잘못 입력하셨습니다.')
            } else {
                setErrMsg('로그인에 실패했습니다. 네트워크를 확인해주세요.')
            }
            errRef.current.focus()
        }
    }

    if (isLoading === true) {
        return <Loading />
    } else {
        return (
            <div className="bg-white">
                <section>
                    <HEADER></HEADER>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col p-20 pb-0 mt-6 md:px-40"
                    >
                        <img
                            src={mokilogoImg}
                            alt="moki-logo"
                            className="w-28 mx-auto"
                        />
                        <label className="mt-20">아이디</label>
                        <input
                            type="text"
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="border-b border-neutral-400 mt-4"
                            required
                        />
                        <label className="mt-4">비밀번호</label>
                        <input
                            type="password"
                            id="loginPwd"
                            value={loginPwd}
                            onChange={(e) => setLoginPwd(e.target.value)}
                            className="border-b border-neutral-400 mt-4"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-black text-white text-center rounded-lg mt-10 px-10 py-2"
                        >
                            로그인
                        </button>
                    </form>
                    <p
                        ref={errRef}
                        className={
                            (errMsg ? '' : 'hidden ') +
                            'text-sm text-center text-rose-400 mt-4'
                        }
                    >
                        {errMsg}
                    </p>
                </section>
            </div>
        )
    }
}

export default LoginPages
