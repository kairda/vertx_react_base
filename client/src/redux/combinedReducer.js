import { combineReducers } from 'redux'

import { loginReducer } from './loginReducer';
import { counterReducer } from './counterReducer'
import { baseReducer } from './baseReducer'


export const reducer = combineReducers( {
    counter: counterReducer,
    login : loginReducer,
    base : baseReducer
})

export default reducer;