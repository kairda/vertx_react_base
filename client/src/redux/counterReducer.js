
import { SET_COUNTER_VALUE } from "../actions/businessActions"


export const counterReducer = (state = { },action) => {
    switch (action.type) {
        case SET_COUNTER_VALUE:
            return {
                ...state,
                counter: action.counter
            };
        default:
            return state;

    }
};

export default counterReducer;


