import { SET_COUNTER_VALUE, SET_LOGIN_INFO } from '../actions/actions'

export const counterReducer = (state = { },action) => {
    switch (action.type) {
        case SET_COUNTER_VALUE:
            return {
                ...state,
                counter: action.counter
            };
        case SET_LOGIN_INFO:
            console.log("Set_Login_Info with data " + JSON.stringify(action.loginInfo));
            return {
                ...state,
                loginInfo: JSON.stringify(action.loginInfo)
            };
        default:
            return state;

    }
};


