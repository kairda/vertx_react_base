export const SET_COUNTER_VALUE = 'SET_COUNTER_VALUE'

export function getSetCounterValueAction(counter) {
    return { type: SET_COUNTER_VALUE, counter: counter }
}

export function handleBusinessMessages(dispatch, json) {

    if (json && json.counter) {
        console.log("Dispatching new counter value " + json.counter);
        dispatch(getSetCounterValueAction(json.counter));
        return true;
    }

    return false;

}
