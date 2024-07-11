/* 

settingApiSlice.js
endpoint 설정

*/

import { apiSlice } from '../../app/api/apiSlice'

export const settingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 회원정보조회
        userInfo: builder.query({
            query: () => ({
                url: '/user',
                method: 'GET',
            }),
            providesTags: ['UserInfo'],
        }),
        // 회원정보수정
        editUserInfo: builder.mutation({
            query: ({ changedUserInfo }) => ({
                url: `/user`,
                method: 'PUT',
                body: { ...changedUserInfo },
            }),
            invalidatesTags: ['UserInfo'],
        }),
        // 서비스 신청
        apply: builder.mutation({
            query: ({ month }) => ({
                url: `/user/${month}`,
                method: 'PUT',
                body: {},
            }),
            invalidatesTags: ['UserInfo'],
        }),
    }),
})

export const { useUserInfoQuery, useEditUserInfoMutation, useApplyMutation } =
    settingApiSlice
