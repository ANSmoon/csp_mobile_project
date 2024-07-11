/*

store.js

- store 생성
- store에 reducer를 설정합니다.
- 미들웨어를 설정합니다.

*/
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import authReducer from '../services/auth/authSlice'
import dateReducer from '../services/date/dateSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        date: dateReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),

    devTools: true,
})
