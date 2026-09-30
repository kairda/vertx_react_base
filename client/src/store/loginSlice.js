import { createSlice } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',
  initialState: { isLoggedIn: false, user: null, error: null },
  reducers: {
    loggedIn(state, action) {
      state.isLoggedIn = true
      state.user = action.payload
      state.error = null
    },
    loggedOut(state) {
      state.isLoggedIn = false
      state.user = null
    },
    loginFailed(state, action) {
      state.isLoggedIn = false
      state.user = null
      state.error = action.payload
    },
  },
})

export const { loggedIn, loggedOut, loginFailed } = loginSlice.actions
export const selectIsLoggedIn = (state) => state.login.isLoggedIn
export const selectUser = (state) => state.login.user
export const selectLoginError = (state) => state.login.error
export default loginSlice.reducer
