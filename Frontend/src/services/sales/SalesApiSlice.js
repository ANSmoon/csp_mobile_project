/* 

authApiSlice.js
endpoint 설정

*/

import { apiSlice } from '../../app/api/apiSlice'

export const salesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Day ------------------------------------------------------
        daySales: builder.query({
            query: (date) => ({
                url: `/date/daily-sales?date=${date}`,
                method: 'GET',
            }),
        }),
        dayPredict: builder.query({
            query: (date) => ({
                url: `/predict/daily?date=${date}`,
                method: 'GET',
            }),
        }),
        menuDaySales: builder.query({
            query: (date) => ({
                url: `/menu/daily-sales?date=${date}`,
                method: 'GET',
            }),
        }),
        menuDaySalesDetail: builder.query({
            query: (date) => ({
                url: `/menu/daily-sales/detail?date=${date}`,
                method: 'GET',
            }),
        }),
        menuDayDiff: builder.query({
            query: (date) => ({
                url: `/menu/daily-diff?date=${date}`,
                method: 'GET',
            }),
        }),
        menuDayDiffDetail: builder.query({
            query: (date) => ({
                url: `/menu/daily-diff/detail?date=${date}`,
                method: 'GET',
            }),
        }),

        // Week ------------------------------------------------------
        weekSales: builder.query({
            query: (date) => ({
                url: `date/weekly-sales?dateString=${date}`,
                method: 'GET',
            }),
        }),
        weekPredict: builder.query({
            query: (date) => ({
                url: `predict/weekly?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuWeekSales: builder.query({
            query: (date) => ({
                url: `menu/weekly-sales?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuWeekSalesDetail: builder.query({
            query: (date) => ({
                url: `menu/weekly-sales/detail?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuWeekDiff: builder.query({
            query: (date) => ({
                url: `/menu/weekly-diff?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuWeekDiffDetail: builder.query({
            query: (date) => ({
                url: `/menu/weekly-diff/detail?dateString=${date}`,
                method: 'GET',
            }),
        }),
        // Month ------------------------------------------------------
        monthSales: builder.query({
            query: (date) => ({
                url: `date/monthly-sales?dateString=${date}`,
                method: 'GET',
            }),
        }),
        monthPredict: builder.query({
            query: (date) => ({
                url: `predict/monthly?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuMonthSales: builder.query({
            query: (date) => ({
                url: `menu/monthly-sales?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuMonthSalesDetail: builder.query({
            query: (date) => ({
                url: `menu/monthly-sales/detail?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuMonthDiff: builder.query({
            query: (date) => ({
                url: `/menu/monthly-diff?dateString=${date}`,
                method: 'GET',
            }),
        }),
        menuMonthDiffDetail: builder.query({
            query: (date) => ({
                url: `/menu/monthly-diff/detail?dateString=${date}`,
                method: 'GET',
            }),
        }),
    }),
})

export const {
    //
    useDaySalesQuery,
    useWeekSalesQuery,
    useMonthSalesQuery,
    //
    useDayPredictQuery,
    useWeekPredictQuery,
    useMonthPredictQuery,
    //
    useMenuDaySalesQuery,
    useMenuMonthSalesQuery,
    useMenuWeekSalesQuery,
    //
    useMenuDaySalesDetailQuery,
    useMenuMonthSalesDetailQuery,
    useMenuWeekSalesDetailQuery,
    //
    useMenuDayDiffQuery,
    useMenuWeekDiffQuery,
    useMenuMonthDiffQuery,
    //
    useMenuDayDiffDetailQuery,
    useMenuWeekDiffDetailQuery,
    useMenuMonthDiffDetailQuery,
} = salesApiSlice
