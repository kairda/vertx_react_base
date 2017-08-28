
import Request from 'superagent';


export const SET_COUNTER_VALUE = 'SET_COUNTER_VALUE'


export function getSetCounterValueAction(counter) {
    return { type: SET_COUNTER_VALUE, counter: counter }
}



export function doServerCall(dispatch) {

    // now we call the server to increment the counter ....


    Request.get('/api/counter')
        .end(function(err, res) {

            // console.log("We got an answer " + JSON.stringify(err) + " " + JSON.stringify(res));

            // this dispatches the new Action to all the reducers ...
            dispatch(getSetCounterValueAction(res.body.counter));
        });

}
