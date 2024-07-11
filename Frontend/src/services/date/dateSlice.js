import { createSlice } from '@reduxjs/toolkit'
import getWeek from '../../function/getWeek'
import getPreviousDate from '../../function/getPreviousDate'
import getPreviousWeek from '../../function/getPreviousWeek'
import getPreviousMonth from '../../function/getPreviousMonth'
/* 

authSlice

- date 관련된 state 초기값 설정
- 현재 선택된 날짜를 redux로 관리해서 어느 컴포넌트와 페이지에서든 접근가능하도록한다.


- createSlice를하면 authSlice.actions와 authSlice.reducer가 생성된다.
각각을 따로 export 해주었다.

*/

// DB에 있는 날짜가 6월까지라서 7월1일을 오늘날짜로 설정함.
const date = new Date('2023-12-17') // month + 1 해야 실제 달
const prevDate = getPreviousDate(date)
const prevWeek = getPreviousWeek(date)
const prevMonth = getPreviousMonth(date)
console.log('date:', date, prevDate, prevWeek, prevMonth)

// 리듀서 생성
const dateSlice = createSlice({
    name: 'date',
    // state 초기값 설정
    initialState: {
        dateMonth: prevMonth,
        dateWeek: prevWeek,
        dateDay: `${date.getFullYear()}년 ${
            date.getMonth() + 1
        }월 ${date.getDate()}일`,
        isNowState: true,
    },
    reducers: {
        setDateMonth: (state, action) => {
            state.dateMonth = action.payload
        },
        setDateWeek: (state, action) => {
            state.dateWeek = action.payload
        },
        setDateDay: (state, action) => {
            state.dateDay = action.payload
        },
        setIsNowState: (state, action) => {
            state.isNowState = action.payload
        },
    },
})
export const { setDateMonth, setDateWeek, setDateDay, setIsNowState } =
    dateSlice.actions

export default dateSlice.reducer

export const selectCurrentDateMonth = (state) => state.date.dateMonth
export const selectCurrentDateWeek = (state) => state.date.dateWeek
export const selectCurrentDateDay = (state) => state.date.dateDay
export const selectCurrentIsNowState = (state) => state.date.isNowState
