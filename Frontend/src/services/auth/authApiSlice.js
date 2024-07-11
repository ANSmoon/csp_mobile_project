/* 

authApiSlice.js
endpoint 설정

*/

import { apiSlice } from '../../app/api/apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials },
            }),
            invalidatesTags: ['UserInfo'],
        }),
    }),
})

export const { useLoginMutation } = authApiSlice
