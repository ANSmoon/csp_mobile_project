/* 

NAVBAR Component

일간, 주간, 월간 페이지로 이동할 수 있는 네비게이션바입니다.

*/

import { Link, useLocation } from 'react-router-dom'

const NAVBAR = () => {
    const location = useLocation()
    return (
        <nav className="fixed inset-x-0 -bottom-1 pt-2 pb-3 rounded-t-lg flex bg-white justify-around md:justify-center space-x-4">
            {[
                ['일간', '/day'],
                ['주간', '/week'],
                ['월간', '/month'],
            ].map(([title, url], key) => (
                <Link
                    key={key}
                    to={url}
                    className={
                        (location.pathname.startsWith(url)
                            ? 'bg-gray-100 text-gray-900 font-bold '
                            : 'font-medium ') +
                        'rounded-lg px-3 py-2 text-slate-700  hover:bg-gray-100 hover:text-gray-900'
                    }
                >
                    {title}
                </Link>
            ))}
        </nav>
    )
}

export default NAVBAR
