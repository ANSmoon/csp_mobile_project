/* 

apiSlice
- baseQuery 설정
- createApi로 Api 생성

token이 있는 경우 모든 요청의 헤더에 token을 포함해서 보냅니다.
응답이 403으로 오는경우 token이 만료된 것으로 로그아웃 처리하고 로그인 페이지로 이동시킵니다.

*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // React Router를 사용하고 있다고 가정합니다.

// netlify https client -> http server 문제 해결
const host =
    window.location.hostname === 'localhost'
        ? 'http://ec2-43-200-215-152.ap-northeast-2.compute.amazonaws.com:8080'
        : 'api'

// baseQuery 설정
const baseQuery = fetchBaseQuery({
    baseUrl: host,
    responseHandler: async (response) => {
        return response.json()
    },

    credentials: 'include', // 쿠키기반 인증
    // 헤더에 토큰 넣기
    prepareHeaders: (headers, { getState }) => {
        //const token = getState().auth.token  // 토큰값 가져오기. getState()는 redux에서 상태를 가져올때 사용하도록 제공함
        const token = localStorage.getItem('login-token')
        // 토큰이 있으면 헤더에 포함해서 보내기
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log('sending refresh token')
        // send refresh token to get new access token
        const refreshResult = await baseQuery(
            { url: '/api/token', method: 'POST' },
            api,
            extraOptions,
        )
        // refresh token이 없으면
        if (refreshResult.error) {
            // '/login'으로 이동(로그아웃)
            console.log('로그인이 만료되었습니다.', 403)
            window.location.href = '/login'
            alert('로그인이 만료되었습니다.')
            localStorage.removeItem('login-token')
        } else if (refreshResult?.data.accessToken) {
            // store the new token
            localStorage.setItem('login-token', refreshResult.data.accessToken)
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}

// api 생성
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['UserList', 'ApplyList', 'UserInfo', 'Banner'],
    endpoints: (builder) => ({}),
})
