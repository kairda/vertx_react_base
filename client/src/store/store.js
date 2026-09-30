import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import loginReducer from './loginSlice'

export function createStore(preloadedState) {
  return configureStore({
    reducer: {
      counter: counterReducer,
      login: loginReducer,
    },
    preloadedState,
  })
}

export const store = createStore()
