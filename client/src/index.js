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

const wsURL = (path)  => {
    var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    var url = protocol + location.host;
    if(location.hostname === 'localhost') {
        url += '/' + location.pathname.split('/')[1]; // add context path
    }
    // console.log("WebsocketConnection:"+url+path);
    return url + path;
}

var ws = new WebSocket(wsURL('eventbus/counter'));
ws.onopen = (event) => { console.log("received event on open " + JSON.stringify(event))};
ws.onmessage =  (msg) => { console.log("websocket on Message  " + JSON.stringify(msg))};

/* var eb = new EventBus("http://localhost:8080/eventbus");

eb.onopen = function () {
    eb.registerHandler("counter", function (err, msg) {
        console.log("counter eventbus onopen .... " + JSON.stringify(msg));
        store.dispatch(getSetCounterValueAction(msg.body) );
//        var str = "<code>" + msg.body + "</code><br>";
//        $('#status').prepend(str);
    })
} */


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
