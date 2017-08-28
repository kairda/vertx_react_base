
import Request from 'superagent';


export const SET_COUNTER_VALUE = 'SET_COUNTER_VALUE'
export const SET_LOGIN_INFO = 'SET_LOGIN_INFO'


export function getSetCounterValueAction(counter) {
    return { type: SET_COUNTER_VALUE, counter: counter }
}

export function getSetLoginInfoAction(loginInfo) {
    return { type: SET_LOGIN_INFO, loginInfo: loginInfo }
}


export function doServerCall(dispatch) {

    // now we call the server to increment the counter ....


    Request.get('/api/counter')
        .end(function(err, res) {


            if (res !== 'undefined' && res && res.body !== 'undefined' && res.body && res.body.counter) {
                // console.log("We got an answer " + JSON.stringify(err) + " " + JSON.stringify(res));

                // this dispatches the new Action to all the reducers ...
                dispatch(getSetCounterValueAction(res.body.counter));
            }
        });

}

export function doCheckLogin(dispatch) {

    // now we call the server to increment the counter ....


    Request.get('/api/isLoggedIn')
        .end(function(err, res) {

            console.log("We got an answer " + JSON.stringify(err) + " " + JSON.stringify(res));

            if (res.body !== 'undefined' && res.body.isLoggedIn) {
                dispatch(getSetLoginInfoAction(res.body.user));
            } else {
                dispatch(getSetLoginInfoAction("not logged in"));
            }
        });

}

