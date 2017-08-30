import { SET_LOGIN_INFO } from "../actions/loginActions"

export const loginReducer = (state = { },action) => {
    switch (action.type) {
        case SET_LOGIN_INFO:
            console.log("Set_Login_Info with data " + JSON.stringify(action.loginInfo));
            console.log("isLoggedIn set to " + action.isLoggedIn);
            var retValue = {
                ...state,
                isLoggedIn : action.isLoggedIn ,
                loginInfo: action.loginInfo,

            };
            console.log("new state is " + JSON.stringify(retValue));
            return retValue;
        default:
            return state;

    }
};

export default loginReducer;

