import React from 'react';
import { render } from 'react-dom';


import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { counterReducer} from "./redux/counterReducer"

import { doServerCall, doCheckLogin, getSetCounterValueAction } from "./actions/actions"


import EventBus from  './eventbus/vertx-eventbus';

const store = createStore(
    counterReducer, { counter : 0, loginInfo : "Not logged in" }
);

// this does the initial call to the server to that the value of the counter
// is incremented when the app starts.


var eb = new EventBus("http://localhost:8080/eventbus");

eb.onopen = function () {
    eb.registerHandler("counter", function (err, msg) {
        console.log("counter eventbus onopen .... " + JSON.stringify(msg));
        store.dispatch(getSetCounterValueAction(msg.body) );
//        var str = "<code>" + msg.body + "</code><br>";
//        $('#status').prepend(str);
    })
}


doCheckLogin(store.dispatch);

doServerCall(store.dispatch);

import NavBar from './NavBar';

import App from './App';

let app = <App />
// having the "Provider" with the global store
// allows App to be connected ... (see App.js)
render((
    <Provider store={store}>
        <NavBar content={app}/>
    </Provider>
    )
    , document.getElementById("root"));
