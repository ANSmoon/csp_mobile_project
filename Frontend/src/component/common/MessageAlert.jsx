/* 

MessageAlert Component

화면 하단에 잠깐 떴다가 사라지는 메시지 컴포넌트입니다.
사용자에게 사용법 등을 간단하게 알리는데에 사용됩니다.

*/

import React, { useState, useEffect } from 'react'

const MessageAlert = ({ message, timeout }) => {
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        setShowMessage(true)
        const timer = setTimeout(() => {
            setShowMessage(false)
        }, timeout)

        return () => clearTimeout(timer)
    }, [message, timeout])

    return (
        <div
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-8 py-2 text-white rounded-3xl shadow whitespace-nowrap ${
                showMessage ? 'opacity-100' : 'opacity-0'
            } transition-opacity`}
        >
            {message}
        </div>
    )
}

export default MessageAlert
