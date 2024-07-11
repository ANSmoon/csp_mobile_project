/* 

adminApiSlice.js
endpoint 설정

*/

import { apiSlice } from '../../app/api/apiSlice'

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // user list 사용자 조회
        userList: builder.query({
            query: () => ({
                url: '/admin',
                method: 'GET',
            }),
            providesTags: ['UserList'],
        }),
        // apply 서비스 신청내역 조회
        applyList: builder.query({
            query: () => ({
                url: '/admin/apply',
                method: 'GET',
            }),
            providesTags: ['ApplyList'],
        }),
        // 관리자페이지 회원정보수정
        adminEditUserInfo: builder.mutation({
            query: ({ id, info }) => ({
                url: `/admin/${id}`,
                method: 'PUT',
                body: {
                    ...info,
                },
            }),
            invalidatesTags: ['UserList'],
        }),
        // 사용자 승인
        approveMultiUsers: builder.mutation({
            query: (idList) => ({
                url: `/admin/${idList}/approve`,
                method: 'PUT',
                body: { ...idList },
            }),
            invalidatesTags: ['ApplyList', 'UserList'],
        }),
        // 만료
        expireUser: builder.mutation({
            query: (userIdToEdit) => {
                return {
                    url: `/admin/${userIdToEdit}/expire`,
                    method: 'PUT',
                }
            },
            invalidatesTags: ['UserList'],
        }),
        // 만료기간 연장
        extendExpirePeriod: builder.mutation({
            query: ({ id, date }) => ({
                url: `/admin/${id}/${date}`,
                method: 'PUT',
                body: { ...id, date },
            }),
            invalidatesTags: ['UserList'],
        }),
    }),
})

export const {
    useUserListQuery,
    useApplyListQuery,
    useAdminEditUserInfoMutation,
    useApproveMultiUsersMutation,
    useExpireUserMutation,
    useExtendExpirePeriodMutation,
} = adminApiSlice
