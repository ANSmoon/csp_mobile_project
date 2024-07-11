import HEADER from '../../component/common/Header'
import { useNavigate } from 'react-router-dom'
const RequireLoginPages = () => {
    const navigate = useNavigate()
    function handleLoginClick() {
        navigate('/login')
    }
    return (
        <div className="flex flex-col space-y-4 justify-center items-center h-screen">
            <HEADER></HEADER>
            <button
                className="bg-black text-white text-center rounded-lg mt-10 px-10 py-2"
                onClick={handleLoginClick}
            >
                로그인이 필요합니다
            </button>
            <a
                href="https://www.moki.co.kr/"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-100 text-center rounded-lg mt-10 px-10 py-2"
            >
                moki 공식 홈페이지
            </a>
        </div>
    )
}

export default RequireLoginPages
