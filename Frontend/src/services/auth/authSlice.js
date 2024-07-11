import { createSlice } from '@reduxjs/toolkit'
/* 

authSlice

- auth와 관련된 state 초기값 설정
- 토큰을 관리하기위한 리듀서 생성
- 로컬 스토리지에 저장하는 것은 보안적 이유로 권장되지않습니다.


- createSlice를하면 authSlice.actions와 authSlice.reducer가 생성된다.
각각을 따로 export 해주었다.

*/

// 리듀서 생성
const authSlice = createSlice({
    name: 'auth',
    // state 초기값 설정
    initialState: { user: null, token: null },
    reducers: {
        // user정보와 token을 저장
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            state.user = user
            state.token = accessToken
        },
        // 로그아웃
        logOut: (state, action) => {
            state.user = null
            state.token = null
        },
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
