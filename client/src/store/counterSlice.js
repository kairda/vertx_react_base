import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    counterChanged(state, action) {
      state.value = action.payload
    },
  },
})

export const { counterChanged } = counterSlice.actions
export const selectCounter = (state) => state.counter.value
export default counterSlice.reducer
