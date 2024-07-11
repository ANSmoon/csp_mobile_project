/* 

bannerApiSlice.js
endpoint 설정

*/

import { apiSlice } from '../../app/api/apiSlice'

export const bannerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 전체 배너 받아오기
        getBanner: builder.query({
            query: () => ({
                url: '/banner',
                method: 'GET',
            }),
            providesTags: ['Banner'],
        }),
        // 사용중인 배너 받아오기
        getUsingBanner: builder.query({
            query: () => ({
                url: `/banner/USING`,
                method: 'GET',
            }),
            providesTags: ['Banner'],
        }),

        // 사용할 배너 설정
        putBanner: builder.mutation({
            query: ({ bannerIdList }) => ({
                url: `/banner`,
                method: 'PUT',
                body: bannerIdList,
            }),
            invalidatesTags: ['Banner'],
        }),
        // 배너 이미지 파일 업로드
        postBanner: builder.mutation({
            query: ({ loginId, bannerName, file }) => {
                return {
                    url: `/banner/${loginId}/${bannerName}`,
                    method: 'POST',
                    body: file, // {} 로 감싸서 보내면 안되는듯함?
                    formData: true, // 굳이 하나마나 인것 같긴한데 일단 추가
                }
            },
            invalidatesTags: ['Banner'],
        }),
        // 배너 이미지 삭제
        deleteBanners: builder.mutation({
            query: ({ bannerIdList }) => {
                return {
                    url: `/banner`,
                    method: 'DELETE',
                    body: bannerIdList,
                }
            },
            invalidatesTags: ['Banner'],
        }),
    }),
})

export const {
    useGetBannerQuery,
    useGetUsingBannerQuery,
    usePutBannerMutation,
    usePostBannerMutation,
    useDeleteBannersMutation,
} = bannerApiSlice
